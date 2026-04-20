export type ProjectStatus = "live" | "archived" | "wip" | "maintained";

export type ProjectHackathon = {
  name: string;
  date?: string;
  outcome?: string;
};

export type Project = {
  slug: string;
  name: string;
  stack: string;
  description: string;
  repo: string;
  detail?: string;
  featured?: boolean;
  backstory?: string;
  hackathon?: ProjectHackathon;
  liveUrl?: string;
  liveLabel?: string;
  status?: ProjectStatus;
};

export const projects: Project[] = [
  {
    slug: "ccbase",
    name: "ccbase",
    stack: "TypeScript · Bun · SQLite",
    description:
      "Local analytics dashboard, session history, and cost tracking for Claude Code.",
    repo: "ramonclaudio/ccbase",
    detail: "~50 weekly downloads",
    featured: true,
    status: "maintained",
    liveUrl: "https://www.npmjs.com/package/@ramonclaudio/ccbase",
    liveLabel: "npm",
    backstory:
      "Got curious how much value I'm actually getting out of the Claude Code Max plan, so I started digging into <code>~/.claude/</code>. Turns out I'm saving a ton. Built a dashboard that parses everything into SQLite and stays local: commits per day, cache hit rates, session history, full-text chat search across every project (the CLI only shows sessions for the project you're in).\n\nAlso shipped <code>ccbase mv</code> because moving a project (private dir to public after open-sourcing, for example) breaks all session history: Claude Code stores absolute paths and doesn't handle moves. Now it does.",
  },
  {
    slug: "counter",
    name: "counter",
    stack: "Expo · Convex · TypeScript",
    description:
      "Voice AI that listens while you negotiate a deal. Pulls prices, alternatives, and angles to push on in real time.",
    repo: "ramonclaudio/counter",
    featured: true,
    status: "live",
    liveUrl: "/apps/counter",
    hackathon: {
      name: "ElevenHacks (ElevenLabs × Firecrawl)",
      date: "Mar 2026",
    },
    backstory:
      "Three voice modes in one app. <strong>Research</strong>: ask about any product, Counter searches the web and drops intel cards with prices, market sentiment, and scam warnings as results come back. <strong>Live</strong>: keep it in your ear during the actual negotiation and it whispers coaching. <strong>Practice</strong>: a tough AI salesman that throws real tactics at you (anchoring, urgency, good cop/bad cop), scores your technique, and tells you what to fix.\n\nElevenLabs Conversational AI runs the voice agent via <code>@elevenlabs/react-native</code> over WebRTC. Each mode has its own system prompt. The agent calls custom tools (<code>updateIntelCards</code>, <code>skipTurn</code>) to push structured data back to the client as it talks. Firecrawl runs the web search on the Convex backend and feeds results back as tool context.\n\nDidn't place in the hackathon. Kept building anyway.",
  },
  {
    slug: "dreamseeker",
    name: "dreamseeker",
    stack: "Expo · Convex · RevenueCat",
    description:
      "Goal-achievement app. Break long-term goals into daily actions. Track streaks and XP.",
    repo: "ramonclaudio/dreamseeker",
    featured: true,
    status: "live",
    liveUrl: "/apps/dreamseeker",
    hackathon: {
      name: "RevenueCat Shipyard",
      date: "Feb 2026",
    },
    backstory:
      "Pick a goal. Break it into small actions. The Today tab pulls everything into one place so you always know what to do right now. Every completed action triggers haptics, hype copy, XP, and a streak update. Completing a goal walks you through an achievement screen, guided reflection, and next steps.\n\nXP drives progression: +10 per action, +100 per goal, +15 per focus session. 10 levels from Dreamer to Legend. 4 achievement badges. 16-week streak heatmap. Auth state syncs to RevenueCat on login. Every UI read is a live Convex subscription. Row-level security on every table, rate limiting on every endpoint, input validation on every mutation.\n\nDidn't place in the hackathon. The app keeps going.",
  },
  {
    slug: "convex-revenuecat",
    name: "convex-revenuecat",
    stack: "TypeScript · Convex",
    description:
      "RevenueCat subscription sync for Convex. All 18 webhook event types, REST API sync, entitlement checking.",
    repo: "ramonclaudio/convex-revenuecat",
    detail: "~738 weekly downloads · Convex Components Directory",
    featured: true,
    status: "maintained",
    liveUrl: "https://www.npmjs.com/package/convex-revenuecat",
    liveLabel: "npm",
    backstory:
      "I use RevenueCat for in-app purchases and Convex for everything else. Needed a way to check entitlements server-side without hitting RevenueCat's API on every request, so I built a Convex component that receives webhooks and keeps subscription state in the database. Query it like any other Convex table, get real-time reactivity for free.\n\nHandles all 18 webhook event types, dedupes by event ID, and gets the edge cases right: cancellation keeps access until expiration, pause doesn't revoke, grace periods stay active, and refunds (CANCELLATION with <code>cancel_reason: \"CUSTOMER_SUPPORT\"</code>) revoke immediately. Listed on the Convex Components Directory.",
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
    status: "maintained",
    backstory:
      "Got tired of context-switching between GitHub tabs. PRs here, issues there, notifications somewhere else. Every time I wanted to check \"what needs my attention?\" I'd open 4 tabs and lose 5 minutes. Built a menubar app on Tauri instead: PRs (yours, assigned, review requested, mentioned), issues, owned and contributed repos, contribution graph, activity feed.\n\n3 parallel GraphQL queries + REST events, not one blocking call. Viewer data renders as soon as it arrives, PR and issue data fills in when searches complete, activity loads last in the background. Progressive rendering via <code>IntersectionObserver</code> so only visible items render. Stale-while-revalidate caching so cached data shows instantly, fresh data loads behind it.",
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
    status: "live",
    liveUrl: "https://coderabbit-shadcn-registry.vercel.app",
    liveLabel: "Demo",
    backstory:
      "CodeRabbit has a thorough code review API, but wiring it up with a storage backend meant writing the same boilerplate every time. Shipped it as a shadcn registry instead: framework-agnostic client, 5 storage adapters (LocalStorage, Convex, Supabase, PostgreSQL, MySQL), and React components for developer activity reports.\n\nFiled <a href=\"https://github.com/shadcn-ui/ui/issues/8892\">shadcn-ui/ui#8892</a> asking to list it. <a href=\"https://github.com/shadcn\">@shadcn</a> asked me to send a PR, I shipped <a href=\"https://github.com/shadcn-ui/ui/pull/9331\">#9331</a>, it merged. Now the registry is discoverable through the shadcn CLI.",
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
    detail:
      "@convex-dev, @expo, @shopify, better-auth, shadcn, jose, oven-sh, more",
  },
  {
    slug: "tanstack-cn",
    name: "tanstack-cn",
    stack: "TanStack Start · Vite 8 · Tailwind v4",
    description:
      "TanStack Start starter on the latest majors. Vite 8 Rolldown+Oxc, Tailwind v4, shadcn base-luma on Base UI, Oxlint+Oxfmt.",
    repo: "ramonclaudio/tanstack-cn",
    detail: "~624 weekly downloads (starter + create-tanstack-cn CLI)",
    featured: true,
    status: "live",
    liveUrl: "https://tanstack-cn.vercel.app",
    liveLabel: "Demo",
    backstory:
      "Every TanStack Start + shadcn starter on GitHub ships last year's choices: Radix, ESLint, Prettier, Webpack-era Vite. This one doesn't. Latest majors across the board (Vite 8 Rolldown+Oxc, Tailwind v4, shadcn base-luma on Base UI, Oxlint+Oxfmt), SEO and security plumbing wired, nothing to strip out.\n\nTwo npm packages ship it: <code>create-tanstack-cn</code> scaffolds a new project (<code>bun create tanstack-cn my-app</code>), <code>tanstack-cn</code> is the shared package the scaffolded project consumes. CLI detects your package manager (bun / pnpm / yarn / npm), installs dependencies, and initializes git with an initial commit.",
  },
  {
    slug: "tanvex",
    name: "tanvex",
    stack: "TanStack Start · Convex · Better Auth",
    description:
      "TanStack Start + Convex + Better Auth starter. SSR auth, email OTP, user profiles, rate limiting, one-command setup.",
    repo: "ramonclaudio/tanvex",
  },
  {
    slug: "tanstack-start-hackathon",
    name: "tanstack-start-hackathon",
    stack: "TanStack Start · Convex · Autumn",
    description:
      "SaaS starter with TanStack Start, Convex real-time backend, Better Auth, Autumn billing, and Sentry monitoring.",
    repo: "ramonclaudio/tanstack-start-hackathon",
    status: "maintained",
    hackathon: {
      name: "TanStack Start Hackathon",
      date: "Oct–Nov 2025",
    },
    backstory:
      "Built for the TanStack Start Hackathon, $140k prize pool, co-hosted by TanStack, Convex, Cloudflare, Netlify, Firecrawl, Autumn, CodeRabbit, and Sentry. Submission was a complete SaaS starter with SSR auth via Better Auth, Autumn billing, and Sentry monitoring wired up end-to-end.\n\nDidn't place. Starter still works.",
  },
  {
    slug: "polar-commerce",
    name: "polar-commerce",
    stack: "Next.js · Convex · Polar",
    description:
      "Experimental e-commerce on Polar. Custom cart bundling for multi-item checkout via ephemeral products.",
    repo: "ramonclaudio/polar-commerce",
    liveUrl: "https://polar-commerce.vercel.app",
    liveLabel: "Demo",
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
    description: "Scrape SwiftUI documentation from developer.apple.com.",
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
    description: "Python wrapper and CLI for Groq's LPU inference engine.",
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
    description: "Python wrapper for Google's Custom Search JSON API.",
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
