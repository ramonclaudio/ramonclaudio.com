// Pure content transforms for the site's derived surfaces. The gh calls and
// file I/O live in reconcile.ts; everything here is string in, string out.
import {
  groupByRepo,
  prUrl,
  type Contribution,
} from "../src/data/contributions.ts";

export const key = (c: { repo: string; number: number }) =>
  `${c.repo}#${c.number}`;

// Scaffold titles from the upstream PR title: drop [tags] and conventional
// prefixes, drop backticks, lowercase a plain leading word. A first word with
// a second capital (SwiftUI, NativeTabs) is a proper noun and keeps its case.
export const cleanTitle = (t: string) =>
  t
    .replace(/^(\s*\[[^\]]+\])+\s*/, "")
    .replace(/^\w+(\([^)]*\))?!?:\s*/, "")
    .replace(/`/g, "")
    .trim()
    .replace(/^[A-Z](?=[a-z]+(\s|$))/, m => m.toLowerCase());

// The generated src/data/contributions.ts. Titles and details are editorial;
// the structure is machine-managed.
export function serializeData(
  merged: Contribution[],
  open: Contribution[],
  patchesCount: number,
): string {
  const item = (c: Contribution) =>
    `  { repo: ${JSON.stringify(c.repo)}, number: ${c.number}, title: ${JSON.stringify(c.title)}${
      c.detail && c.detail !== c.title
        ? `, detail: ${JSON.stringify(c.detail)}`
        : ""
    } },`;
  return `// Single source of truth for upstream contributions. The homepage, the
// contributions page, now.md's open-PR list, llms.txt, and the JSON-LD schema
// derive from this file. \`bun reconcile\` audits it against live GitHub;
// \`bun reconcile:fix\` fixes it: new PRs get scaffolded entries, open PRs
// move to merged when they land, closed ones drop out, and patchesCount
// refreshes from the patches README. Titles and details are editorial, polish
// the scaffolds, the structure is machine-managed. Group order is derived:
// merged-PR count, then earliest first merge. \`bun reconcile:fix\` reorders,
// hand-sorting is overwritten.

export type Contribution = {
  repo: string;
  number: number;
  title: string; // terse one-liner (homepage, now.md open list)
  detail?: string; // fuller description (contributions page); falls back to title
};

// Row count of the ramonclaudio/patches README tables (Open + Merged).
export const patchesCount = ${patchesCount};

export const merged: Contribution[] = [
${merged.map(item).join("\n")}
];

export const open: Contribution[] = [
${open.map(item).join("\n")}
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

// Group order for the merged list: PR count desc, then earliest first merge,
// then repo name. The sort is stable, so within-group order stays editorial.
// "~" sorts a repo with no known merge date after every ISO timestamp.
export function orderGroups(
  list: Contribution[],
  firstMerge: Map<string, string>,
): Contribution[] {
  const counts = new Map<string, number>();
  for (const c of list) counts.set(c.repo, (counts.get(c.repo) ?? 0) + 1);
  const date = (repo: string) => firstMerge.get(repo) ?? "~";
  const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
  return [...list].sort((a, b) =>
    a.repo === b.repo
      ? 0
      : counts.get(b.repo)! - counts.get(a.repo)! ||
        cmp(date(a.repo), date(b.repo)) ||
        cmp(a.repo, b.repo),
  );
}

// Rewrite the count in a matched check span. The count is the last number in
// the span: earlier digits can belong to a URL (the 3 in is%3Apr).
export const bumpLastNumber = (span: string, n: number) =>
  span.replace(/\d+(?!.*\d)/, String(n));

// public/resume.md is the resume page body under a plain-markdown letterhead,
// served as a raw file. Derived so the two can never drift.
export function publicResume(src: string): string {
  const body = src.replace(/^---\n[\s\S]*?\n---\n\n/, "");
  const at = body.indexOf("## Summary");
  if (at === -1) throw new Error("resume.md has no ## Summary heading");
  return `# Ramon Claudio\n\n${body.slice(0, at)}---\n\n${body.slice(at)}`;
}

const detailLine = (c: Contribution) =>
  `[#${c.number}](${prUrl(c)}) ${c.detail ?? c.title}`;

// The contributions page's generated merged-PR list, grouped by repo.
export const mergedListBlock = (list: Contribution[]) =>
  groupByRepo(list)
    .map(g =>
      g.items.length === 1
        ? `- ${g.repo} (1 PR): ${detailLine(g.items[0])}`
        : [
            `- ${g.repo} (${g.items.length} PRs):`,
            ...g.items.map(c => `  - ${detailLine(c)}`),
          ].join("\n"),
    )
    .join("\n");

// now.md's generated open-PR list.
export const openListBlock = (list: Contribution[]) =>
  list.map(c => `- [${key(c)}](${prUrl(c)}): ${c.title}.`).join("\n");

// A section of a site page, from a header to the next header of the same depth.
export const pageSection = (text: string, from: string, next: string) => {
  const i = text.indexOf(from);
  if (i === -1) return "";
  const j = text.indexOf(`\n${next}`, i + from.length);
  return text.slice(i, j === -1 ? undefined : j);
};

// The last /pull/ link in a line owns the row or bullet; earlier links are
// references ("root cause", "supersedes"). Returns owner/repo#number.
export const lastPullLink = (line: string): string | null => {
  const all = [
    ...line.matchAll(/github\.com\/([\w.-]+\/[\w.-]+)\/pull\/(\d+)/g),
  ];
  return all.length
    ? `${all[all.length - 1][1]}#${all[all.length - 1][2]}`
    : null;
};
