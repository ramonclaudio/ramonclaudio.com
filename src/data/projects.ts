export type Project = {
  slug: string;
  name: string;
  stack: string;
  description: string;
  repo: string;
  detail?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "ccbase",
    name: "ccbase",
    stack: "TypeScript · Bun · SQLite",
    description:
      "Local analytics dashboard, session history, and cost tracking for Claude Code.",
    repo: "ramonclaudio/ccbase",
    detail: "~172 weekly downloads",
    featured: true,
  },
  {
    slug: "counter",
    name: "counter",
    stack: "Expo · Convex · TypeScript",
    description:
      "Voice AI that listens while you negotiate a deal. Pulls prices, alternatives, and angles to push on in real time.",
    repo: "ramonclaudio/counter",
    detail: "ElevenLabs x Firecrawl hackathon submission",
    featured: true,
  },
  {
    slug: "convex-revenuecat",
    name: "convex-revenuecat",
    stack: "TypeScript · Convex",
    description:
      "RevenueCat subscription sync for Convex. All 18 webhook event types, REST API sync, entitlement checking.",
    repo: "ramonclaudio/convex-revenuecat",
    detail: "~717 weekly downloads · Convex Components Directory",
    featured: true,
  },
  {
    slug: "gitbar",
    name: "gitbar",
    stack: "Tauri · Rust · TypeScript · React",
    description:
      "GitHub dashboard for the macOS menubar. PRs, issues, repos, and activity in one window.",
    repo: "ramonclaudio/gitbar",
    detail: "~5MB binary",
    featured: true,
  },
  {
    slug: "coderabbit-shadcn-registry",
    name: "coderabbit-shadcn-registry",
    stack: "TypeScript · React",
    description:
      "Ships the CodeRabbit API as a shadcn registry. Framework-agnostic client, storage adapters, React components.",
    repo: "ramonclaudio/coderabbit-shadcn-registry",
    detail: "listed in shadcn/ui registry",
    featured: true,
  },
  {
    slug: "skills",
    name: "skills",
    stack: "TypeScript · Bun · Claude Code",
    description:
      "9 plugins for Claude Code distributed as a marketplace. handoff, qmd, commit, polish, audit, techdebt, teams, gif, frames.",
    repo: "ramonclaudio/skills",
  },
  {
    slug: "patches",
    name: "patches",
    stack: "Diff · Bun · pnpm · yarn",
    description:
      "Drop-in patch files for bugs and missing features in upstream packages awaiting merge.",
    repo: "ramonclaudio/patches",
    detail: "@convex-dev, @expo, @shopify, oven-sh, more",
  },
  {
    slug: "tanstack-convex-starter",
    name: "tanstack-convex-starter",
    stack: "TanStack Start · Convex · Better Auth",
    description:
      "Full-stack starter with email/username auth, RLS, rate limiting, audit logs, and avatar uploads.",
    repo: "ramonclaudio/tanstack-convex-starter",
  },
  {
    slug: "tanvex",
    name: "tanvex",
    stack: "TanStack Start · Convex · Autumn",
    description:
      "SaaS starter with TanStack Start, Convex, Better Auth, and Autumn billing.",
    repo: "ramonclaudio/tanvex",
  },
  {
    slug: "polar-commerce",
    name: "polar-commerce",
    stack: "Next.js · Convex · Polar",
    description:
      "Experimental e-commerce on Polar. Custom cart bundling for multi-item checkout via ephemeral products.",
    repo: "ramonclaudio/polar-commerce",
  },
  {
    slug: "shopify-hydrogen-shadcn-template",
    name: "shopify-hydrogen-shadcn-template",
    stack: "Hydrogen · React Router 7 · shadcn/ui",
    description:
      "Shopify storefront template built on Hydrogen, React Router 7, and shadcn/ui.",
    repo: "ramonclaudio/shopify-hydrogen-shadcn-template",
  },
  {
    slug: "uniwind-ui",
    name: "uniwind-ui",
    stack: "React Native · Uniwind · Tailwind",
    description:
      "shadcn/ui for React Native. Copy-paste components for iOS, Android, and Web from one codebase.",
    repo: "ramonclaudio/uniwind-ui",
  },
  {
    slug: "vercel-blob-client-starter",
    name: "vercel-blob-client-starter",
    stack: "Next.js · Vercel Blob",
    description:
      "Client-side Vercel Blob starter with drag-and-drop, multipart uploads, and a file gallery.",
    repo: "ramonclaudio/vercel-blob-client-starter",
  },
  {
    slug: "bun-react-effect-example",
    name: "bun-react-effect-example",
    stack: "Bun · React · Effect",
    description:
      "End-to-end type safety on top of bun init's React + shadcn starter via Effect TypeScript.",
    repo: "ramonclaudio/bun-react-effect-example",
  },
  {
    slug: "howold",
    name: "howold",
    stack: "Bun · TypeScript",
    description:
      "Find the freshest examples in any GitHub repo by first-commit date instead of last-update.",
    repo: "ramonclaudio/howold",
  },
  {
    slug: "claude-code-statusline",
    name: "claude-code-statusline",
    stack: "TypeScript · Claude Code",
    description:
      "Customizable status line for Claude Code. Project, branch, framework, git status, model.",
    repo: "ramonclaudio/claude-code-statusline",
  },
  {
    slug: "create-claude",
    name: "create-claude",
    stack: "JavaScript · CLI",
    description:
      "Bootstrap Claude Code projects with commands, hooks, agents, and a statusline.",
    repo: "ramonclaudio/create-claude",
  },
  {
    slug: "create-codex",
    name: "create-codex",
    stack: "TypeScript · CLI",
    description:
      "Bootstrap AGENTS.md across any AI coding agent. One command, zero deps.",
    repo: "ramonclaudio/create-codex",
  },
  {
    slug: "raycast-mcp-server-manager",
    name: "raycast-mcp-server-manager",
    stack: "TypeScript · Raycast",
    description:
      "Raycast extension for managing MCP servers across Cursor, VS Code, and Windsurf.",
    repo: "ramonclaudio/raycast-mcp-server-manager",
  },
  {
    slug: "cursor-ai-liquid-glass-themes",
    name: "cursor-ai-liquid-glass-themes",
    stack: "CSS · Cursor",
    description: "Liquid glass theme mod for Cursor with real OS vibrancy.",
    repo: "ramonclaudio/cursor-ai-liquid-glass-themes",
  },
  {
    slug: "cursor-ai-usage-spending-limit-manager",
    name: "cursor-ai-usage-spending-limit-manager",
    stack: "JavaScript · Browser",
    description:
      "Browser console workaround for managing Cursor AI spending limits when the UI locks you out.",
    repo: "ramonclaudio/cursor-ai-usage-spending-limit-manager",
  },
  {
    slug: "tempo-panel-manager",
    name: "tempo-panel-manager",
    stack: "JavaScript · Extension",
    description:
      "Browser extension that opens Tempo chat and canvas panels in standalone windows.",
    repo: "ramonclaudio/tempo-panel-manager",
  },
  {
    slug: "ny-tech-week-event-crawler",
    name: "ny-tech-week-event-crawler",
    stack: "JavaScript · Browser",
    description:
      "Browser console scraper for NY Tech Week events. Zero deps, exports JSON.",
    repo: "ramonclaudio/ny-tech-week-event-crawler",
  },
  {
    slug: "ramonclaudio-com",
    name: "ramonclaudio.com",
    stack: "Astro · Tailwind",
    description:
      "This site. Astro, Tailwind, content collections, dynamic OG images. Deployed on Vercel.",
    repo: "ramonclaudio/ramonclaudio.com",
  },
  {
    slug: "firecrawl-toolkit",
    name: "firecrawl-toolkit",
    stack: "Python · Firecrawl",
    description:
      "Python wrapper for Firecrawl crawl, scrape, and map APIs with custom actions and device emulation.",
    repo: "ramonclaudio/firecrawl-toolkit",
  },
  {
    slug: "github-stats-checker",
    name: "github-stats-checker",
    stack: "Python · GitHub API",
    description:
      "GitHub profile and repo statistics. Stars, forks, watchers, languages.",
    repo: "ramonclaudio/github-stats-checker",
  },
  {
    slug: "swiftui-doc-crawler",
    name: "swiftui-doc-crawler",
    stack: "Python · Selenium",
    description:
      "Scrape SwiftUI documentation from developer.apple.com.",
    repo: "ramonclaudio/swiftui-doc-crawler",
  },
  {
    slug: "project-merge",
    name: "project-merge",
    stack: "Python · CLI",
    description:
      "Merge an entire codebase into a single Markdown file for LLM context.",
    repo: "ramonclaudio/project-merge",
  },
  {
    slug: "gemini-ai-toolkit",
    name: "gemini-ai-toolkit",
    stack: "Python · Google",
    description:
      "Python wrapper and CLI for Google Gemini with multimodal PDF, image, video, and audio support.",
    repo: "ramonclaudio/gemini-ai-toolkit",
  },
  {
    slug: "claude-ai-toolkit",
    name: "claude-ai-toolkit",
    stack: "Python · Anthropic",
    description:
      "Python wrapper and CLI for Anthropic Claude with chat, text, and vision.",
    repo: "ramonclaudio/claude-ai-toolkit",
  },
  {
    slug: "grok-ai-toolkit",
    name: "grok-ai-toolkit",
    stack: "Python · xAI",
    description:
      "Python wrapper and CLI for xAI Grok with chat, completion, and vision.",
    repo: "ramonclaudio/grok-ai-toolkit",
  },
  {
    slug: "groq-ai-toolkit",
    name: "groq-ai-toolkit",
    stack: "Python · Groq",
    description:
      "Python wrapper and CLI for Groq's LPU inference engine.",
    repo: "ramonclaudio/groq-ai-toolkit",
  },
  {
    slug: "mistral-ai-toolkit",
    name: "mistral-ai-toolkit",
    stack: "Python · Mistral",
    description:
      "Python wrapper and CLI for Mistral's Mixtral, Mistral, and NeMo models.",
    repo: "ramonclaudio/mistral-ai-toolkit",
  },
  {
    slug: "perplexity-ai-toolkit",
    name: "perplexity-ai-toolkit",
    stack: "Python · Perplexity",
    description:
      "Python wrapper and CLI for Perplexity Sonar with real-time web search.",
    repo: "ramonclaudio/perplexity-ai-toolkit",
  },
  {
    slug: "gemma-ai-toolkit",
    name: "gemma-ai-toolkit",
    stack: "Python · Google",
    description:
      "Python wrapper and CLI for Google's open-source Gemma instruct models. Offline-capable once cached.",
    repo: "ramonclaudio/gemma-ai-toolkit",
  },
  {
    slug: "google-reverse-image-search",
    name: "Google-Reverse-Image-Search",
    stack: "Python · Google",
    description:
      "Python library for Google reverse image search. Find sources and higher-resolution versions.",
    repo: "ramonclaudio/Google-Reverse-Image-Search",
  },
  {
    slug: "google-search-api-wrapper",
    name: "Google-Search-API-Wrapper",
    stack: "Python · Google",
    description:
      "Python wrapper for Google's Custom Search JSON API.",
    repo: "ramonclaudio/Google-Search-API-Wrapper",
  },
  {
    slug: "httparser",
    name: "HTTParser",
    stack: "Python · Selenium",
    description:
      "Python library for parsing static and JS-rendered web content.",
    repo: "ramonclaudio/HTTParser",
  },
];
