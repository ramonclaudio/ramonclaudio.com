export type Feature = {
  title: string;
  description: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  repo: string;
  language: string;
  tags: string[];
  license: string;
  features?: Feature[];
  install?: string;
  usage?: string;
  structure?: string;
  customization?: string;
  requirements?: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "tanstack-convex-starter",
    name: "tanstack-convex-starter",
    tagline: "Full-stack starter with TanStack Start + Convex.",
    description:
      "Full-stack starter with TanStack Start, Convex, and Better Auth. Includes email/password + username auth, user profiles with avatar uploads, row-level security, role-based access control, rate limiting, audit logging, and SSR.",
    repo: "ramonclaudio/tanstack-convex-starter",
    language: "TypeScript",
    tags: ["tanstack", "convex", "better-auth", "starter"],
    license: "MIT",
    features: [
      { title: "Authentication", description: "Email/password + username via Better Auth" },
      { title: "Row-Level Security", description: "RLS with convex-helpers custom functions" },
      { title: "Rate Limiting", description: "Token bucket and fixed window rate limiting" },
      { title: "Profiles", description: "User profiles with avatar uploads to Convex storage" },
    ],
    install: `git clone https://github.com/ramonclaudio/tanstack-convex-starter.git
cd tanstack-convex-starter
bun install
bun run setup        # connects Convex, generates .env.local, sets secrets
bun run dev          # starts dev server on http://localhost:3000`,
    usage: `bun run dev            # Start development
bun run setup:local    # Use local Convex backend (Docker)
bun run build          # Build for production`,
    requirements: ["Bun", "Convex account (or Docker for local backend)"],
  },
  {
    slug: "gitbar",
    name: "gitbar",
    tagline: "Menubar GitHub dashboard built with Tauri.",
    featured: true,
    description:
      "A personal GitHub dashboard that lives in your menubar. PRs, issues, repos, and activity in one window. 3 parallel GraphQL queries, stale-while-revalidate caching, progressive rendering, and a privacy toggle for screenshots.",
    repo: "ramonclaudio/gitbar",
    language: "TypeScript",
    tags: ["tauri", "rust", "github", "desktop"],
    license: "MIT",
    features: [
      { title: "PRs & Issues", description: "Yours, assigned, review requested, mentioned" },
      { title: "Activity Feed", description: "Contribution graph, stars, forks, recent events" },
      {
        title: "Progressive Rendering",
        description: "IntersectionObserver, only visible items render",
      },
      { title: "Privacy Toggle", description: "Hide private repos/PRs/issues for screenshots" },
    ],
    install: `git clone https://github.com/ramonclaudio/gitbar.git
cd gitbar
bun install
bun run tauri dev`,
    usage: `bun run tauri dev      # Development mode
bun run tauri build    # Build native binary (~5MB)`,
    requirements: ["Bun", "Rust (required by Tauri)", "gh CLI authenticated"],
  },
  {
    slug: "convex-revenuecat",
    name: "convex-revenuecat",
    tagline: "Convex component for RevenueCat subscriptions.",
    featured: true,
    description:
      "Webhook-driven RevenueCat subscription state for Convex. Stores entitlements in your database for reactive, real-time access control. Idempotent handling of all 18 webhook events with built-in rate limiting.",
    repo: "ramonclaudio/convex-revenuecat",
    language: "TypeScript",
    tags: ["convex", "revenuecat", "subscriptions", "component"],
    license: "Apache-2.0",
    features: [
      {
        title: "Webhook Processing",
        description: "Idempotent handling of all 18 RevenueCat events",
      },
      { title: "Reactive Queries", description: "Real-time entitlement and subscription state" },
      {
        title: "Edge Cases",
        description: "Cancellation keeps access until expiry, pause doesn't revoke",
      },
      { title: "Rate Limiting", description: "Built-in protection against webhook abuse" },
    ],
    install: `npm install convex-revenuecat`,
    usage: `// convex/convex.config.ts
import revenuecat from "convex-revenuecat/convex.config";
const app = defineApp();
app.use(revenuecat);

// convex/http.ts
const revenuecat = new RevenueCat(components.revenuecat, {
  REVENUECAT_WEBHOOK_AUTH: process.env.REVENUECAT_WEBHOOK_AUTH,
});
http.route({
  path: "/webhooks/revenuecat",
  method: "POST",
  handler: revenuecat.httpHandler(),
});`,
    requirements: ["Convex 1.31.6+", "RevenueCat account with webhook access"],
  },
  {
    slug: "handoff",
    name: "handoff",
    tagline: "Session continuity for Claude Code.",
    description:
      "Every Claude session starts fresh. You remember what you were working on yesterday - what got done, what broke, where you left off. Claude doesn't. This plugin fixes that. Think hospital shift change. Doctors don't try to remember everything about every patient. They do structured handoffs: current status, what happened, what to watch for, what's next. Same idea here.",
    repo: "ramonclaudio/handoff",
    language: "Shell",
    tags: ["claude-code", "plugin", "session-management"],
    license: "MIT",
    features: [
      {
        title: "Command",
        description: "Explicit control with /handoff start, /handoff end",
      },
      {
        title: "Skill",
        description: 'Claude auto-invokes when you say "handoff", "save progress", "resume"',
      },
      {
        title: "Agent",
        description: "Delegate to specialized agent for autonomous management",
      },
      {
        title: "Severity Levels",
        description: "Critical, In Progress, Ready status tracking",
      },
    ],
    install: `/plugin install ramonclaudio/handoff

# Or from terminal:
claude plugin install ramonclaudio/handoff`,
    usage: `/handoff init    # First time: create .handoff/ structure
/handoff start   # Beginning of session: gather context
/handoff end     # End of session: archive state`,
    structure: `.handoff/
├── CONTEXT.md     # Project: stack, commands, critical paths, gotchas
├── HANDOFF.md     # Session: severity, health, done, failed, blockers, resume
└── sessions/      # Archived handoffs`,
    requirements: ["Claude Code 2.1+", "Git", "Optional: gh (GitHub CLI), Linear MCP"],
  },
  {
    slug: "howold",
    name: "howold",
    tagline: "Find the latest examples in GitHub repos.",
    description:
      "Large repos have hundreds of examples but GitHub only shows last updated which is usually dependabot bumps. This finds the first commit that touched each example - the real creation date. Sort by that and you instantly see which examples are fresh.",
    repo: "ramonclaudio/howold",
    language: "TypeScript",
    tags: ["cli", "github", "developer-tools"],
    license: "MIT",
    features: [
      { title: "Real Creation Date", description: "Finds first commit, not last update" },
      { title: "Year Filtering", description: "Filter by year or year range" },
      { title: "Path Support", description: "Scan specific paths in larger repos" },
      { title: "Zero Dependencies", description: "Uses GitHub REST API directly" },
    ],
    install: `git clone https://github.com/ramonclaudio/howold.git
cd howold`,
    usage: `bun cli.ts get-convex/templates           # Scan repo
bun cli.ts get-convex/templates -l 5      # Latest 5 only
bun cli.ts get-convex/templates -y 2025   # Filter by year
bun cli.ts vercel/next.js examples/       # Specific path

# Options:
-y, --year <range>   Filter by year (2025 or 2020-2025)
-l, --limit <n>      Show n latest results`,
    requirements: ["Bun runtime", "GITHUB_TOKEN for 5000 req/hr"],
  },
  {
    slug: "uniwind-ui",
    name: "uniwind-ui",
    tagline: "shadcn/ui for React Native.",
    featured: true,
    description:
      "shadcn/ui components for React Native, built on Uniwind. Copy and paste components for iOS, Android, and Web from one codebase.",
    repo: "ramonclaudio/uniwind-ui",
    language: "TypeScript",
    tags: ["react-native", "shadcn", "uniwind", "mobile"],
    license: "MIT",
    features: [
      { title: "12+ Components", description: "Button, Card, Input, Select, and more" },
      { title: "Cross-Platform", description: "iOS, Android, and Web" },
      { title: "Uniwind Based", description: "Tailwind for React Native" },
      { title: "Copy/Paste", description: "Own and modify the code" },
    ],
    install: `# 1. Copy component from src/components/ui/
# 2. Copy src/lib/utils.ts
# 3. Import and use`,
    usage: `import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";`,
    requirements: ["React Native 0.76+", "Uniwind 1.0+", "Tailwind CSS 4+"],
  },
  {
    slug: "coderabbit-shadcn-registry",
    name: "coderabbit-shadcn-registry",
    tagline: "shadcn registry for CodeRabbit API integration.",
    description:
      "Install components directly with the shadcn CLI. Supports multiple storage backends: LocalStorage, Convex, Supabase, PostgreSQL, and MySQL. Framework-agnostic client with React hooks included.",
    repo: "ramonclaudio/coderabbit-shadcn-registry",
    language: "TypeScript",
    tags: ["shadcn", "react", "typescript", "coderabbit"],
    license: "MIT",
    features: [
      {
        title: "Multiple Backends",
        description: "LocalStorage, Convex, Supabase, PostgreSQL, MySQL",
      },
      { title: "React Hooks", description: "useCodeRabbit hook for easy integration" },
      { title: "UI Components", description: "Ready-to-use form and card components" },
      { title: "Type Safe", description: "Full TypeScript support with strict types" },
    ],
    install: `# Choose your storage backend:
npx shadcn@latest add https://coderabbit-shadcn-registry.vercel.app/r/coderabbit-localstorage.json
npx shadcn@latest add https://coderabbit-shadcn-registry.vercel.app/r/coderabbit-convex.json
npx shadcn@latest add https://coderabbit-shadcn-registry.vercel.app/r/coderabbit-supabase.json
npx shadcn@latest add https://coderabbit-shadcn-registry.vercel.app/r/coderabbit-postgres.json
npx shadcn@latest add https://coderabbit-shadcn-registry.vercel.app/r/coderabbit-mysql.json`,
    usage: `// Direct client usage
import { createCodeRabbitClient } from "@/lib/client";

const client = createCodeRabbitClient();
const results = await client.generateReport({
  from: "2024-01-01",
  to: "2024-01-31",
  promptTemplate: "Sprint Report",
});

// With React hook
import { useCodeRabbit } from "@/hooks/use-coderabbit";
import { LocalStorageAdapter } from "@/lib/storage-localstorage";

const { generateReport, isGenerating } = useCodeRabbit({
  storage: new LocalStorageAdapter(),
});`,
    requirements: ["CodeRabbit Pro plan subscription", "API key from CodeRabbit Settings"],
  },
  {
    slug: "bun-react-effect-example",
    name: "bun-react-effect-example",
    tagline: "End-to-end type safety with Effect TypeScript.",
    description:
      "The bun init React + shadcn/ui starter, made 100% type-safe with Effect TypeScript. Zero runtime type errors guaranteed through Effect's typed error channels, Schema validation, and compile-time exhaustive error handling.",
    repo: "ramonclaudio/bun-react-effect-example",
    language: "TypeScript",
    tags: ["bun", "react", "effect", "typescript"],
    license: "MIT",
    features: [
      { title: "Zero Runtime Errors", description: "No any types, no type assertions" },
      { title: "Tagged Errors", description: "Data.TaggedError for exhaustive matching" },
      { title: "Schema Validation", description: "Effect Schema validates at runtime" },
      { title: "Effect Build System", description: "CLI args, resource cleanup, error handling" },
    ],
    install: `git clone https://github.com/ramonclaudio/bun-react-effect-example.git
cd bun-react-effect-example
bun install`,
    usage: `bun dev        # Development server with HMR
bun start      # Production server
bun build      # Build for production
bun build --help  # CLI options`,
    structure: `src/
├── index.ts        # Server entry with typed Effect handlers
├── App.tsx         # React root component
├── APITester.tsx   # API test UI with Schema validation
├── frontend.tsx    # React entry with HMR support
├── lib/
│   ├── errors.ts   # Tagged errors
│   └── utils.ts    # Utility functions
└── components/ui/  # shadcn/ui components`,
  },
  {
    slug: "tanvex",
    name: "tanvex",
    tagline: "SaaS starter with TanStack Start + Convex.",
    description:
      "SaaS starter with TanStack Start, Convex real-time backend, Better Auth, Autumn billing, and Sentry monitoring. Full-stack TypeScript with React 19 and Tailwind CSS 4.",
    repo: "ramonclaudio/tanvex",
    language: "TypeScript",
    tags: ["tanstack", "convex", "saas", "typescript"],
    license: "MIT",
    features: [
      { title: "TanStack Start", description: "Full-stack React framework with SSR" },
      { title: "Convex", description: "Real-time serverless backend" },
      { title: "Better Auth", description: "Type-safe authentication" },
      { title: "Autumn Billing", description: "Stripe integration" },
    ],
    install: `gh repo create my-app --template ramonclaudio/tanvex
cd my-app
bun install`,
    usage: `bun run dev        # Start development
bun run build      # Build for production`,
    requirements: ["Bun", "Convex account", "Autumn account for Stripe"],
  },
  {
    slug: "shopify-hydrogen-shadcn-template",
    name: "shopify-hydrogen-shadcn-template",
    tagline: "Modern Shopify storefront template.",
    description:
      "Modern Shopify storefront built with Hydrogen, React Router 7, and shadcn/ui. Made for selling physical products with a modern stack.",
    repo: "ramonclaudio/shopify-hydrogen-shadcn-template",
    language: "TypeScript",
    tags: ["shopify", "hydrogen", "react", "shadcn"],
    license: "MIT",
    features: [
      { title: "Hydrogen", description: "Shopify's React framework for storefronts" },
      { title: "React Router 7", description: "Latest routing with SSR support" },
      { title: "shadcn/ui", description: "Beautiful, accessible components" },
      { title: "TypeScript", description: "Full type safety with codegen" },
    ],
    install: `git clone https://github.com/ramonclaudio/shopify-hydrogen-shadcn-template.git
cd shopify-hydrogen-shadcn-template
npm install
npx shopify hydrogen link
npx shopify hydrogen env pull`,
    usage: `npm run codegen    # Generate TypeScript types
npm run dev        # Start development
npx shopify hydrogen deploy  # Deploy to production`,
    requirements: ["Node.js 18+", "Shopify store", "Hydrogen sales channel"],
  },
  {
    slug: "polar-commerce",
    name: "polar-commerce",
    tagline: "E-commerce platform with Polar payments.",
    featured: true,
    description:
      "Experimental e-commerce built with Next.js 16, Convex, Better Auth, and Polar. Polar has no cart system so I built custom cart bundling - multiple items bundle into a single ephemeral product at checkout, then reconstruct server-side after payment via webhook.",
    repo: "ramonclaudio/polar-commerce",
    language: "TypeScript",
    tags: ["nextjs", "convex", "e-commerce", "polar"],
    license: "MIT",
    features: [
      { title: "Cart Bundling", description: "Multi-item checkout via ephemeral Polar products" },
      { title: "Real-time Sync", description: "Convex subscriptions sync cart across devices" },
      { title: "Guest Migration", description: "Anonymous cart merges on login" },
      { title: "Product Seeding", description: "JSON to Polar to Convex in one command" },
    ],
    install: `git clone https://github.com/ramonclaudio/polar-commerce.git
cd polar-commerce
npm install
cp .env.example .env.local`,
    usage: `npm run polar:seed   # Seed products to Polar + Convex
npm run dev          # Start development server`,
    requirements: ["Node.js", "Convex account", "Polar account", "Better Auth setup"],
  },
  {
    slug: "claude-code-statusline",
    name: "claude-code-statusline",
    tagline: "Beautiful status line for Claude Code.",
    description:
      "Highly customizable status line with granular control over every element. Shows project name, git branch, framework, runtime, commit status, git indicators, and current Claude model. Zero dependencies in your project.",
    repo: "ramonclaudio/claude-code-statusline",
    language: "TypeScript",
    tags: ["claude-code", "statusline", "cli"],
    license: "MIT",
    features: [
      { title: "Project Info", description: "Project name, git branch, framework, runtime" },
      { title: "Git Status", description: "Commits ahead/behind, staged, modified, untracked" },
      { title: "Model Display", description: "Current Claude model" },
      { title: "Customizable", description: "Toggle elements, change colors, swap icons" },
    ],
    install: `npm create claude-statusline

# Or with other package managers:
npx create-claude-statusline
pnpm dlx create-claude-statusline
bunx create-claude-statusline`,
    usage: `# What you get:
[ ◈ my-project on ⎇ main via ◉ React (node) | ↑ 2 / + 1 / ~ 3 / ? 2 | ⌘ Sonnet 4.5 ]

# Uninstall:
rm -rf .claude/scripts/statusline*.cjs
# Then remove "statusLine" from .claude/settings.local.json`,
    customization: `// Edit .claude/scripts/statusline-config.cjs

FEATURES: {
  SHOW_PROJECT: true,
  SHOW_GIT_BRANCH: true,
  SHOW_FRAMEWORK: true,
  SHOW_RUNTIME: true,
  SHOW_GIT_AHEAD: true,
  SHOW_GIT_STAGED: true,
  SHOW_GIT_MODIFIED: true,
  SHOW_GIT_UNTRACKED: true,
  SHOW_MODEL: true,
}

ICONS: {
  PROJECT: '◈',
  BRANCH: '⎇',
  GIT_AHEAD: '↑',
  GIT_STAGED: '+',
  GIT_MODIFIED: '~',
  GIT_UNTRACKED: '?',
  MODEL: '⌘'
}`,
  },
  {
    slug: "create-codex",
    name: "create-codex",
    tagline: "AGENTS.md setup that just works.",
    description:
      "Bootstrap every project with the open standard for AI coding agents. One command, zero headaches. Adds a local AGENTS.md file to your project with zero dependencies and zero overhead.",
    repo: "ramonclaudio/create-codex",
    language: "TypeScript",
    tags: ["cli", "agents", "ai"],
    license: "MIT",
    features: [
      {
        title: "Universal Compatibility",
        description: "Works with Codex, Cursor, Aider, Jules, Zed, Windsurf, Continue",
      },
      {
        title: "Intelligent Detection",
        description: "Auto-detects runtime, framework, package manager, git info",
      },
      {
        title: "Production-Ready",
        description: "SHA256 verification, atomic operations, automatic backups",
      },
      {
        title: "Zero Lock-in",
        description: "One file that works with any AI coding agent",
      },
    ],
    install: `npm create codex
pnpm create codex
bun create codex
yarn create codex`,
    usage: `npm create codex              # Interactive setup
npm create codex my-project   # Create in specific directory
npm create codex --dry-run    # Preview files
npm create codex --help       # All options

# Programmatic usage:
import { init } from 'create-codex';
await init('./my-project');`,
    requirements: ["Node.js 20+", "Any AI coding agent that supports AGENTS.md"],
  },
  {
    slug: "create-claude",
    name: "create-claude",
    tagline: "Claude Code setup that just works.",
    description:
      "Bootstrap every project with agents, hooks, commands, and smart permissions. One command, zero headaches. Creates 20 config files including slash commands, subagents, safety hooks, and an advanced statusline.",
    repo: "ramonclaudio/create-claude",
    language: "JavaScript",
    tags: ["claude-code", "cli", "productivity"],
    license: "MIT",
    features: [
      {
        title: "8 Slash Commands",
        description: "/commit, /explain, /fix, /optimize, /pr, /review, /test, /validate",
      },
      { title: "3 Subagents", description: "pre-commit, refactor, debugger specialists" },
      { title: "Safety Hooks", description: "Blocks destructive commands, confirms deletions" },
      {
        title: "Advanced Statusline",
        description: "Git status, framework detection, color-coded info",
      },
    ],
    install: `npm create claude
pnpm create claude
bun create claude
yarn create claude`,
    usage: `npm create claude              # Interactive setup
npm create claude --dry-run    # Preview files
npm create claude --help       # All options

# Short alias:
cld`,
    structure: `.claude/
├── settings.local.json     # Permissions, tool detection
├── hooks/                  # format, safety, session-end
├── agents/                 # pre-commit, refactor, debugger
├── commands/               # 8 slash commands
├── scripts/                # statusline helpers
└── output-styles/          # terse output style

CLAUDE.md                   # Project instructions`,
    requirements: ["Node.js 18+", "Claude Code CLI"],
  },
  {
    slug: "skills",
    name: "skills",
    tagline: "Plugin system for Claude Code.",
    featured: true,
    description:
      "8 Claude Code plugins installable individually: handoff (session continuity), audit, commit, frames, gif, qmd, simplify, techdebt. The handoff plugin has lifecycle hooks for automatic session state management across conversations.",
    repo: "ramonclaudio/skills",
    language: "Shell",
    tags: ["claude-code", "plugin", "productivity"],
    license: "MIT",
    features: [
      { title: "8 Plugins", description: "handoff, audit, commit, frames, gif, qmd, simplify, techdebt" },
      { title: "Lifecycle Hooks", description: "Auto-init, auto-save, session-start/end/clear" },
      { title: "State Persistence", description: "Session context survives across conversations" },
      { title: "Marketplace Ready", description: "Each plugin installable independently" },
    ],
    install: `/plugin install ramonclaudio/skills`,
    usage: `/handoff start   # Begin session with context
/handoff end     # Archive session state
/audit           # Run code audit
/commit          # Guided commit flow`,
    requirements: ["Claude Code 2.1+"],
  },
  {
    slug: "vercel-blob-client-starter",
    name: "vercel-blob-client-starter",
    tagline: "Complete Vercel Blob starter with Next.js.",
    description:
      "Complete client-side Vercel Blob starter with Next.js 16 and React 19. Drag and drop uploads, progress tracking, multipart support, file gallery, and 100% SDK compliance.",
    repo: "ramonclaudio/vercel-blob-client-starter",
    language: "TypeScript",
    tags: ["nextjs", "vercel", "blob", "uploads"],
    license: "MIT",
    features: [
      { title: "Drag and Drop", description: "Elegant upload with progress tracking" },
      { title: "Multipart", description: "Automatic chunking for large files" },
      { title: "File Gallery", description: "Preview, copy, delete operations" },
      { title: "SDK Compliant", description: "Full Vercel Blob API support" },
    ],
    install: `git clone https://github.com/ramonclaudio/vercel-blob-client-starter.git
cd vercel-blob-client-starter
npm install`,
    usage: `npm run dev        # Start development
npm run build      # Build for production

# Or deploy with one click:
# vercel.com/new/clone?repository-url=...`,
    requirements: ["Node.js", "Vercel account", "BLOB_READ_WRITE_TOKEN"],
  },
  {
    slug: "ramonclaudio-com",
    name: "ramonclaudio.com",
    tagline: "Personal website and blog.",
    description: "This site. Built with Astro, Tailwind, and deployed on Vercel.",
    repo: "ramonclaudio/ramonclaudio.com",
    language: "Astro",
    tags: ["astro", "tailwind", "typescript"],
    license: "MIT",
    features: [
      { title: "Blog", description: "Content collections for markdown posts" },
      { title: "Search", description: "Pagefind-powered search indexed at build time" },
      { title: "OG Images", description: "Dynamic OG image generation" },
      { title: "RSS", description: "RSS feed at /rss.xml" },
    ],
    install: `git clone https://github.com/ramonclaudio/ramonclaudio.com.git
cd ramonclaudio.com
bun install`,
    usage: `bun run dev      # Start dev server
bun run build    # Production build
bun run preview  # Preview production build
bun run lint     # ESLint check
bun run format   # Prettier formatting`,
  },
  {
    slug: "cursor-ai-liquid-glass-themes",
    name: "cursor-ai-liquid-glass-themes",
    tagline: "Liquid glass theme mod for Cursor AI.",
    description:
      "A theme mod that gives Cursor AI a sleek liquid glass/acrylic look. Uses real vibrancy for an authentic glass effect. Designed for the Cursor Dark Midnight theme with support for additional themes planned.",
    repo: "ramonclaudio/cursor-ai-liquid-glass-themes",
    language: "CSS",
    tags: ["cursor", "theme", "vibrancy"],
    license: "MIT",
    features: [
      { title: "Acrylic Effect", description: "Real vibrancy for authentic glass look" },
      { title: "Dark Midnight Palette", description: "Designed for clarity and comfort" },
      { title: "Cross-platform", description: "Works on macOS and Windows" },
      { title: "Extensible", description: "Built to support additional themes" },
    ],
    install: `# 1. Install Vibrancy Continued extension
# 2. Copy themes/cursor-dark-midnight/settings.json to your settings
# 3. Press F1 → Reload Vibrancy
# 4. Restart Cursor`,
    usage: `# macOS permission fix if needed:
sudo chown -R $(whoami):staff "/Applications/Cursor.app/"
sudo chmod -R 755 "/Applications/Cursor.app/"

# Windows: add to shortcut target:
--disable-gpu-compositing`,
    requirements: [
      "Cursor AI",
      "vscode-vibrancy-continued extension",
      "Cursor Dark Midnight theme",
    ],
  },
  {
    slug: "raycast-mcp-server-manager",
    name: "raycast-mcp-server-manager",
    tagline: "Manage MCP servers across editors from Raycast.",
    description:
      "A Raycast extension for managing MCP (Model Context Protocol) servers across Cursor, VS Code, and Windsurf. CRUD operations, connection testing, and transport support for stdio, SSE, and HTTP.",
    repo: "ramonclaudio/raycast-mcp-server-manager",
    language: "TypeScript",
    tags: ["raycast", "mcp", "cursor", "vscode"],
    license: "MIT",
    features: [
      { title: "Multi-Editor", description: "Cursor, VS Code, Windsurf support" },
      { title: "CRUD Operations", description: "Create, read, update, delete server configs" },
      { title: "Connection Testing", description: "Test servers with timeout handling" },
      { title: "Transport Types", description: "stdio, SSE, HTTP support" },
    ],
    install: `# From Raycast Store:
# Search "MCP Server Manager" and install

# Manual:
git clone https://github.com/ramonclaudio/raycast-mcp-server-manager.git
cd raycast-mcp-server-manager
npm install && npm run build`,
    usage: `# Type "MCP" in Raycast:
- List MCP Servers
- Add MCP Server
- Search MCP Servers
- Remove MCP Server
- View Raw Configs`,
    requirements: ["Raycast 1.50.0+", "Node.js 18+", "At least one supported editor"],
  },
  {
    slug: "ny-tech-week-event-crawler",
    name: "ny-tech-week-event-crawler",
    tagline: "Scrape NY Tech Week events to JSON.",
    description:
      "A browser-based event scraper for NY Tech Week. Extracts structured event data from the official website. Perfect for filtering events by host, location, time, and finding scheduling conflicts.",
    repo: "ramonclaudio/ny-tech-week-event-crawler",
    language: "JavaScript",
    tags: ["scraper", "browser", "events"],
    license: "MIT",
    features: [
      { title: "Zero Dependencies", description: "Runs directly in browser console" },
      { title: "Structured Export", description: "Clean JSON with all event details" },
      { title: "Host Identification", description: "Filter by company/organization" },
      { title: "Batch Processing", description: "Handles hundreds of events" },
    ],
    install: `# No installation needed
# 1. Go to tech-week.com/calendar
# 2. Open DevTools (F12)
# 3. Paste main.js in Console
# 4. Press Enter`,
    usage: `// Filter events by VCs
const vcEvents = events.filter(event =>
  ['a16z', 'Sequoia', 'Accel'].some(vc =>
    event.eventHost.toLowerCase().includes(vc.toLowerCase())
  )
);

// Group by location
const byLocation = events.reduce((acc, e) => {
  acc[e.eventLocation] = acc[e.eventLocation] || [];
  acc[e.eventLocation].push(e);
  return acc;
}, {});`,
  },
  {
    slug: "cursor-ai-usage-spending-limit-manager",
    name: "cursor-ai-usage-spending-limit-manager",
    tagline: "Manage Cursor AI spending limits.",
    description:
      "A browser console script to manage spending limits and toggle usage-based pricing for Cursor AI. Developed as a workaround when the frontend UI prevented updating spending limits after hitting a hard cap.",
    repo: "ramonclaudio/cursor-ai-usage-spending-limit-manager",
    language: "JavaScript",
    tags: ["cursor", "browser", "utility"],
    license: "MIT",
    features: [
      { title: "Spending Limits", description: "Set and manage spending limits" },
      { title: "Usage Toggle", description: "Toggle usage-based pricing" },
      { title: "Token Auth", description: "Secure session token authentication" },
      { title: "Browser Console", description: "No installation required" },
    ],
    install: `# 1. Open browser console (F12)
# 2. Copy and paste the script
# 3. Get your token from Cookies:
#    cursor.com -> WorkosCursorSessionToken`,
    usage: `init('your_token_here');

setLimit(100);           // Set limit to $100
setLimit(100, true);     // Set limit + disable usage-based pricing

getToken();              // Show token instructions`,
  },
  {
    slug: "tempo-panel-manager",
    name: "tempo-panel-manager",
    tagline: "Browser extension for Tempo workflows.",
    description:
      "A browser extension that opens Tempo chat and canvas panels in their own distraction-free windows. Built for pairing with a code editor.",
    repo: "ramonclaudio/tempo-panel-manager",
    language: "JavaScript",
    tags: ["extension", "tempo", "browser", "productivity"],
    license: "MIT",
    features: [
      { title: "Chat Panel", description: "Distraction-free chat window" },
      { title: "Canvas Panel", description: "Focus mode for canvas work" },
      { title: "Lightweight", description: "Minimal system impact" },
      { title: "Cross-Browser", description: "Chromium and Mozilla support" },
    ],
    install: `# Chromium (Chrome, Brave, Arc):
# 1. Clone repo
# 2. Go to chrome://extensions
# 3. Enable Developer Mode
# 4. Load unpacked from chrome/ folder`,
    usage: `# 1. Navigate to a Tempo canvas
# 2. Click Tempo icon in toolbar
# 3. Select "Open Chat Panel" or "Open Canvas Panel"`,
  },
  {
    slug: "github-stats-checker",
    name: "github-stats-checker",
    tagline: "Analyze GitHub profiles and repo statistics.",
    description:
      "A Python tool for pulling GitHub profile and repo stats — stars, forks, watchers, languages. Works with private repos via token auth.",
    repo: "ramonclaudio/github-stats-checker",
    language: "Python",
    tags: ["python", "github", "analytics"],
    license: "MIT",
    features: [
      { title: "Profile Analytics", description: "Full user profile breakdown" },
      { title: "Repository Stats", description: "Stars, forks, watchers, and more" },
      { title: "Private Repos", description: "Access with proper authentication" },
      { title: "Lightweight", description: "Minimal dependencies" },
    ],
    install: `git clone https://github.com/ramonclaudio/github-stats-checker.git
cd github-stats-checker
pip install -r requirements.txt`,
    usage: `# CLI
python cli.py --username ramonclaudio

# Python
from github_stats import Stats
Stats().run(username="ramonclaudio")`,
    requirements: ["Python 3.x", "GitHub access token (optional, for private repos)"],
  },
  {
    slug: "firecrawl-toolkit",
    name: "firecrawl-toolkit",
    tagline: "Web crawling, scraping, and mapping toolkit.",
    description:
      "Python wrapper for Firecrawl's crawling, scraping, and mapping API. Supports custom actions, multiple output formats, batch processing, device emulation, and geolocation.",
    repo: "ramonclaudio/firecrawl-toolkit",
    language: "Python",
    tags: ["python", "scraping", "crawling"],
    license: "MIT",
    features: [
      { title: "Web Crawling", description: "Customizable depth and path controls" },
      { title: "Content Extraction", description: "Markdown, HTML, raw HTML output" },
      { title: "Custom Actions", description: "Click, scroll, form fill automation" },
      { title: "Device Emulation", description: "Mobile/desktop views, custom headers" },
    ],
    install: `git clone https://github.com/ramonclaudio/firecrawl-toolkit.git
cd firecrawl-toolkit
pip install -r requirements.txt`,
    usage: `# CLI - Scrape
python cli.py --scrape --url "https://example.com"

# CLI - Crawl
python cli.py --crawl --url "https://example.com" --limit 10

# CLI - Map
python cli.py --map --url "https://example.com"`,
    requirements: ["Python 3.x", "Firecrawl API key"],
  },
  {
    slug: "swiftui-doc-crawler",
    name: "swiftui-doc-crawler",
    tagline: "Scrape Apple Developer documentation.",
    description:
      "A Python tool for scraping and processing technical documentation from the Apple Developer website.",
    repo: "ramonclaudio/swiftui-doc-crawler",
    language: "Python",
    tags: ["python", "scraping", "apple", "swiftui"],
    license: "MIT",
    features: [
      { title: "Apple Docs", description: "Scrape developer.apple.com" },
      { title: "SwiftUI Focus", description: "Optimized for SwiftUI documentation" },
      { title: "Processing", description: "Clean and format extracted content" },
      { title: "Automation", description: "Batch documentation retrieval" },
    ],
    install: `git clone https://github.com/ramonclaudio/swiftui-doc-crawler.git
cd swiftui-doc-crawler
pip install -r requirements.txt`,
    usage: `python crawler.py --url "https://developer.apple.com/documentation/swiftui"`,
  },
  {
    slug: "grok-ai-toolkit",
    name: "grok-ai-toolkit",
    tagline: "Python wrapper and CLI for xAI Grok.",
    description:
      "A lightweight Python API wrapper and CLI for xAI's Grok language models. Supports chat, text completion, and vision analysis with local images and URLs.",
    repo: "ramonclaudio/grok-ai-toolkit",
    language: "Python",
    tags: ["python", "grok", "xai", "cli"],
    license: "MIT",
    features: [
      { title: "Vision Analysis", description: "Process local images and URLs" },
      { title: "Interactive Chat", description: "Conversation history management" },
      { title: "Streaming Responses", description: "Real-time output" },
      { title: "Configurable", description: "Temperature, tokens, penalties" },
    ],
    install: `git clone https://github.com/ramonclaudio/grok-ai-toolkit.git
cd grok-ai-toolkit
pip install -r requirements.txt`,
    usage: `# CLI
python cli.py --chat
python cli.py --text --prompt "Write a story"
python cli.py --vision --prompt "Describe" --image_path photo.jpg

# Python
from grok import Chat, Text, Vision
Chat().run()
Vision().run(prompt="Describe", image_url="https://...")`,
    requirements: ["Python 3.x", "xAI API key"],
  },
  {
    slug: "project-merge",
    name: "project-merge",
    tagline: "Unify your codebase into a single file.",
    description:
      "A Python utility that merges an entire codebase into a single Markdown file. Built for pasting into LLM contexts or sharing code when file uploads aren't an option.",
    repo: "ramonclaudio/project-merge",
    language: "Python",
    tags: ["python", "cli", "llm"],
    license: "MIT",
    features: [
      { title: "LLM-Friendly", description: "Single file for easy context sharing" },
      { title: "Markdown Output", description: "Well-formatted with syntax highlighting" },
      { title: "Smart Filtering", description: "Exclude patterns, ignore files" },
      { title: "Codebase Analysis", description: "Full project in one file" },
    ],
    install: `git clone https://github.com/ramonclaudio/project-merge.git
cd project-merge
pip install -r requirements.txt`,
    usage: `python merge.py /path/to/project

# With options
python merge.py /path/to/project --output combined.md
python merge.py /path/to/project --exclude "*.test.js"`,
  },
  {
    slug: "groq-ai-toolkit",
    name: "groq-ai-toolkit",
    tagline: "Python wrapper and CLI for Groq LPU.",
    description:
      "A lightweight Python API wrapper and CLI for Groq's LPU Inference Engine. Achieve near-real-time responses at 800 tokens/sec. Supports chatbots and text generation with simple commands.",
    repo: "ramonclaudio/groq-ai-toolkit",
    language: "Python",
    tags: ["python", "groq", "ai", "cli"],
    license: "MIT",
    features: [
      { title: "Ultra-Fast", description: "800 tokens/sec with LPU engine" },
      { title: "Conversational AI", description: "Interactive chatbots and assistants" },
      { title: "Text Generation", description: "Contextually relevant responses" },
      { title: "Lightweight", description: "Minimal dependencies" },
    ],
    install: `git clone https://github.com/ramonclaudio/groq-ai-toolkit.git
cd groq-ai-toolkit
pip install -r requirements.txt`,
    usage: `# CLI
python cli.py --chat
python cli.py --text --prompt "Write a story"

# Python
from groq import Chat, Text
Chat().run()
Text().run(prompt="Write a story")`,
    requirements: ["Python 3.x", "Groq API key"],
  },
  {
    slug: "claude-ai-toolkit",
    name: "claude-ai-toolkit",
    tagline: "Python wrapper and CLI for Anthropic Claude.",
    description:
      "A lightweight Python API wrapper and CLI for Anthropic's Claude language models. Supports Claude 3.5 Sonnet and Claude 3 Opus/Sonnet/Haiku for chatbots, text generation, and image analysis.",
    repo: "ramonclaudio/claude-ai-toolkit",
    language: "Python",
    tags: ["python", "claude", "anthropic", "cli"],
    license: "MIT",
    features: [
      { title: "Conversational AI", description: "Interactive chatbots and assistants" },
      { title: "Image Captioning", description: "Generate descriptions from images" },
      { title: "Text Generation", description: "Contextually relevant text from prompts" },
      { title: "Lightweight", description: "Only requires requests package" },
    ],
    install: `git clone https://github.com/ramonclaudio/claude-ai-toolkit.git
cd claude-ai-toolkit
pip install -r requirements.txt`,
    usage: `# CLI
python cli.py --chat
python cli.py --text --prompt "Write a story"
python cli.py --vision --prompt "Describe" --image image.jpg

# Python
from claude import Chat, Text, Vision
Chat().run()`,
    requirements: ["Python 3.x", "Anthropic API key"],
  },
  {
    slug: "mistral-ai-toolkit",
    name: "mistral-ai-toolkit",
    tagline: "Python wrapper and CLI for Mistral AI.",
    description:
      "CLI and Python wrapper for Mistral AI's Mixtral, Mistral, and NeMo models. Chat, generate text, get structured JSON output.",
    repo: "ramonclaudio/mistral-ai-toolkit",
    language: "Python",
    tags: ["python", "mistral", "ai", "cli"],
    license: "MIT",
    features: [
      { title: "Multiple Models", description: "Mistral-7b, Mixtral-8x7b, NeMo" },
      { title: "Conversational AI", description: "Interactive chatbots and assistants" },
      { title: "Text Generation", description: "Contextually relevant responses" },
      { title: "JSON Output", description: "Structured output support" },
    ],
    install: `git clone https://github.com/ramonclaudio/mistral-ai-toolkit.git
cd mistral-ai-toolkit
pip install -r requirements.txt`,
    usage: `# CLI
python cli.py --chat
python cli.py --text --prompt "Write a story"

# Python
from mistral import Chat, Text
Chat().run()`,
    requirements: ["Python 3.x", "Mistral AI API key"],
  },
  {
    slug: "gemma-ai-toolkit",
    name: "gemma-ai-toolkit",
    tagline: "Python wrapper and CLI for Google Gemma.",
    description:
      "A Python wrapper and CLI for Google's open-source Gemma instruct models. Supports offline use once models are downloaded. Uses PyTorch and Transformers.",
    repo: "ramonclaudio/gemma-ai-toolkit",
    language: "Python",
    tags: ["python", "gemma", "google", "cli"],
    license: "MIT",
    features: [
      { title: "Offline Capable", description: "Use models without internet once cached" },
      { title: "Conversational AI", description: "Interactive chatbots and assistants" },
      { title: "Text Generation", description: "Contextually relevant responses" },
      { title: "Multiple Versions", description: "gemma-2b-it, gemma-7b-it" },
    ],
    install: `git clone https://github.com/ramonclaudio/gemma-ai-toolkit.git
cd gemma-ai-toolkit
pip install -r requirements.txt`,
    usage: `# CLI
python cli.py --chat
python cli.py --text --prompt "Write a story"

# Python
from gemma import Chat, Text
Chat().run()`,
    requirements: ["Python 3.6+", "Hugging Face API key (for initial download)"],
  },
  {
    slug: "perplexity-ai-toolkit",
    name: "perplexity-ai-toolkit",
    tagline: "Python wrapper and CLI for Perplexity Sonar.",
    description:
      "A lightweight Python API wrapper and CLI for Perplexity's Sonar language models built on LLama-3.1. Supports chatbots, text generation, and real-time web search.",
    repo: "ramonclaudio/perplexity-ai-toolkit",
    language: "Python",
    tags: ["python", "perplexity", "ai", "cli"],
    license: "MIT",
    features: [
      { title: "Real-Time Search", description: "Conduct web searches with precise responses" },
      { title: "Conversational AI", description: "Interactive chatbots and assistants" },
      { title: "Streaming Output", description: "Real-time response streaming" },
      { title: "Lightweight", description: "Only requires requests package" },
    ],
    install: `git clone https://github.com/ramonclaudio/perplexity-ai-toolkit.git
cd perplexity-ai-toolkit
pip install -r requirements.txt`,
    usage: `# CLI
python cli.py --chat
python cli.py --text --prompt "Search the web for..."

# Python
from perplexity import Chat, Text
Chat().run()`,
    requirements: ["Python 3.x", "Perplexity API key"],
  },
  {
    slug: "google-reverse-image-search",
    name: "Google-Reverse-Image-Search",
    tagline: "Python library for reverse image search.",
    description:
      "A Python library for Google reverse image search. Look up where an image appears, find higher-resolution versions, or identify what's in it.",
    repo: "ramonclaudio/Google-Reverse-Image-Search",
    language: "Python",
    tags: ["python", "google", "images", "search"],
    license: "MIT",
    features: [
      { title: "Reverse Search", description: "Find image sources and context" },
      { title: "Higher Resolution", description: "Find better quality versions" },
      { title: "Customizable", description: "Query options, delays, result limits" },
      { title: "Parsed Results", description: "Formatted titles and links" },
    ],
    install: `git clone https://github.com/ramonclaudio/Google-Reverse-Image-Search.git
cd Google-Reverse-Image-Search
pip install -r requirements.txt`,
    usage: `from reverse_image_search import GoogleReverseImageSearch

search = GoogleReverseImageSearch()
results = search.response(
    query="Example Query",
    image_url="https://example.com/image.jpg",
    max_results=5
)`,
  },
  {
    slug: "google-search-api-wrapper",
    name: "Google-Search-API-Wrapper",
    tagline: "Python wrapper for Google Search API.",
    description:
      "A simple Python wrapper for Google's Custom Search JSON API. Enables programmatic web and image searches with customizable queries and result limits.",
    repo: "ramonclaudio/Google-Search-API-Wrapper",
    language: "Python",
    tags: ["python", "google", "search", "api"],
    license: "MIT",
    features: [
      { title: "Web Search", description: "Programmatic Google web searches" },
      { title: "Image Search", description: "Search for images via API" },
      { title: "Formatted Results", description: "Titles, links, snippets, images" },
      { title: "Customizable", description: "Query options and result limits" },
    ],
    install: `git clone https://github.com/ramonclaudio/Google-Search-API-Wrapper.git
cd Google-Search-API-Wrapper
pip install -r requirements.txt`,
    usage: `from search import GoogleSearch

search = GoogleSearch()
results = search.web("Python programming", max_results=10)
images = search.images("cats", max_results=5)`,
    requirements: ["Python 3.x", "Google Custom Search API key", "Programmable Search Engine ID"],
  },
  {
    slug: "gemini-ai-toolkit",
    name: "gemini-ai-toolkit",
    tagline: "Python wrapper and CLI for Google Gemini.",
    description:
      "A lightweight Python API wrapper and CLI for Google's Gemini language models. Supports chat, text generation, and multimodal interactions with PDFs, images, videos, audio, and code.",
    repo: "ramonclaudio/gemini-ai-toolkit",
    language: "Python",
    tags: ["python", "gemini", "ai", "cli"],
    license: "MIT",
    features: [
      { title: "Multimodal", description: "Process PDFs, images, videos, audio, code" },
      { title: "Interactive Chat", description: "Context-aware conversations" },
      { title: "Smart File Handling", description: "Upload from paths or URLs" },
      { title: "Minimal Dependencies", description: "Primarily uses requests package" },
    ],
    install: `git clone https://github.com/ramonclaudio/gemini-ai-toolkit.git
cd gemini-ai-toolkit
pip install -r requirements.txt`,
    usage: `# CLI
python cli.py --chat
python cli.py --text --prompt "Write a story"
python cli.py --multimodal --prompt "Analyze" --files file.pdf

# Python
from gemini import Chat, Text, Multimodal
Chat().run()
Text().run(prompt="Write a story")`,
    requirements: ["Python 3.x", "Google AI Studio API key"],
  },
  {
    slug: "httparser",
    name: "HTTParser",
    tagline: "Python library for parsing web content.",
    description:
      "Python library for parsing web content via GET and POST. Handles static HTML and JavaScript-rendered pages through Selenium.",
    repo: "ramonclaudio/HTTParser",
    language: "Python",
    tags: ["python", "scraping", "http", "selenium"],
    license: "MIT",
    features: [
      { title: "HTTP Methods", description: "GET and POST support" },
      { title: "Multiple Formats", description: "JSON, HTML, JavaScript responses" },
      { title: "Dynamic Content", description: "Selenium WebDriver for JS-rendered pages" },
      { title: "Customizable", description: "Headers, parameters, payload options" },
    ],
    install: `git clone https://github.com/ramonclaudio/HTTParser.git
cd HTTParser
pip install -r requirements.txt`,
    usage: `from httparser import HTTParser

parser = HTTParser()
response = parser.parse(
    url="https://example.com",
    method="get",
    response_format="html"
)`,
    requirements: ["Python 3.x", "Optional: Selenium for dynamic content"],
  },
];
