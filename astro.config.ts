import { defineConfig, envField, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import rehypeExternalLinks from "rehype-external-links";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import { readFileSync, readdirSync } from "node:fs";

// Map each post URL to its real last-modified date (modDatetime ?? pubDatetime)
// so the sitemap carries an honest freshness signal instead of the build time.
const postDates = (() => {
  const dir = "src/data/blog";
  const map = new Map<string, string>();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md") || file.startsWith("_")) continue;
    const fm = readFileSync(`${dir}/${file}`, "utf8").split(/^---$/m)[1] ?? "";
    const mod = /^modDatetime:\s*(.+)$/m.exec(fm)?.[1]?.trim();
    const pub = /^pubDatetime:\s*(.+)$/m.exec(fm)?.[1]?.trim();
    const raw = mod && mod !== "null" ? mod : pub;
    if (raw) {
      const date = new Date(raw.replace(/^["']|["']$/g, ""));
      if (!Number.isNaN(date.valueOf()))
        map.set(`/posts/${file.replace(/\.md$/, "")}`, date.toISOString());
    }
  }
  return map;
})();

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [
    sitemap({
      namespaces: { news: false, video: false, xhtml: false },
      filter: page => !/\/(privacy|terms)\/?$/.test(page),
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === "/") item.priority = 1.0;
        else if (/^\/(contributions|projects|apps)/.test(path))
          item.priority = 0.9;
        else if (path.startsWith("/posts/")) item.priority = 0.8;
        else item.priority = 0.6;
        const lastmod = postDates.get(path.replace(/\/$/, ""));
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    contentIntellisense: true,
    clientPrerender: true,
    rustCompiler: true,
    queuedRendering: {
      enabled: true,
    },
  },
});
