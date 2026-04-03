import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@/utils/generateOgImages";
import { SITE } from "@/config";

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage),
  );

  return posts.map(post => ({
    params: { id: post.id },
    props: post,
  }));
}

export const GET = (async ({ props }) =>
  new Response(
    (await generateOgImageForPost(
      props as CollectionEntry<"blog">,
    )) as unknown as BodyInit,
  )) satisfies APIRoute;
