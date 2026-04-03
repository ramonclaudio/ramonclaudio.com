import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export const GET = (async ({ site }) => {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: site!,
    customData: "<language>en-us</language>",
    trailingSlash: false,
    items: sortedPosts.map(({ data, id }) => ({
      link: `/posts/${id}`,
      title: data.title,
      description: data.description,
      pubDate: data.modDatetime ?? data.pubDatetime,
    })),
  });
}) satisfies APIRoute;
