import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import getSortedPosts from "@/utils/getSortedPosts";
import { projects } from "@/data/projects";

export const GET: APIRoute = async ({ site }) => {
  const base = site!.href; // "https://ramonclaudio.com/"
  const posts = getSortedPosts(
    await getCollection("blog", ({ data }) => !data.draft),
  );
  const featured = projects.filter(p => p.featured);

  const pages = [
    ["About", "about", "Bio, background, and current focus."],
    [
      "Contributions",
      "contributions",
      "45 PRs merged across 11 upstream repos (Expo, Convex, Bun, shadcn/ui, Better Auth, Hermes, napi-rs, fumadocs, Astro, TanStack, App-Store-Connect-CLI), plus a public patches repo with 57 drop-in fixes for Bun, npm, pnpm, and Yarn.",
    ],
    ["Projects", "projects", "Open-source projects, CLIs, and experiments."],
    [
      "Now",
      "now",
      "What Ray is shipping right now and which upstream PRs are open.",
    ],
    ["Resume", "resume", "Work history and selected merged PRs."],
    ["Setup", "setup", "Daily-driver editor, terminal, CLI tools, and gear."],
  ] as const;

  const body = `# Ramon Claudio (Ray)

> Ray is a freelance product engineer in NYC, building since 2013. He ships React Native apps on Expo with Convex for backend and Better Auth for auth, and contributes fixes upstream: 45 merged PRs across 11 open-source repos and a public patches repo with 57 drop-in fixes. When he hits a dependency bug he traces the root cause, files the upstream PR, and ships a patch so his projects (and anyone else) aren't blocked on the merge.

## Pages
${pages.map(([name, path, note]) => `- [${name}](${base}${path}): ${note}`).join("\n")}

## Projects
${featured
  .map(
    p =>
      `- [${p.name}](https://github.com/${p.repo}): ${p.description}${p.detail ? ` (${p.detail})` : ""}`,
  )
  .join("\n")}
- [All projects](${base}projects): the full list, including archived experiments.

## Writing
${posts
  .map(p => `- [${p.data.title}](${base}posts/${p.id}/): ${p.data.description}`)
  .join("\n")}

## Contact
- Email: hello@ramonclaudio.com
- GitHub: https://github.com/ramonclaudio
- X: https://x.com/ramonclaudio
- npm: https://www.npmjs.com/~ramonclaudio
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
