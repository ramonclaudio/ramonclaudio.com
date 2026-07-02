#!/usr/bin/env bun
// All-in-one contribution reconciler. GitHub is the source of truth for PR
// state; src/data/contributions.ts is the source of truth for content, and
// every surface derives from it.
//
//   bun stats        audit: discover every external PR the account authored,
//                    verify the data file and all derived surfaces against
//                    live GitHub, report release status. Exits 1 on drift.
//   bun stats:fix    reconcile: scaffold new merged and open PRs, move landed
//                    open PRs to merged, drop closed ones, refresh
//                    patchesCount, regenerate contributions.md and now.md,
//                    sync prose count literals, recompile the resume PDF when
//                    its source changes.
//
// Flags: --release-days=N|all   release-status window (default 30, 0 = off)

import { $ } from "bun";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  merged as dataMerged,
  open as dataOpen,
  patchesCount as dataPatches,
  type Contribution,
} from "../src/data/contributions.ts";

const ROOT = join(import.meta.dir, "..");
const DATA_PATH = join(ROOT, "src/data/contributions.ts");
const PATCHES_README =
  process.env.PATCHES_README ?? join(ROOT, "..", "patches", "README.md");

const fixMode = process.argv.includes("--fix");
const daysFlag = process.argv
  .find(a => a.startsWith("--release-days="))
  ?.split("=")[1];
const releaseDays = daysFlag === "all" ? Infinity : Number(daysFlag ?? 30);

const key = (c: { repo: string; number: number }) => `${c.repo}#${c.number}`;
const prUrl = (c: { repo: string; number: number }) =>
  `https://github.com/${c.repo}/pull/${c.number}`;

const drift: string[] = []; // check-mode failures
const applied: string[] = []; // fix-mode actions taken
const manual: string[] = []; // needs a human either way
const act = (msg: string) => (fixMode ? applied : drift).push(msg);

// ---------- live state, straight from the GitHub CLI ----------

const AUTHOR = (await $`gh api user --jq .login`.quiet()).stdout
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
const searchRaw =
  await $`gh search prs is:public --author ${AUTHOR} --limit 1000 --json repository`.quiet();
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
      const out =
        await $`gh pr list -R ${repo} --author ${AUTHOR} --state all --limit 200 --json number,state,title,labels,mergeCommit,mergedAt,closedAt`.quiet();
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
const IMPORT_BOTS = new Set(["meta-codesync", "facebook-github-bot"]);
const LANDED_RE =
  /merged this pull request in (?:[\w.-]+\/[\w.-]+@)?([0-9a-f]{7,40})/;
await Promise.all(
  live
    .filter(p => p.state === "CLOSED")
    .map(async p => {
      const out =
        await $`gh pr view ${p.number} -R ${p.repo} --json comments`.quiet();
      const { comments } = JSON.parse(out.stdout.toString()) as {
        comments: { author: { login: string }; body: string }[];
      };
      const landed = comments.find(
        c => IMPORT_BOTS.has(c.author.login) && LANDED_RE.test(c.body),
      );
      if (landed || p.labels.includes("Merged")) {
        p.state = "IMPORT_MERGED";
        p.mergeSha = landed?.body.match(LANDED_RE)?.[1] ?? p.mergeSha;
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

// Scaffold titles from the upstream PR title: drop [tags] and conventional
// prefixes, drop backticks, lowercase a plain leading word.
const cleanTitle = (t: string) =>
  t
    .replace(/^(\s*\[[^\]]+\])+\s*/, "")
    .replace(/^\w+(\([^)]*\))?!?:\s*/, "")
    .replace(/`/g, "")
    .trim()
    .replace(/^[A-Z](?=[a-z])/, m => m.toLowerCase());

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
  const at = desiredMerged.findIndex(c => c.repo === p.repo);
  if (at === -1) desiredMerged.push(entry);
  else desiredMerged.splice(at, 0, entry);
  act(
    carried
      ? `contributions.ts: open ${key(p)} merged upstream — ${fixMode ? "moved to merged" : "--fix moves it to merged"}`
      : `contributions.ts: merged ${key(p)} is missing — ${fixMode ? "scaffolded from the upstream title" : "--fix scaffolds it"}`,
  );
  manual.push(
    `polish the ${carried ? "detail" : "title and detail"} for ${key(p)} in src/data/contributions.ts`,
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
  desiredOpen.push({
    repo: p.repo,
    number: p.number,
    title: cleanTitle(p.title),
  });
  act(
    `contributions.ts: open ${key(p)} is missing — ${fixMode ? "scaffolded from the upstream title" : "--fix scaffolds it"}`,
  );
  manual.push(`polish the title for ${key(p)} in src/data/contributions.ts`);
}

// patchesCount mirrors the row count of the patches README's two tables.
function countPatchRows(readme: string): number {
  let counting = false;
  let rows = 0;
  for (const line of readme.split("\n")) {
    if (line.startsWith("## Open") || line.startsWith("## Released"))
      counting = true;
    else if (line.startsWith("## ")) counting = false;
    else if (counting && line.startsWith("| [")) rows++;
  }
  return rows;
}
let patches = dataPatches;
const patchesReadme = existsSync(PATCHES_README)
  ? readFileSync(PATCHES_README, "utf8")
  : null;
if (patchesReadme) {
  const rows = countPatchRows(patchesReadme);
  if (rows !== dataPatches)
    act(
      `contributions.ts: patchesCount is ${dataPatches}, the patches README has ${rows}${fixMode ? " — updated" : ""}`,
    );
  patches = rows;
}

// The data file is the source everything derives from. If it disagrees with
// GitHub, downstream checks are meaningless — stop here and fix it first.
if (!fixMode && drift.length) {
  console.log("Data file is out of sync with GitHub (reconcile it first):");
  for (const d of drift) console.log(`  ✗ ${d}`);
  process.exit(1);
}

const distinct = (l: Contribution[]) => new Set(l.map(c => c.repo)).size;
const canon = {
  merged: desiredMerged.length,
  mergedRepos: distinct(desiredMerged),
  expo: desiredMerged.filter(c => c.repo === "expo/expo").length,
  open: desiredOpen.length,
  openRepos: distinct(desiredOpen),
  patches,
};

// ---------- regenerate the data file when its data changed ----------

function serializeData(): string {
  const item = (c: Contribution) =>
    `  { repo: ${JSON.stringify(c.repo)}, number: ${c.number}, title: ${JSON.stringify(c.title)}${
      c.detail && c.detail !== c.title
        ? `, detail: ${JSON.stringify(c.detail)}`
        : ""
    } },`;
  return `// Single source of truth for upstream contributions. The homepage, the
// contributions page, now.md's open-PR list, llms.txt, and the JSON-LD schema
// derive from this file. \`bun stats\` audits it against live GitHub;
// \`bun stats:fix\` reconciles it: new PRs get scaffolded entries, open PRs
// move to merged when they land, closed ones drop out, and patchesCount
// refreshes from the patches README. Titles and details are editorial — polish
// the scaffolds, the structure is machine-managed.

export type Contribution = {
  repo: string;
  number: number;
  title: string; // terse one-liner (homepage, now.md open list)
  detail?: string; // fuller description (contributions page); falls back to title
};

// Row count of the ramonclaudio/patches README tables (Open + Released).
export const patchesCount = ${patches};

export const merged: Contribution[] = [
${desiredMerged.map(item).join("\n")}
];

export const open: Contribution[] = [
${desiredOpen.map(item).join("\n")}
];

export const prUrl = (c: Contribution) =>
  \`https://github.com/\${c.repo}/pull/\${c.number}\`;

export const repoUrl = (repo: string) =>
  \`https://github.com/\${repo}/pulls?q=is:pr+author:ramonclaudio\`;

export function groupByRepo(list: Contribution[]) {
  const order: string[] = [];
  const groups = new Map<string, Contribution[]>();
  for (const c of list) {
    if (!groups.has(c.repo)) {
      groups.set(c.repo, []);
      order.push(c.repo);
    }
    groups.get(c.repo)!.push(c);
  }
  return order.map(repo => ({ repo, items: groups.get(repo)! }));
}

const distinctRepos = (list: Contribution[]) =>
  new Set(list.map(c => c.repo)).size;

export const stats = {
  merged: merged.length,
  mergedRepos: distinctRepos(merged),
  expo: merged.filter(c => c.repo === "expo/expo").length,
  open: open.length,
  openRepos: distinctRepos(open),
  patches: patchesCount,
};
`;
}

const snap = (l: Contribution[]) =>
  JSON.stringify(l.map(c => [c.repo, c.number, c.title, c.detail ?? null]));
const dataChanged =
  snap(desiredMerged) !== snap(dataMerged) ||
  snap(desiredOpen) !== snap(dataOpen) ||
  patches !== dataPatches;
if (dataChanged && fixMode) {
  writeFileSync(DATA_PATH, serializeData());
  await $`bunx oxfmt --write ${DATA_PATH}`.nothrow().quiet();
  applied.push("regenerated src/data/contributions.ts");
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
    writeFileSync(abs, text.replace(re, next));
    applied.push(`regenerated the ${label} in ${path}`);
    return true;
  }
  drift.push(`${path}: ${label} is stale — run bun stats:fix`);
  return false;
}

function groups(list: Contribution[]) {
  const order: string[] = [];
  const map = new Map<string, Contribution[]>();
  for (const c of list) {
    if (!map.has(c.repo)) {
      map.set(c.repo, []);
      order.push(c.repo);
    }
    map.get(c.repo)!.push(c);
  }
  return order.map(repo => ({ repo, items: map.get(repo)! }));
}

const detailLine = (c: Contribution) =>
  `[#${c.number}](${prUrl(c)}) ${c.detail ?? c.title}`;
const mergedBlock = groups(desiredMerged)
  .map(g =>
    g.items.length === 1
      ? `- ${g.repo} (1 PR): ${detailLine(g.items[0])}`
      : [
          `- ${g.repo} (${g.items.length} PRs):`,
          ...g.items.map(c => `  - ${detailLine(c)}`),
        ].join("\n"),
  )
  .join("\n");
replaceBlock(
  "src/pages/contributions.md",
  "contributions",
  mergedBlock,
  "merged-PR list",
);

const openBlock = desiredOpen
  .map(c => `- [${key(c)}](${prUrl(c)}): ${c.title}.`)
  .join("\n");
if (replaceBlock("src/pages/now.md", "open-prs", openBlock, "open-PR list")) {
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

// contributions.md's "Open" patches section mirrors the patches README's Open
// table but its wording is editorial, so it can't be generated. Check the PR
// sets match instead. The row's own PR link is the last /pull/ link in it.
if (patchesReadme) {
  const lastPullLink = (line: string): string | null => {
    const all = [
      ...line.matchAll(/github\.com\/([\w.-]+\/[\w.-]+)\/pull\/(\d+)/g),
    ];
    return all.length
      ? `${all[all.length - 1][1]}#${all[all.length - 1][2]}`
      : null;
  };
  const section = (text: string, from: string, to: string) => {
    const i = text.indexOf(from);
    const j = text.indexOf(to, i);
    return i === -1 ? "" : text.slice(i, j === -1 ? undefined : j);
  };
  const collect = (text: string, prefix: string) =>
    new Set(
      text
        .split("\n")
        .filter(l => l.startsWith(prefix))
        .map(lastPullLink)
        .filter((k): k is string => k !== null),
    );
  const readmeSet = collect(
    section(patchesReadme, "## Open", "## Released"),
    "| [",
  );
  const cmText = readFileSync(join(ROOT, "src/pages/contributions.md"), "utf8");
  const cmSet = collect(section(cmText, "#### Open", "#### Dropped"), "- ");
  for (const k of readmeSet)
    if (!cmSet.has(k))
      (fixMode ? manual : drift).push(
        `contributions.md: patches Open section is missing ${k} (in the patches README) — manual edit`,
      );
  for (const k of cmSet)
    if (!readmeSet.has(k))
      (fixMode ? manual : drift).push(
        `contributions.md: patches Open section lists ${k}, not in the patches README — manual edit`,
      );
}

// ---------- prose count literals that can't import the data ----------

type Key = keyof typeof canon;
type Check = { file: string; re: RegExp; key: Key };
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
  ...["src/pages/resume.md", "public/resume.md", "resume/resume.typ"].flatMap(
    (file): Check[] => [
      { file, re: /(\d+) PRs merged upstream to Expo/g, key: "merged" },
      { file, re: /(\d+) PRs merged upstream across/g, key: "merged" },
      { file, re: /merged upstream across (\d+) repos/g, key: "mergedRepos" },
      { file, re: /(\d+) patches for Bun/g, key: "patches" },
      { file, re: /(\d+) more open across/g, key: "open" },
      { file, re: /more open across (\d+) repos/g, key: "openRepos" },
    ],
  ),
  {
    file: "src/pages/resume.md",
    re: /(\d+) merged PRs upstream/g,
    key: "merged",
  },
  {
    file: "src/pages/resume.md",
    re: /\((\d+)\), \[shadcn-ui\/ui\]/g,
    key: "expo",
  },
  {
    file: "public/resume.md",
    re: /\((\d+)\), \[shadcn-ui\/ui\]/g,
    key: "expo",
  },
  { file: "resume/resume.typ", re: /\[expo\/expo\] \((\d+)\)/g, key: "expo" },
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
    text = text.replace(c.re, span => span.replace(/\d+/, String(want)));
    writeFileSync(path, text);
    if (c.file === "resume/resume.typ") resumeTypChanged = true;
    applied.push(`fixed ${c.file}: ${c.key} -> ${want}`);
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
