import { expect, test } from "bun:test";
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

test("cleanTitle strips tags, conventional prefixes, and backticks", () => {
  expect(cleanTitle("[expo-router] Add testID to NativeTabs")).toBe(
    "add testID to NativeTabs",
  );
  expect(cleanTitle("fix(ios): `strokeBorder` crashes on rotation")).toBe(
    "strokeBorder crashes on rotation",
  );
  expect(cleanTitle("feat!: Drop legacy bridge")).toBe("drop legacy bridge");
  expect(cleanTitle("SwiftUI Alert component")).toBe("SwiftUI Alert component");
});

test("serializeData emits entries, omits detail equal to title, pins the count", () => {
  const out = serializeData(
    [
      { repo: "expo/expo", number: 1, title: "one", detail: "one" },
      { repo: "expo/expo", number: 2, title: "two", detail: "richer two" },
    ],
    [{ repo: "oven-sh/bun", number: 3, title: "three" }],
    59,
  );
  expect(out).toContain('{ repo: "expo/expo", number: 1, title: "one" },');
  expect(out).toContain(
    '{ repo: "expo/expo", number: 2, title: "two", detail: "richer two" },',
  );
  expect(out).toContain('{ repo: "oven-sh/bun", number: 3, title: "three" },');
  expect(out).toContain("export const patchesCount = 59;");
});

test("mergedListBlock inlines single-PR repos and nests multi-PR repos", () => {
  const block = mergedListBlock([
    { repo: "expo/expo", number: 1, title: "a" },
    { repo: "expo/expo", number: 2, title: "b" },
    { repo: "oven-sh/bun", number: 3, title: "c" },
  ]);
  expect(block).toContain("- expo/expo (2 PRs):");
  expect(block).toContain("  - [#1](https://github.com/expo/expo/pull/1) a");
  expect(block).toContain(
    "- oven-sh/bun (1 PR): [#3](https://github.com/oven-sh/bun/pull/3) c",
  );
});

test("openListBlock renders one bullet per PR", () => {
  expect(openListBlock([{ repo: "oven-sh/bun", number: 3, title: "c" }])).toBe(
    "- [oven-sh/bun#3](https://github.com/oven-sh/bun/pull/3): c.",
  );
});

test("pageSection slices a header through to the next same-depth header", () => {
  const doc = "#### Open\n\n- a\n- b\n\n#### Merged\n\n- c\n";
  expect(pageSection(doc, "#### Open", "#### ")).toBe(
    "#### Open\n\n- a\n- b\n",
  );
  expect(pageSection(doc, "#### Merged", "#### ")).toBe("#### Merged\n\n- c\n");
  expect(pageSection(doc, "#### Missing", "#### ")).toBe("");
});

test("lastPullLink picks the row's own PR, not a cited one", () => {
  const line =
    "- fix for [expo/expo#100](https://github.com/expo/expo/pull/100), filed as [oven-sh/bun#7](https://github.com/oven-sh/bun/pull/7)";
  expect(lastPullLink(line)).toBe("oven-sh/bun#7");
  expect(lastPullLink("- no links here")).toBeNull();
});

test("key formats repo#number", () => {
  expect(key({ repo: "expo/expo", number: 47472 })).toBe("expo/expo#47472");
});

test("bumpLastNumber rewrites the count, not digits inside the URL", () => {
  expect(
    bumpLastNumber(
      "[shadcn-ui/ui](https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+is%3Amerged) (5)",
      6,
    ),
  ).toBe(
    "[shadcn-ui/ui](https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+is%3Amerged) (6)",
  );
  expect(bumpLastNumber("56 PRs merged upstream across", 57)).toBe(
    "57 PRs merged upstream across",
  );
});

test("orderGroups ranks count desc, then first merge, then name, stable within groups", () => {
  const out = orderGroups(
    [
      { repo: "b/b", number: 1, title: "b1" },
      { repo: "a/a", number: 2, title: "a2" },
      { repo: "a/a", number: 1, title: "a1" },
      { repo: "d/d", number: 1, title: "d1" },
      { repo: "c/c", number: 1, title: "c1" },
      { repo: "e/e", number: 1, title: "e1" },
    ],
    new Map([
      ["a/a", "2025-06-01T00:00:00Z"], // latest date, but count wins
      ["b/b", "2024-01-01T00:00:00Z"],
      ["c/c", "2024-03-01T00:00:00Z"],
      ["d/d", "2024-03-01T00:00:00Z"], // ties c/c on date, name breaks it
      // e/e has no date and sorts last
    ]),
  );
  expect(out.map(c => `${c.repo}#${c.number}`)).toEqual([
    "a/a#2",
    "a/a#1",
    "b/b#1",
    "c/c#1",
    "d/d#1",
    "e/e#1",
  ]);
});

test("publicResume swaps the frontmatter for the letterhead", () => {
  const src =
    "---\nlayout: ../layouts/ResumeLayout.astro\ntitle: Resume\n---\n\n**Product Engineer**\n\n[links](https://x)\n\n## Summary\n\nbody\n";
  expect(publicResume(src)).toBe(
    "# Ramon Claudio\n\n**Product Engineer**\n\n[links](https://x)\n\n---\n\n## Summary\n\nbody\n",
  );
  expect(() => publicResume("---\nx: y\n---\n\nno summary\n")).toThrow();
});
