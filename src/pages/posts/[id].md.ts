import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { readFileSync } from "node:fs";

// Serve the raw markdown of each post at /posts/<id>.md so AI retrieval bots
// (and humans who append .md) get clean source instead of parsing HTML.
// Read by the entry's real filePath, since the post id can differ from the filename.
export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { id: post.id },
    props: { filePath: post.filePath ?? "" },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { filePath } = props as { filePath: string };
  const raw = filePath ? readFileSync(filePath, "utf8") : "";
  return new Response(raw, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
};
