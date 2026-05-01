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
    slug: "seetree",
    name: "seetree",
    stack: "Zig · CLI · TUI",
    description:
      "Live tree viewer for Claude Code, written in Zig. Lights up files as Claude reads, writes, edits, or deletes them. ~200K binary, on Homebrew and npm.",
    repo: "ramonclaudio/seetree",
    detail: "~200K binary",
    featured: true,
    status: "maintained",
    liveUrl: "https://www.npmjs.com/package/seetree",
    liveLabel: "npm",
    backstory:
      "I usually have at least four or five Claude Code sessions going at once. I tell Claude what I want, it goes off and reads files, edits them, writes to them, but I can never tell exactly which files got touched without reading through all the thinking and bash calls. My IDE shows the same modified dot for every tracked or untracked file, so the file edited a second ago looks identical to the file edited two weeks ago. So I built a live tree viewer that lights up as Claude works.\n\nWanted an excuse to build something in Zig given all the hype, and a CLI that lives in a side pane all day felt like a good start. Hand-rolled the JSONL scanner from scratch and swapped <code>std.process.spawn</code> and <code>std.Io.Dir</code> for direct POSIX so the binary fits at or around 200K. Default polls <code>~/.claude/projects/*.jsonl</code> every 2 seconds, with an optional <code>FileChanged</code> hook that drops the poll to 30 seconds and refreshes on every event instead.",
  },
  {
    slug: "ccbase",
    name: "ccbase",
    stack: "TypeScript · Bun · SQLite",
    description:
      "Local analytics dashboard, productivity tracker, conversation viewer, and searchable session history for Claude Code.",
    repo: "ramonclaudio/ccbase",
    detail: "206 total downloads",
    featured: true,
    status: "maintained",
    liveUrl: "https://www.npmjs.com/package/@ramonclaudio/ccbase",
    liveLabel: "npm",
    backstory:
      "I use Claude Code every day. Got curious how much value I'm actually getting out of the Max plan, so I started digging into <code>~/.claude/</code>. Turns out I'm saving a ton. That got me looking at the rest of the data: commits per day, cache hit rates, what sessions I'm working on, all of it.\n\nBuilt a dashboard that parses everything into SQLite and stays local. Full-text chat search across every project (the CLI only shows sessions for the project you're in). Also shipped <code>ccbase mv</code> because moving a project (private dir to public after open-sourcing, for example) breaks all session history: Claude Code stores absolute paths and doesn't handle moves. Now it does.",
  },
  {
    slug: "gitbar",
    name: "gitbar",
    stack: "Tauri · Rust · TypeScript · React",
    description:
      "Menubar GitHub dashboard built with Tauri. PRs, issues, repos, and activity in one window.",
    repo: "ramonclaudio/gitbar",
    detail: "~5MB binary",
    featured: true,
    status: "maintained",
    backstory:
      'Got tired of context-switching between GitHub tabs. PRs here, issues there, notifications somewhere else. Every time I wanted to check "what needs my attention?" I\'d open 4 tabs and lose 5 minutes. Built a menubar app on Tauri instead: PRs (yours, assigned, review requested, mentioned), issues, owned and contributed repos, contribution graph, activity feed.\n\n3 parallel GraphQL queries + REST events, not one blocking call. Viewer data renders as soon as it arrives, PR and issue data fills in when searches complete, activity loads last in the background. Progressive rendering via <code>IntersectionObserver</code> so only visible items render. Stale-while-revalidate caching so cached data shows instantly, fresh data loads behind it.',
  },
  {
    slug: "convex-revenuecat",
    name: "convex-revenuecat",
    stack: "TypeScript · Convex",
    description:
      "Convex component that mirrors RevenueCat subscription state. Webhook and REST sync with lifecycle hooks for entitlement transitions.",
    repo: "ramonclaudio/convex-revenuecat",
    detail: "4,041 total downloads · Convex Components Directory",
    featured: true,
    status: "maintained",
    liveUrl: "https://www.npmjs.com/package/convex-revenuecat",
    liveLabel: "npm",
    backstory:
      "I use RevenueCat for in-app purchases and Convex for everything else. Needed a way to check entitlements server-side without hitting RevenueCat's API on every request, so I built a Convex component that receives webhooks and keeps subscription state in your database. Query it like any other Convex table, get real-time reactivity for free.\n\nHandles every webhook event type RevenueCat emits, dedupes by event ID, and covers the tricky cases: cancellation keeps access until expiration, pause doesn't revoke, grace periods stay active, and refunds (CANCELLATION with <code>cancel_reason: \"CUSTOMER_SUPPORT\"</code>) revoke immediately. Listed on the Convex Components Directory.",
  },
  {
    slug: "tanvex",
    name: "tanvex",
    stack: "TanStack Start · Convex · Better Auth",
    description:
      "tanstack-cn extended with Better Auth and Convex, running on latest majors. My web dogfood, where I reproduce edge cases for TanStack, Convex, and Better Auth PRs. SSR auth, email OTP, rate limiting, one-command setup.",
    repo: "ramonclaudio/tanvex",
    featured: true,
    status: "maintained",
  },
  {
    slug: "counter",
    name: "counter",
    stack: "Expo · Convex · ElevenLabs · Firecrawl",
    description:
      "My ElevenHacks Season 1 submission. Voice AI with three modes: research products, live negotiation coaching, and practice against an AI salesman. ElevenLabs agents plus Firecrawl search.",
    repo: "ramonclaudio/counter",
    featured: true,
    status: "live",
    liveUrl: "/apps/counter",
    hackathon: {
      name: "ElevenHacks Season 1 (ElevenLabs × Firecrawl)",
      date: "Mar 2026",
    },
    backstory:
      "Hackathon submission for ElevenHacks Season 1, the ElevenLabs × Firecrawl collab. A weekend project, not a product.\n\nThree voice modes in one app. <strong>Research</strong>: ask about any product, Counter searches the web and drops intel cards with prices, market sentiment, and scam warnings as results come back. <strong>Live</strong>: keep it in your ear during an actual negotiation and it whispers coaching. <strong>Practice</strong>: a tough AI salesman that throws real tactics at you (anchoring, urgency, good cop/bad cop), scores your technique, and tells you what to fix.\n\nElevenLabs Conversational AI runs the voice agent via <code>@elevenlabs/react-native</code> over WebRTC. Each mode has its own system prompt. The agent calls custom tools (<code>updateIntelCards</code>, <code>skipTurn</code>) to push structured data back to the client as it talks. Firecrawl runs the web search on the Convex backend and feeds results back as tool context.\n\nDidn't place but I kept building it after the hackathon.",
  },
  {
    slug: "dreamseeker",
    name: "dreamseeker",
    stack: "Expo · Convex · RevenueCat",
    description:
      "My RevenueCat Shipyard 2026 submission. Goal-achievement app: break goals into daily micro-actions, track with streaks and XP, share progress to a community feed.",
    repo: "ramonclaudio/dreamseeker",
    featured: true,
    status: "live",
    liveUrl: "/apps/dreamseeker",
    hackathon: {
      name: "RevenueCat Shipyard 2026",
      date: "Feb 2026",
    },
    backstory:
      "Hackathon submission for RevenueCat Shipyard 2026. A weekend project, not a product.\n\nYou pick a goal and break it into small actions. The Today tab pulls everything into one place so you always know what to do right now. Every completed action triggers haptics, hype copy, XP, and a streak update. Completing a goal walks you through an achievement screen, guided reflection, and next steps.\n\nXP drives progression: +10 per action, +100 per goal, +15 per focus session. Ten levels from Dreamer to Legend, four achievement badges, a 16-week streak heatmap. Auth state syncs to RevenueCat on login, and every UI read is a live Convex subscription. There's row-level security on every table, rate limiting on every endpoint, and input validation on every mutation.",
  },
  {
    slug: "coderabbit-shadcn-registry",
    name: "coderabbit-shadcn-registry",
    stack: "TypeScript · React",
    description:
      "shadcn registry for CodeRabbit API integration, with framework-agnostic client, storage adapters, and React components.",
    repo: "ramonclaudio/coderabbit-shadcn-registry",
    detail: "listed in shadcn/ui registry",
    status: "live",
    liveUrl: "https://coderabbit-shadcn-registry.vercel.app",
    liveLabel: "Demo",
    backstory:
      'CodeRabbit was a sponsor of the TanStack Start hackathon. I built a reports integration into my submission, then pulled it out, made it swappable across storage backends (LocalStorage, Convex, Supabase, Postgres, MySQL), and packaged it as a standalone shadcn registry.\n\nFiled <a href="https://github.com/shadcn-ui/ui/issues/8892">shadcn-ui/ui#8892</a> asking to list it. <a href="https://github.com/shadcn">@shadcn</a> asked me to send a PR, I shipped <a href="https://github.com/shadcn-ui/ui/pull/9331">#9331</a>, it merged. Now the registry is discoverable through the shadcn CLI.',
  },
  {
    slug: "skills",
    name: "skills",
    stack: "TypeScript · Bun · Claude Code",
    description:
      "Custom Claude Code skills, installable individually as plugins. handoff, qmd, commit, polish, audit, techdebt, teams, gif, frames.",
    repo: "ramonclaudio/skills",
  },
  {
    slug: "patches",
    name: "patches",
    stack: "Diff · Bun · npm · pnpm",
    description:
      "Patch files for packages and dependencies. Drop-in fixes for bugs, missing features, and type errors awaiting upstream merges.",
    repo: "ramonclaudio/patches",
    detail:
      "@convex-dev, @expo, @shopify, better-auth, shadcn, jose, oven-sh, more",
  },
  {
    slug: "tanstack-cn",
    name: "tanstack-cn",
    stack: "TanStack Start · Vite 8 · Tailwind v4",
    description:
      "CLI scaffolder (bun create tanstack-cn my-app) and shared runtime package, same shape as shadcn's. Vite 8 Rolldown+Oxc, Tailwind v4 and shadcn/ui base-luma on Base UI, Oxlint+Oxfmt instead of Radix, ESLint, and Prettier.",
    repo: "ramonclaudio/tanstack-cn",
    detail: "673 total downloads across tanstack-cn and create-tanstack-cn",
    featured: true,
    status: "live",
    liveUrl: "https://tanstack-cn.vercel.app",
    liveLabel: "Demo",
    backstory:
      "Most TanStack Start + shadcn starters on GitHub still ship the older choices like Radix, ESLint, Prettier, and Webpack-era Vite. I wanted one on the latest majors: Vite 8 Rolldown+Oxc, Tailwind v4, shadcn base-luma on Base UI, Oxlint+Oxfmt. SEO and security plumbing are already wired up so there's nothing to strip out before starting a new project.\n\nTwo npm packages ship it: <code>create-tanstack-cn</code> scaffolds a new project (<code>bun create tanstack-cn my-app</code>), and <code>tanstack-cn</code> is the shared package the scaffolded project consumes. The CLI detects your package manager (bun, pnpm, yarn, or npm), installs dependencies, and initializes git with an initial commit.",
  },
  {
    slug: "tanstack-start-hackathon",
    name: "tanstack-start-hackathon",
    stack: "TanStack Start · Convex · Autumn",
    description:
      "My TanStack Start hackathon submission. SaaS starter with Convex, Better Auth, Autumn billing, and Sentry. Active version at tanvex.",
    repo: "ramonclaudio/tanstack-start-hackathon",
    status: "archived",
    hackathon: {
      name: "TanStack Start Hackathon",
      date: "Oct–Nov 2025",
    },
    backstory:
      'Built for the TanStack Start Hackathon, $140k prize pool, co-hosted by TanStack, Convex, Cloudflare, Netlify, Firecrawl, Autumn, CodeRabbit, and Sentry. Submission was a complete SaaS starter with SSR auth via Better Auth, Autumn billing, and Sentry monitoring wired up end-to-end.\n\nDidn\'t place. This repo is the original snapshot. Active version lives at <a href="https://github.com/ramonclaudio/tanvex">tanvex</a>.',
  },
  {
    slug: "polar-commerce",
    name: "polar-commerce",
    stack: "Next.js · Convex · Polar",
    description:
      "Experimental e-commerce on Polar with custom cart bundling, Convex real-time sync, and Better Auth.",
    repo: "ramonclaudio/polar-commerce",
    liveUrl: "https://polar-commerce.vercel.app",
    liveLabel: "Demo",
  },
  {
    slug: "shopify-hydrogen-shadcn-template",
    name: "shopify-hydrogen-shadcn-template",
    stack: "Hydrogen · React Router 7 · shadcn/ui",
    description:
      "Shopify storefront template with Hydrogen, React Router 7, and shadcn/ui.",
    repo: "ramonclaudio/shopify-hydrogen-shadcn-template",
  },
  {
    slug: "uniwind-ui",
    name: "uniwind-ui",
    stack: "React Native · Uniwind · Tailwind",
    description:
      "shadcn/ui for React Native. Copy and paste components built on Uniwind. iOS, Android, and Web from one codebase.",
    repo: "ramonclaudio/uniwind-ui",
    detail: "My own apps are moving off this toward native Swift via @expo/ui.",
  },
  {
    slug: "vercel-blob-client-starter",
    name: "vercel-blob-client-starter",
    stack: "Next.js 16 · React 19 · Vercel Blob",
    description:
      "Next.js 16 + React 19 starter exercising every client-side Vercel Blob SDK feature.",
    repo: "ramonclaudio/vercel-blob-client-starter",
  },
  {
    slug: "bun-react-effect-example",
    name: "bun-react-effect-example",
    stack: "Bun · React · Effect",
    description:
      "bun init React + shadcn/ui starter, made type-safe end-to-end with Effect TypeScript.",
    repo: "ramonclaudio/bun-react-effect-example",
  },
  {
    slug: "howold",
    name: "howold",
    stack: "Bun · TypeScript",
    description:
      "Find the latest examples, templates, and starters in GitHub repos by first-commit date instead of last-update.",
    repo: "ramonclaudio/howold",
  },
  {
    slug: "claude-code-statusline",
    name: "claude-code-statusline",
    stack: "TypeScript · Claude Code",
    description:
      "Customizable status line for Claude Code with project, git, runtime, and model info.",
    repo: "ramonclaudio/claude-code-statusline",
    detail: "395 total downloads",
  },
  {
    slug: "create-claude",
    name: "create-claude",
    stack: "JavaScript · CLI",
    description:
      "Bootstrap Claude Code into any project with hooks, agents, slash commands, and safety in one command.",
    repo: "ramonclaudio/create-claude",
    detail: "1,514 total downloads",
  },
  {
    slug: "create-codex",
    name: "create-codex",
    stack: "TypeScript · CLI",
    description:
      "Bootstrap AGENTS.md into any project with auto-detection of your stack.",
    repo: "ramonclaudio/create-codex",
    detail: "274 total downloads",
  },
  {
    slug: "raycast-mcp-server-manager",
    name: "raycast-mcp-server-manager",
    stack: "TypeScript · Raycast",
    description:
      "Raycast extension for managing MCP servers across Cursor, VS Code, and Windsurf.",
    repo: "ramonclaudio/raycast-mcp-server-manager",
    status: "archived",
  },
  {
    slug: "cursor-ai-liquid-glass-themes",
    name: "cursor-ai-liquid-glass-themes",
    stack: "CSS · Cursor",
    description:
      "Liquid glass / acrylic theme mod for Cursor, built on Vibrancy Continued.",
    repo: "ramonclaudio/cursor-ai-liquid-glass-themes",
  },
  {
    slug: "cursor-ai-usage-spending-limit-manager",
    name: "cursor-ai-usage-spending-limit-manager",
    stack: "JavaScript · Browser",
    description:
      "Browser console script for managing Cursor's spending limit and usage-based pricing. Cursor eventually fixed the bug.",
    repo: "ramonclaudio/cursor-ai-usage-spending-limit-manager",
    status: "archived",
  },
  {
    slug: "tempo-panel-manager",
    name: "tempo-panel-manager",
    stack: "JavaScript · Extension",
    description:
      "Browser extension that pops Tempo's chat and canvas panels into clean standalone windows.",
    repo: "ramonclaudio/tempo-panel-manager",
  },
  {
    slug: "ny-tech-week-event-crawler",
    name: "ny-tech-week-event-crawler",
    stack: "JavaScript · Browser",
    description:
      "Browser console script that scrapes the NY Tech Week calendar into structured JSON.",
    repo: "ramonclaudio/ny-tech-week-event-crawler",
  },
  {
    slug: "ramonclaudio-com",
    name: "ramonclaudio.com",
    stack: "Astro 6 · Tailwind v4 · TypeScript",
    description:
      "Personal site at ramonclaudio.com. Astro 6 + Tailwind v4 + TypeScript, deployed on Vercel.",
    repo: "ramonclaudio/ramonclaudio.com",
  },
  {
    slug: "firecrawl-toolkit",
    name: "firecrawl-toolkit",
    stack: "Python · Firecrawl",
    description: "Python wrapper around the Firecrawl REST API.",
    repo: "ramonclaudio/firecrawl-toolkit",
    status: "archived",
  },
  {
    slug: "github-stats-checker",
    name: "github-stats-checker",
    stack: "Python · GitHub API",
    description:
      "Python tool for analyzing GitHub profiles and repository statistics.",
    repo: "ramonclaudio/github-stats-checker",
  },
  {
    slug: "swiftui-doc-crawler",
    name: "swiftui-doc-crawler",
    stack: "Python · Selenium",
    description:
      "Python crawler for Apple Developer SwiftUI documentation. Outputs Markdown.",
    repo: "ramonclaudio/swiftui-doc-crawler",
  },
  {
    slug: "project-merge",
    name: "project-merge",
    stack: "Python · CLI",
    description:
      "Python utility that consolidates a codebase into a single LLM-friendly Markdown file.",
    repo: "ramonclaudio/project-merge",
  },
  {
    slug: "gemini-ai-toolkit",
    name: "gemini-ai-toolkit",
    stack: "Python · Google",
    description:
      "Python wrapper and CLI for Google's Gemini models, with multimodal.",
    repo: "ramonclaudio/gemini-ai-toolkit",
    status: "archived",
  },
  {
    slug: "claude-ai-toolkit",
    name: "claude-ai-toolkit",
    stack: "Python · Anthropic",
    description:
      "Python wrapper and CLI for Anthropic's Claude models, with vision.",
    repo: "ramonclaudio/claude-ai-toolkit",
    status: "archived",
  },
  {
    slug: "grok-ai-toolkit",
    name: "grok-ai-toolkit",
    stack: "Python · xAI",
    description: "Python wrapper and CLI for xAI's Grok models, with vision.",
    repo: "ramonclaudio/grok-ai-toolkit",
    status: "archived",
  },
  {
    slug: "groq-ai-toolkit",
    name: "groq-ai-toolkit",
    stack: "Python · Groq",
    description: "Python wrapper and CLI for Groq's LPU inference API.",
    repo: "ramonclaudio/groq-ai-toolkit",
    status: "archived",
  },
  {
    slug: "mistral-ai-toolkit",
    name: "mistral-ai-toolkit",
    stack: "Python · Mistral",
    description: "Python wrapper and CLI for Mistral's open and closed models.",
    repo: "ramonclaudio/mistral-ai-toolkit",
    status: "archived",
  },
  {
    slug: "perplexity-ai-toolkit",
    name: "perplexity-ai-toolkit",
    stack: "Python · Perplexity",
    description:
      "Python wrapper and CLI for Perplexity's Sonar models, with real-time search.",
    repo: "ramonclaudio/perplexity-ai-toolkit",
    status: "archived",
  },
  {
    slug: "gemma-ai-toolkit",
    name: "gemma-ai-toolkit",
    stack: "Python · Google",
    description:
      "Python wrapper and CLI for Google's Gemma open-source models.",
    repo: "ramonclaudio/gemma-ai-toolkit",
    status: "archived",
  },
  {
    slug: "google-reverse-image-search",
    name: "google-reverse-image-search",
    stack: "Python · Google",
    description: "Python wrapper for Google's reverse image search.",
    repo: "ramonclaudio/google-reverse-image-search",
  },
  {
    slug: "google-search-api-wrapper",
    name: "google-search-api-wrapper",
    stack: "Python · Google",
    description:
      "Python wrapper for Google's Custom Search JSON API. Text and image search.",
    repo: "ramonclaudio/google-search-api-wrapper",
  },
  {
    slug: "httparser",
    name: "HTTParser",
    stack: "Python · Selenium",
    description:
      "Python library for parsing web content over HTTP, with optional JavaScript rendering via Selenium.",
    repo: "ramonclaudio/HTTParser",
  },
];
