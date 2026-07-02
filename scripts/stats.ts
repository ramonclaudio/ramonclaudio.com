#!/usr/bin/env bun
// Reconcile the site's contribution stats against GitHub + the patches ledger.
//   bun scripts/stats.ts          check every file, exit 1 on drift
//   bun scripts/stats.ts --fix    rewrite the counts in place, recompile the PDF
//
// The numbers live denormalized across ~10 files. GitHub is the source of truth
// for PR state, the patches README tables for the patch count. This derives both
// and asserts the files agree.

import { $ } from "bun";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const AUTHOR = "ramonclaudio";
const ROOT = join(import.meta.dir, "..");
const PATCHES_README =
  process.env.PATCHES_README ?? join(ROOT, "..", "patches", "README.md");

// Upstream repos that count as contributions (Ray's own repos are excluded).
const REPOS = [
  "expo/expo",
  "facebook/hermes",
  "better-auth/better-auth",
  "get-convex/better-auth",
  "shadcn-ui/ui",
  "withastro/compiler-rs",
  "napi-rs/napi-rs",
  "rorkai/App-Store-Connect-CLI",
  "fuma-nama/fumadocs",
  "oven-sh/bun",
  "TanStack/db",
  "react/react-native",
];

// A closed PR still counts as merged when a maintainer lands it via internal
// import. Meta's codesync bot (hermes, react-native, ...) applies a "Merged"
// label on a real landing and omits it when the import is abandoned, so the
// label is the signal. INTERNAL_MERGES overrides a landed import missing it.
const INTERNAL_MERGES = new Set<string>([]);

type PR = { number: number; state: string; labels: string[]; repo: string };
type RawPR = { number: number; state: string; labels: { name: string }[] };

async function fetchPRs(repo: string): Promise<PR[]> {
  const out =
    await $`gh pr list -R ${repo} --author ${AUTHOR} --state all --limit 200 --json number,state,labels`.quiet();
  return (JSON.parse(out.stdout.toString()) as RawPR[]).map(p => ({
    number: p.number,
    state: p.state,
    labels: p.labels.map(l => l.name),
    repo,
  }));
}

const isMerged = (p: PR) =>
  p.state === "MERGED" ||
  (p.state === "CLOSED" && p.labels.includes("Merged")) ||
  INTERNAL_MERGES.has(`${p.repo}#${p.number}`);

function countPatchRows(readme: string) {
  const lines = readme.split("\n");
  let section = "";
  let open = 0;
  let released = 0;
  for (const line of lines) {
    if (line.startsWith("## Open")) section = "open";
    else if (line.startsWith("## Released")) section = "released";
    else if (line.startsWith("## ")) section = "";
    else if (line.startsWith("| [")) {
      if (section === "open") open++;
      else if (section === "released") released++;
    }
  }
  return { open, released, total: open + released };
}

// Each check matches a minimal span containing exactly one number (the target).
type Check = { file: string; re: RegExp; key: keyof Canon };
type Canon = {
  merged: number;
  expo: number;
  patches: number;
  open: number;
  openRepos: number;
  mergedRepos: number;
};

const CHECKS: Check[] = [
  {
    file: "src/utils/schema.ts",
    re: /(\d+) merged PRs upstream/g,
    key: "merged",
  },

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
    file: "src/pages/contributions.md",
    re: /expo\/expo \((\d+) PRs\)/g,
    key: "expo",
  },

  {
    file: "src/pages/llms.txt.ts",
    re: /(\d+) PRs merged across/g,
    key: "merged",
  },
  {
    file: "src/pages/llms.txt.ts",
    re: /PRs merged across (\d+) upstream repos/g,
    key: "mergedRepos",
  },
  {
    file: "src/pages/llms.txt.ts",
    re: /(\d+) merged PRs across/g,
    key: "merged",
  },
  {
    file: "src/pages/llms.txt.ts",
    re: /merged PRs across (\d+) open-source repos/g,
    key: "mergedRepos",
  },
  { file: "src/pages/llms.txt.ts", re: /(\d+) drop-in fixes/g, key: "patches" },

  {
    file: "src/pages/index.astro",
    re: /(\d+) PRs merged across/g,
    key: "merged",
  },
  {
    file: "src/pages/index.astro",
    re: /PRs merged across (\d+) repos/g,
    key: "mergedRepos",
  },
  { file: "src/pages/index.astro", re: /(\d+) to <a/g, key: "expo" },
  { file: "src/pages/index.astro", re: /> · (\d+) <a/g, key: "patches" },

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
  // "N merged PRs upstream" (frontmatter) and the expo count differ by syntax:
  // markdown resumes write `(27), [shadcn-ui/ui]`, Typst writes `[expo/expo] (27)`.
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

function run(fix: boolean): Promise<number> {
  return (async () => {
    const all = (await Promise.all(REPOS.map(fetchPRs))).flat();
    const merged = all.filter(isMerged);
    const open = all.filter(p => p.state === "OPEN");
    const canon: Canon = {
      merged: merged.length,
      expo: merged.filter(p => p.repo === "expo/expo").length,
      mergedRepos: new Set(merged.map(p => p.repo)).size,
      open: open.length,
      openRepos: new Set(open.map(p => p.repo)).size,
      patches: 0,
    };

    let patchesKnown = false;
    if (existsSync(PATCHES_README)) {
      canon.patches = countPatchRows(
        readFileSync(PATCHES_README, "utf8"),
      ).total;
      patchesKnown = true;
    }

    console.log("Computed from GitHub + patches ledger:");
    for (const [k, v] of Object.entries(canon)) {
      if (k === "patches" && !patchesKnown) continue;
      console.log(`  ${k.padEnd(12)} ${v}`);
    }
    const imported = merged.filter(p => p.state !== "MERGED");
    if (imported.length)
      console.log(
        `  via import  ${imported.map(p => `${p.repo}#${p.number}`).join(", ")}`,
      );
    console.log("");

    const drift: string[] = [];

    for (const c of CHECKS) {
      if (c.key === "patches" && !patchesKnown) continue;
      const path = join(ROOT, c.file);
      if (!existsSync(path)) {
        drift.push(`${c.file}: file missing`);
        continue;
      }
      let text = readFileSync(path, "utf8");
      const want = canon[c.key];
      let touched = false;
      const matches = [...text.matchAll(c.re)];
      if (matches.length === 0) {
        drift.push(`${c.file}: no match for /${c.re.source}/`);
        continue;
      }
      for (const m of matches) {
        if (Number(m[1]) !== want) {
          if (fix) {
            touched = true;
          } else {
            drift.push(
              `${c.file}: ${c.key} is ${m[1]}, expected ${want}  ("${m[0]}")`,
            );
          }
        }
      }
      if (fix && touched) {
        text = text.replace(c.re, span => span.replace(/\d+/, String(want)));
        writeFileSync(path, text);
        console.log(`fixed ${c.file}: ${c.key} -> ${want}`);
      }
    }

    // Completeness: every merged PR must be described in contributions.md.
    const contribs = readFileSync(
      join(ROOT, "src/pages/contributions.md"),
      "utf8",
    );
    const undescribed = merged.filter(
      p => !contribs.includes(`/${p.repo}/pull/${p.number}`),
    );
    for (const p of undescribed) {
      drift.push(`contributions.md: merged ${p.repo}#${p.number} has no entry`);
    }

    if (fix) {
      console.log("\nRecompiling resume.pdf...");
      await $`typst compile ${join(ROOT, "resume/resume.typ")} ${join(ROOT, "public/resume.pdf")}`;
      console.log("resume.pdf recompiled");
    }

    if (drift.length && !fix) {
      console.log(`\nDRIFT (${drift.length}):`);
      for (const d of drift) console.log(`  ✗ ${d}`);
      return 1;
    }
    console.log(fix ? "\nSynced." : "\nAll files match GitHub. No drift.");
    return 0;
  })();
}

process.exit(await run(process.argv.includes("--fix")));
