#!/usr/bin/env bun
// All-in-one contribution reconciler. GitHub is the source of truth for PR
// state; src/data/contributions.ts is the source of truth for content, and
// every surface derives from it.
//
//   bun reconcile      audit: discover every external PR the account authored,
//                      verify the data file and all derived surfaces against
//                      live GitHub, report release status. Exits 1 on drift.
//   bun reconcile:fix  reconcile: scaffold new merged and open PRs, move landed
//                      open PRs to merged, drop closed ones, refresh
//                      patchesCount, reorder repo groups (count desc, then
//                      earliest merge), regenerate contributions.md, now.md,
//                      and public/resume.md, sync prose count literals,
//                      recompile the resume PDF when its source changes.
//
// Flags: --release-days=N|all   release-status window (default 30, 0 = off)
//        --no-ai                skip Claude-drafted copy for new scaffolds
//                               (fix mode drafts via `claude -p` when on PATH;
//                               any failure falls back to the mechanical scaffold)

import { $ } from "bun";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  merged as dataMerged,
  open as dataOpen,
  patchesCount as dataPatches,
  type Contribution,
} from "../src/data/contributions.ts";
// One import-merge detector and one ledger parser, shared with prw and the
// patches reconciler; the repos are sibling checkouts.
import { detectImportMerge } from "../../patches/scripts/merge.ts";
import {
  parseMergedRows,
  parseOpenRows,
} from "../../patches/scripts/readme.ts";
import {
  bumpLastNumber,
  cleanTitle,
  key,
  lastPullLink,
  mergedListBlock,
  openListBlock,
  orderGroups,
  pageSection,
  publicResume,
  serializeData,
} from "./content.ts";

const ROOT = join(import.meta.dir, "..");
const DATA_PATH = join(ROOT, "src/data/contributions.ts");
const PATCHES_README =
  process.env.PATCHES_README ?? join(ROOT, "..", "patches", "README.md");

const fixMode = process.argv.includes("--fix");
const daysFlag = process.argv
  .find(a => a.startsWith("--release-days="))
  ?.split("=")[1];
const releaseDays = daysFlag === "all" ? Infinity : Number(daysFlag ?? 30);

const drift: string[] = []; // check-mode failures
const applied: string[] = []; // fix-mode actions taken
const manual: string[] = []; // needs a human either way
const act = (msg: string) => (fixMode ? applied : drift).push(msg);

// ---------- live state, straight from the GitHub CLI ----------

// gh flakes under burst pressure (up to ~25 parallel calls here, often right
// after prw audit's own searches); retry once with a beat of backoff, then
// let the failure crash loud — an audit without GitHub data is no audit
async function retryOnce<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch {
    await Bun.sleep(2000);
    return run();
  }
}

const AUTHOR = (
  await retryOnce(() => $`gh api user --jq .login`.quiet())
).stdout
  .toString()
  .trim();

type LivePR = {
  repo: string;
  number: number;
  state: string; // MERGED | OPEN | CLOSED | IMPORT_MERGED
  title: string;
  labels: string[];
  mergeSha: string | null;
  mergedAt: string | null;
};

// One search finds every public PR the account ever authored; external means
// someone else's repo. Union with repos already in the data so search-index
// lag can never make a tracked PR read as deleted.
const searchRaw = await retryOnce(() =>
  $`gh search prs is:public --author ${AUTHOR} --limit 1000 --json repository`.quiet(),
);
const searchRows = JSON.parse(searchRaw.stdout.toString()) as {
  repository: { nameWithOwner: string };
}[];
if (searchRows.length >= 1000)
  throw new Error("gh search hit the 1000-result cap — results truncated");
const repos = new Set(
  searchRows
    .map(r => r.repository.nameWithOwner)
    .filter(r => !r.startsWith(`${AUTHOR}/`)),
);
for (const c of [...dataMerged, ...dataOpen]) repos.add(c.repo);

const live: LivePR[] = (
  await Promise.all(
    [...repos].sort().map(async repo => {
      // A renamed repo would double-scaffold: search returns the new name
      // while gh follows the redirect on the old one, so the same PRs read
      // as two repos. Refuse until the data uses the canonical name.
      const canonical = (
        await retryOnce(() => $`gh api repos/${repo} --jq .full_name`.quiet())
      ).stdout
        .toString()
        .trim();
      if (canonical !== repo)
        throw new Error(
          `${repo} is now ${canonical} on GitHub. Update contributions.ts and the prose, then rerun`,
        );
      const out = await retryOnce(() =>
        $`gh pr list -R ${repo} --author ${AUTHOR} --state all --limit 200 --json number,state,title,labels,mergeCommit,mergedAt,closedAt`.quiet(),
      );
      type Raw = {
        number: number;
        state: string;
        title: string;
        labels: { name: string }[];
        mergeCommit: { oid: string } | null;
        mergedAt: string | null;
        closedAt: string | null;
      };
      return (JSON.parse(out.stdout.toString()) as Raw[]).map(p => ({
        repo,
        number: p.number,
        state: p.state,
        title: p.title,
        labels: p.labels.map(l => l.name),
        mergeSha: p.mergeCommit?.oid ?? null,
        mergedAt: p.mergedAt ?? p.closedAt,
      }));
    }),
  )
).flat();

// Meta's codesync bot lands PRs via internal import: GitHub reports CLOSED,
// the bot applies a "Merged" label and comments the landed sha. Read every
// closed PR's comments so a landed import is never counted as closed, and an
// abandoned import is never counted as merged.
await Promise.all(
  live
    .filter(p => p.state === "CLOSED")
    .map(async p => {
      const out = await retryOnce(() =>
        $`gh pr view ${p.number} -R ${p.repo} --json comments`.quiet(),
      );
      const { comments } = JSON.parse(out.stdout.toString()) as {
        comments: { author: { login: string }; body: string }[];
      };
      const imported = detectImportMerge(comments, p.labels);
      if (imported) {
        p.state = "IMPORT_MERGED";
        p.mergeSha = imported.sha ?? p.mergeSha;
      }
    }),
);

const liveMerged = live.filter(
  p => p.state === "MERGED" || p.state === "IMPORT_MERGED",
);
const liveOpen = live.filter(p => p.state === "OPEN");
const liveByKey = new Map(live.map(p => [key(p), p]));
const liveMergedKeys = new Set(liveMerged.map(key));
const liveOpenKeys = new Set(liveOpen.map(key));

// ---------- reconcile the data file against GitHub ----------

// Claude drafts editorial copy for new scaffolds (headless, structured output).
// Optional by design: no claude on PATH, --no-ai, or any failure falls back to
// the mechanical cleanTitle scaffold plus the usual "needs a human" note.
const useAI =
  fixMode && !process.argv.includes("--no-ai") && !!Bun.which("claude");
const DRAFT_SCHEMA = JSON.stringify({
  type: "object",
  properties: { title: { type: "string" }, detail: { type: "string" } },
  required: ["title", "detail"],
});

async function draftCopy(
  p: LivePR,
): Promise<{ title: string; detail: string } | null> {
  if (!useAI) return null;
  try {
    const body = (
      await $`gh pr view ${p.number} -R ${p.repo} --json body --jq .body`
        .quiet()
        .text()
    ).slice(0, 4000);
    const prompt = [
      "Write ledger copy for one upstream PR on a personal contributions site.",
      `PR: ${p.repo}#${p.number} — ${p.title}`,
      `PR body:\n${body}`,
      "",
      "title: one terse line, imperative verb first (add/fix/drop/wire), lowercase",
      "first word unless a proper noun, under 90 chars, no trailing period.",
      "detail: one or two sentences, what changed and why it matters, plain words.",
      "Never use em dashes, semicolons, or the words: comprehensive, robust,",
      "seamless, leverage, utilize, facilitate, enhance, streamline.",
    ].join("\n");
    // spawn with a hard timeout: a stalled claude must not hang the whole run
    const proc = Bun.spawn(
      [
        "claude",
        "-p",
        "--bare",
        "--output-format",
        "json",
        "--json-schema",
        DRAFT_SCHEMA,
        prompt,
      ],
      { stdout: "pipe", stderr: "ignore" },
    );
    const timer = setTimeout(() => proc.kill(), 120_000);
    const raw = await new Response(proc.stdout).text();
    clearTimeout(timer);
    const out = (
      JSON.parse(raw) as {
        structured_output?: { title?: string; detail?: string };
      }
    ).structured_output;
    if (!out?.title?.trim() || !out?.detail?.trim()) return null;
    const copy = out.title + " " + out.detail;
    if (/[—–;]/.test(copy)) return null;
    if (
      /\b(comprehensive|robust|seamless|leverage|utilize|facilitate|enhance|streamline)\b/i.test(
        copy,
      )
    )
      return null;
    return {
      title: out.title.trim().replace(/\.$/, ""),
      detail: out.detail.trim(),
    };
  } catch {
    return null;
  }
}

for (const c of dataMerged)
  if (!liveMergedKeys.has(key(c))) {
    const l = liveByKey.get(key(c));
    if (!l)
      throw new Error(`${key(c)} not found on GitHub — refusing to reconcile`);
    act(
      `contributions.ts: ${key(c)} is listed merged but GitHub says ${l.state}${fixMode ? " — removed" : ""}`,
    );
  }
const desiredMerged = dataMerged.filter(c => liveMergedKeys.has(key(c)));

for (const p of liveMerged
  .filter(p => !dataMerged.some(c => key(c) === key(p)))
  .sort((a, b) => a.number - b.number)) {
  const carried = dataOpen.find(c => key(c) === key(p));
  const entry: Contribution = carried
    ? { ...carried }
    : { repo: p.repo, number: p.number, title: cleanTitle(p.title) };
  let drafted = false;
  if (!carried) {
    const draft = await draftCopy(p);
    if (draft) {
      entry.title = draft.title;
      if (draft.detail !== draft.title) entry.detail = draft.detail;
      drafted = true;
    }
  }
  const at = desiredMerged.findIndex(c => c.repo === p.repo);
  if (at === -1) desiredMerged.push(entry);
  else desiredMerged.splice(at, 0, entry);
  act(
    carried
      ? `contributions.ts: open ${key(p)} merged upstream — ${fixMode ? "moved to merged" : "--fix moves it to merged"}`
      : `contributions.ts: merged ${key(p)} is missing — ${fixMode ? (drafted ? "drafted title and detail" : "scaffolded from the upstream title") : "--fix scaffolds it"}`,
  );
  manual.push(
    carried
      ? `polish the detail for ${key(p)} in src/data/contributions.ts`
      : drafted
        ? `review the drafted title and detail for ${key(p)} in src/data/contributions.ts`
        : `polish the title and detail for ${key(p)} in src/data/contributions.ts`,
  );
}

const desiredOpen = dataOpen.filter(c => {
  if (liveOpenKeys.has(key(c))) return true;
  if (!liveMergedKeys.has(key(c)))
    act(
      `contributions.ts: open ${key(c)} closed without merging — ${fixMode ? "dropped" : "--fix drops it"}`,
    );
  return false; // merged moves were reported above
});
for (const p of liveOpen
  .filter(p => !dataOpen.some(c => key(c) === key(p)))
  .sort((a, b) => a.number - b.number)) {
  const draft = await draftCopy(p);
  desiredOpen.push({
    repo: p.repo,
    number: p.number,
    title: draft?.title ?? cleanTitle(p.title),
  });
  act(
    `contributions.ts: open ${key(p)} is missing — ${fixMode ? (draft ? "drafted title" : "scaffolded from the upstream title") : "--fix scaffolds it"}`,
  );
  manual.push(
    draft
      ? `review the drafted title for ${key(p)} in src/data/contributions.ts`
      : `polish the title for ${key(p)} in src/data/contributions.ts`,
  );
}

// The resume's open sentence enumerates specific open PRs ("2 source fixes to
// facebook/hermes"), which no count check covers. Any change to the open set
// means that prose needs a re-read.
const openSet = (l: Contribution[]) => l.map(key).sort().join(" ");
if (openSet(desiredOpen) !== openSet(dataOpen))
  manual.push(
    "the open-PR set changed: re-read the open sentence in src/pages/resume.md and resume/resume.typ",
  );

// patchesCount mirrors the ledger row count (Open + Merged tables), parsed
// with the patches repo's own parsers so both tools agree on what a row is.
// The sibling checkout is a hard requirement (the parsers import from it), so
// a missing README is a broken setup, not a skippable check.
if (!existsSync(PATCHES_README))
  throw new Error(`patches README not found at ${PATCHES_README}`);
const patchesReadme = readFileSync(PATCHES_README, "utf8");
const patches =
  parseOpenRows(patchesReadme).length + parseMergedRows(patchesReadme).length;
if (patches !== dataPatches)
  act(
    `contributions.ts: patchesCount is ${dataPatches}, the patches README has ${patches}${fixMode ? " — updated" : ""}`,
  );

// The data file is the source everything derives from. If it disagrees with
// GitHub, downstream checks are meaningless — stop here and fix it first.
if (!fixMode && drift.length) {
  console.log("Data file is out of sync with GitHub (reconcile it first):");
  for (const d of drift) console.log(`  ✗ ${d}`);
  process.exit(1);
}

const firstMerge = new Map<string, string>();
for (const p of liveMerged)
  if (p.mergedAt && p.mergedAt < (firstMerge.get(p.repo) ?? "~"))
    firstMerge.set(p.repo, p.mergedAt);
const orderedMerged = orderGroups(desiredMerged, firstMerge);

const distinct = (l: Contribution[]) => new Set(l.map(c => c.repo)).size;
const repoCount = (repo: string) =>
  orderedMerged.filter(c => c.repo === repo).length;
const canon = {
  merged: orderedMerged.length,
  mergedRepos: distinct(orderedMerged),
  expo: repoCount("expo/expo"),
  shadcn: repoCount("shadcn-ui/ui"),
  convexBetterAuth: repoCount("get-convex/better-auth"),
  betterAuth: repoCount("better-auth/better-auth"),
  fumadocs: repoCount("fuma-nama/fumadocs"),
  compilerRs: repoCount("withastro/compiler-rs"),
  open: desiredOpen.length,
  openRepos: distinct(desiredOpen),
  patches,
};

// ---------- regenerate the data file when its data changed ----------

const snap = (l: Contribution[]) =>
  JSON.stringify(l.map(c => [c.repo, c.number, c.title, c.detail ?? null]));
const dataChanged =
  snap(orderedMerged) !== snap(dataMerged) ||
  snap(desiredOpen) !== snap(dataOpen) ||
  patches !== dataPatches;
if (dataChanged && fixMode) {
  writeFileSync(DATA_PATH, serializeData(orderedMerged, desiredOpen, patches));
  await $`bunx oxfmt --write ${DATA_PATH}`.nothrow().quiet();
  applied.push("regenerated src/data/contributions.ts");
} else if (dataChanged) {
  // states already match GitHub past the gate, so this is pure group order
  drift.push("contributions.ts: group order is stale, run bun reconcile:fix");
}

// ---------- regenerate the markdown surfaces ----------

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function replaceBlock(
  path: string,
  mark: string,
  body: string,
  label: string,
): boolean {
  const abs = join(ROOT, path);
  const text = readFileSync(abs, "utf8");
  const start = `<!-- ${mark}:start -->`;
  const end = `<!-- ${mark}:end -->`;
  const re = new RegExp(`${escapeRe(start)}[\\s\\S]*?${escapeRe(end)}`);
  if (!re.test(text)) {
    drift.push(`${path}: missing ${start} markers`);
    return false;
  }
  // Blank line after the start marker, none before the end: the shape oxfmt
  // normalizes markdown to, so `bun format` never fights the generator.
  const next = `${start}\n\n${body}\n${end}`;
  if (text.includes(next)) return false;
  if (fixMode) {
    // replacement function so a `$` in PR detail text isn't a replace pattern
    writeFileSync(
      abs,
      text.replace(re, () => next),
    );
    applied.push(`regenerated the ${label} in ${path}`);
    return true;
  }
  drift.push(`${path}: ${label} is stale — run bun reconcile:fix`);
  return false;
}

replaceBlock(
  "src/pages/contributions.md",
  "contributions",
  mergedListBlock(orderedMerged),
  "merged-PR list",
);

if (
  replaceBlock(
    "src/pages/now.md",
    "open-prs",
    openListBlock(desiredOpen),
    "open-PR list",
  )
) {
  const abs = join(ROOT, "src/pages/now.md");
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(
    abs,
    readFileSync(abs, "utf8").replace(
      /Last updated: \d{4}-\d{2}-\d{2}\./,
      `Last updated: ${today}.`,
    ),
  );
}

// contributions.md's patches sections mirror the patches README's ledger but
// their wording is editorial, so they can't be generated. Check the PR sets
// match instead: README Open rows against the site's "#### Open" bullets, and
// README Merged rows still marked `unreleased` against "#### Merged". Rows
// with a real Fixed-in version are Dropped history, left editorial. A row's
// own PR link is the last /pull/ link in it.
const prKey = (pr: { owner: string; repo: string; number: number }) =>
  `${pr.owner}/${pr.repo}#${pr.number}`;
const ledgerSet = (
  rows: { pr: { owner: string; repo: string; number: number } | null }[],
) => new Set(rows.flatMap(r => (r.pr ? [prKey(r.pr)] : [])));
const bulletSet = (text: string, header: string) =>
  new Set(
    pageSection(text, header, "#### ")
      .split("\n")
      .filter(l => l.startsWith("- "))
      .map(lastPullLink)
      .filter((k): k is string => k !== null),
  );
const cmText = readFileSync(join(ROOT, "src/pages/contributions.md"), "utf8");
const parity: [string, Set<string>, Set<string>][] = [
  [
    "Open",
    ledgerSet(parseOpenRows(patchesReadme)),
    bulletSet(cmText, "#### Open"),
  ],
  [
    "Merged",
    ledgerSet(
      parseMergedRows(patchesReadme).filter(r => r.marker === "unreleased"),
    ),
    bulletSet(cmText, "#### Merged"),
  ],
];
for (const [name, readmeSet, cmSet] of parity) {
  for (const k of readmeSet)
    if (!cmSet.has(k))
      (fixMode ? manual : drift).push(
        `contributions.md: patches ${name} section is missing ${k} (in the patches README) — manual edit`,
      );
  for (const k of cmSet)
    if (!readmeSet.has(k))
      (fixMode ? manual : drift).push(
        `contributions.md: patches ${name} section lists ${k}, not in the patches README — manual edit`,
      );
}

// ---------- prose count literals that can't import the data ----------

type Key = keyof typeof canon;
type Check = { file: string; re: RegExp; key: Key };

// Repos with a per-repo (N) count in the resume enumeration. The label is the
// link text there. Every other repo sits in the prose tail with one merged PR.
const COUNTED: { key: Key; repo: string; label: string }[] = [
  { key: "expo", repo: "expo/expo", label: "expo/expo" },
  { key: "shadcn", repo: "shadcn-ui/ui", label: "shadcn-ui/ui" },
  {
    key: "convexBetterAuth",
    repo: "get-convex/better-auth",
    label: "get-convex/better-auth",
  },
  { key: "betterAuth", repo: "better-auth/better-auth", label: "better-auth" },
  { key: "fumadocs", repo: "fuma-nama/fumadocs", label: "fumadocs" },
  {
    key: "compilerRs",
    repo: "withastro/compiler-rs",
    label: "withastro/compiler-rs",
  },
];

// A tail repo's second merged PR makes the resume undercount it: the totals
// auto-fix but its tail entry still links one PR. Loud until a human promotes
// it into the enumeration and this table.
const countedRepos = new Set(COUNTED.map(r => r.repo));
for (const repo of new Set(orderedMerged.map(c => c.repo)))
  if (!countedRepos.has(repo) && repoCount(repo) > 1)
    (fixMode ? manual : drift).push(
      `resume: ${repo} has ${repoCount(repo)} merged PRs, promote it out of the prose tail and add it to COUNTED`,
    );

const CHECKS: Check[] = [
  {
    file: "src/pages/contributions.md",
    re: /(\d+) PRs merged across/g,
    key: "merged",
  },
  {
    file: "src/pages/contributions.md",
    re: /PRs merged across (\d+) upstream repos/g,
    key: "mergedRepos",
  },
  {
    file: "src/pages/contributions.md",
    re: /(\d+) drop-in fixes/g,
    key: "patches",
  },
  {
    file: "src/pages/contributions.md",
    re: /(\d+) patches: drop-in/g,
    key: "patches",
  },
  {
    file: "src/pages/about.md",
    re: /(\d+) merged PRs upstream/g,
    key: "merged",
  },
  {
    file: "src/pages/about.md",
    re: /(\d+) patches across Bun/g,
    key: "patches",
  },
  ...["src/pages/resume.md", "resume/resume.typ"].flatMap((file): Check[] => [
    { file, re: /(\d+) PRs merged upstream to Expo/g, key: "merged" },
    { file, re: /(\d+) PRs merged upstream across/g, key: "merged" },
    { file, re: /merged upstream across (\d+) repos/g, key: "mergedRepos" },
    { file, re: /(\d+) patches for Bun/g, key: "patches" },
    { file, re: /(\d+) more open across/g, key: "open" },
    { file, re: /more open across (\d+) repos/g, key: "openRepos" },
  ]),
  // per-repo counts in the resume's repo enumeration; md links carry a (url),
  // typ links put the label after #link("url")
  ...COUNTED.flatMap(({ key, label }): Check[] => [
    {
      file: "src/pages/resume.md",
      re: new RegExp(`\\[${escapeRe(label)}\\]\\([^)]+\\) \\((\\d+)\\)`, "g"),
      key,
    },
    {
      file: "resume/resume.typ",
      re: new RegExp(`\\[${escapeRe(label)}\\] \\((\\d+)\\)`, "g"),
      key,
    },
  ]),
  {
    file: "src/pages/resume.md",
    re: /(\d+) merged PRs upstream/g,
    key: "merged",
  },
  // two Selected-PRs bullets restate their repo's count in prose
  {
    file: "src/pages/resume.md",
    re: /\[get-convex\/better-auth\]\([^)]+\): (\d+) merged PRs/g,
    key: "convexBetterAuth",
  },
  {
    file: "src/pages/resume.md",
    re: /\[shadcn-ui\/ui\]\([^)]+\): (\d+) merged PRs/g,
    key: "shadcn",
  },
  {
    file: "resume/resume.typ",
    re: /\[get-convex\/better-auth\]\]: (\d+) merged PRs/g,
    key: "convexBetterAuth",
  },
  {
    file: "resume/resume.typ",
    re: /\[shadcn-ui\/ui\]\]: (\d+) merged PRs/g,
    key: "shadcn",
  },
];

let resumeTypChanged = false;
for (const c of CHECKS) {
  const path = join(ROOT, c.file);
  let text = readFileSync(path, "utf8");
  const want = canon[c.key];
  const matches = [...text.matchAll(c.re)];
  if (matches.length === 0) {
    drift.push(`${c.file}: no match for /${c.re.source}/`);
    continue;
  }
  if (!matches.some(m => Number(m[1]) !== want)) continue;
  if (fixMode) {
    text = text.replace(c.re, span => bumpLastNumber(span, want));
    writeFileSync(path, text);
    if (c.file === "resume/resume.typ") resumeTypChanged = true;
    applied.push(`fixed ${c.file}: ${c.key} -> ${want}`);
    // the resume's repo-count sentences carry an editorial name list, so a
    // changed repo count means a repo joined or left the enumeration there.
    // contributions.md states the bare count with no list, nothing to edit.
    if (
      (c.key === "mergedRepos" || c.key === "openRepos") &&
      c.file !== "src/pages/contributions.md"
    )
      manual.push(
        `${c.file}: ${c.key} changed to ${want} — work the repo in or out of the name list in the same sentence`,
      );
  } else {
    for (const m of matches)
      if (Number(m[1]) !== want)
        drift.push(
          `${c.file}: ${c.key} is ${m[1]}, expected ${want}  ("${m[0]}")`,
        );
  }
}

if (fixMode && resumeTypChanged) {
  await $`typst compile ${join(ROOT, "resume/resume.typ")} ${join(ROOT, "public/resume.pdf")}`;
  applied.push("recompiled public/resume.pdf");
}

// public/resume.md derives from the page source, after any count fixes above.
const pubPath = join(ROOT, "public/resume.md");
const pubWant = publicResume(
  readFileSync(join(ROOT, "src/pages/resume.md"), "utf8"),
);
if (readFileSync(pubPath, "utf8") !== pubWant) {
  if (fixMode) {
    writeFileSync(pubPath, pubWant);
    applied.push("regenerated public/resume.md");
  } else drift.push("public/resume.md: stale, run bun reconcile:fix");
}

// ---------- release status (informational, never fails the run) ----------

const releaseLines: string[] = [];
if (releaseDays > 0) {
  const cutoff = Date.now() - releaseDays * 86_400_000;
  const recent = liveMerged
    .filter(p => p.mergedAt && new Date(p.mergedAt).getTime() >= cutoff)
    .sort((a, b) => (a.mergedAt! < b.mergedAt! ? 1 : -1));
  type Release = { tag_name: string; published_at: string };
  const latest = new Map<string, Release | null>();
  await Promise.all(
    [...new Set(recent.map(p => p.repo))].map(async repo => {
      const r = await $`gh api repos/${repo}/releases/latest`.nothrow().quiet();
      latest.set(
        repo,
        r.exitCode === 0 ? (JSON.parse(r.stdout.toString()) as Release) : null,
      );
    }),
  );
  releaseLines.push(
    ...(await Promise.all(
      recent.map(async p => {
        const rel = latest.get(p.repo);
        const day = p.mergedAt!.slice(0, 10);
        if (!rel)
          return `  – ${key(p)} (merged ${day}): repo publishes no GitHub releases`;
        if (new Date(rel.published_at) < new Date(p.mergedAt!))
          return `  ✗ ${key(p)} (merged ${day}): after latest release ${rel.tag_name} — not shipped yet`;
        if (!p.mergeSha)
          return `  – ${key(p)} (merged ${day}): no landed sha to check against ${rel.tag_name}`;
        const cmp =
          await $`gh api ${`repos/${p.repo}/compare/${rel.tag_name}...${p.mergeSha}?per_page=1`} --jq .status`
            .nothrow()
            .quiet();
        if (cmp.exitCode !== 0)
          return `  – ${key(p)} (merged ${day}): compare against ${rel.tag_name} failed`;
        const status = cmp.stdout.toString().trim();
        return status === "behind" || status === "identical"
          ? `  ✓ ${key(p)} (merged ${day}): in ${rel.tag_name}`
          : `  ✗ ${key(p)} (merged ${day}): not in ${rel.tag_name} (ships via a release branch or canary)`;
      }),
    )),
  );
}

// ---------- summary ----------

console.log(`GitHub account ${AUTHOR} · ${repos.size} external repos checked`);
console.log(
  `  merged  ${canon.merged} across ${canon.mergedRepos} repos (${canon.expo} to expo/expo)`,
);
console.log(`  open    ${canon.open} across ${canon.openRepos} repos`);
console.log(`  patches ${canon.patches}`);
const imported = liveMerged.filter(p => p.state === "IMPORT_MERGED");
if (imported.length)
  console.log(`  via import: ${imported.map(key).join(", ")}`);

if (releaseLines.length) {
  console.log(`\nRelease status (merged in the last ${releaseDays} days):`);
  for (const l of releaseLines) console.log(l);
}
if (applied.length) {
  console.log("\nApplied:");
  for (const a of applied) console.log(`  ${a}`);
}
if (manual.length) {
  console.log("\nNeeds a human:");
  for (const m of manual) console.log(`  ${m}`);
}
if (drift.length) {
  console.log(`\nDRIFT (${drift.length}):`);
  for (const d of drift) console.log(`  ✗ ${d}`);
  process.exit(1);
}
console.log(
  fixMode
    ? "\nSynced."
    : "\nAll surfaces match the data file and GitHub. No drift.",
);
