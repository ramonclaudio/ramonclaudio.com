import type { APIRoute } from "astro";

// This site wants AI + search visibility, so everything is allowed.
// The AI bots are named explicitly so the intent is unambiguous and auditable:
// allowing the search/retrieval bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot)
// is what gets the site cited in ChatGPT, Claude, and Perplexity answers. Training
// bots are left allowed on purpose: 2025-2026 data shows blocking them does not
// reliably stop citations and measurably cuts traffic.
const getRobotsTxt = (
  sitemapURL: URL,
  llmsURL: URL,
) => `# ramonclaudio.com - open to search and AI engines
User-agent: *
Allow: /

# AI search / retrieval crawlers (these earn citations in answers)
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# AI training crawlers (allowed on purpose)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

# LLM-friendly site map: ${llmsURL.href}
Sitemap: ${sitemapURL.href}
`;

export const GET = (({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  const llmsURL = new URL("llms.txt", site);
  return new Response(getRobotsTxt(sitemapURL, llmsURL), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}) satisfies APIRoute;
