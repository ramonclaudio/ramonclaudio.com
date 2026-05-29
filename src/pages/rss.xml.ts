import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export const GET = (async ({ site }) => {
  const posts = getSortedPosts(
    await getCollection("blog", ({ data }) => !data.draft),
  );
  const container = await AstroContainer.create();

  const items = await Promise.all(
    posts.map(async post => {
      const { Content } = await render(post);
      const content = await container.renderToString(Content);
      return {
        link: `/posts/${post.id}/`,
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.modDatetime ?? post.data.pubDatetime,
        content,
      };
    }),
  );

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: site!,
    customData: "<language>en-us</language>",
    items,
  });
}) satisfies APIRoute;
