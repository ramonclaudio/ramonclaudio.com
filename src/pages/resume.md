---
layout: ../layouts/AboutLayout.astro
title: "Resume"
---

### Experience

**Software Engineer** (2013–present)

I've been freelancing since 2013. Started with Python, reverse engineering APIs, scraping large datasets, pentesting, learning by doing. That era eventually pulled me into TypeScript full-time and I haven't looked back.

I keep finding myself at the intersection of culture and technology. In 2013 it was the streetwear renaissance that got me going, writing bots and building tools around drops and limited releases. I started collecting art in 2015 and found my way to Los Angeles. I naturally fell into the thriving street art scene, working directly with artists, building their websites, e-commerce storefronts handling thousands of concurrent buyers, AR experiences in Swift, managing print production and distribution, traveling for murals and art fairs. Ran collaborations with Nike, Adidas, Converse, NTWRK, and Beyond The Streets. One charity print drop raised over $80K in 24 hours.

That led straight into the AI wave. Same pattern, new medium. Now I write TypeScript across the full stack: Tauri desktop apps, Convex components, Claude Code plugins, Expo mobile apps.

Some recent projects:

- [convex-revenuecat](https://github.com/ramonclaudio/convex-revenuecat): Convex component for RevenueCat subscriptions. All 18 webhook event types, REST API sync, entitlement checking. Listed on the [Convex Components Directory](https://www.convex.dev/components/ramonclaudio-convex-revenuecat). ~717 weekly downloads.
- [AI toolkit suite](https://github.com/ramonclaudio?tab=repositories&q=toolkit): CLI wrappers and Python APIs for Gemini, Perplexity, Claude, Grok, Groq, and Mistral. 260+ combined stars across 6 repos.
- [gitbar](https://github.com/ramonclaudio/gitbar): Menubar GitHub dashboard built with Tauri and Rust. 3 parallel GraphQL queries, stale-while-revalidate caching, ~5MB binary.
- [coderabbit-shadcn-registry](https://github.com/ramonclaudio/coderabbit-shadcn-registry): Modular shadcn registry for CodeRabbit API. Framework-agnostic client, storage adapters, React components. Listed in the [shadcn/ui registry](https://github.com/shadcn-ui/ui/pull/9331).
- [create-claude](https://github.com/ramonclaudio/create-claude): Scaffolds Claude Code projects with agents, hooks, commands, and permissions. One command. [npm package](https://www.npmjs.com/package/create-claude).
- [ccbase](https://github.com/ramonclaudio/ccbase): Local analytics dashboard, session history, and cost tracking for Claude Code. [npm package](https://www.npmjs.com/package/@ramonclaudio/ccbase). ~172 weekly downloads.
- [polar-commerce](https://github.com/ramonclaudio/polar-commerce): E-commerce on Polar. They had no cart system so I built one. Ephemeral product bundling at checkout, webhook reconstruction server-side.

### Open Source

39 public repos. 5 published npm packages. ~900 combined weekly downloads. If I do something twice I write a script, and if the script is useful I open source it.

17 merged PRs across 8 repos:

- expo/expo (6 PRs): [#43958](https://github.com/expo/expo/pull/43958) PersistentFileLog race condition on the serial dispatch queue, [#43955](https://github.com/expo/expo/pull/43955) scrollTargetBehavior and scrollTargetLayout modifiers for scroll snapping, [#43923](https://github.com/expo/expo/pull/43923) defaultScrollAnchor for role modifier (iOS 18+), [#43914](https://github.com/expo/expo/pull/43914) defaultScrollAnchor modifier (iOS 17+), [#43228](https://github.com/expo/expo/pull/43228) per-axis scaleEffect for inverted list patterns, [#43158](https://github.com/expo/expo/pull/43158) clipShape and mask shape enum fix
- get-convex/better-auth (4 PRs): [#218](https://github.com/get-convex/better-auth/pull/218) stale auth state after session expiry from cookie date parsing, [#245](https://github.com/get-convex/better-auth/pull/245) peer dep range widening for 1.4.x, [#267](https://github.com/get-convex/better-auth/pull/267) concurrent fetchAccessToken dedup with useRef, [#278](https://github.com/get-convex/better-auth/pull/278) dead react-dom peer dep removal
- napi-rs/napi-rs (1 PR): [#3189](https://github.com/napi-rs/napi-rs/pull/3189) cross-compile regression in v3 CLI where `--cross-compile` silently fell through to `cargo build` when host matched target
- shadcn-ui/ui (1 PR): [#9331](https://github.com/shadcn-ui/ui/pull/9331) CodeRabbit registry addition to open source directory
- oven-sh/bun (1 PR): [#21855](https://github.com/oven-sh/bun/pull/21855) TypeScript definitions for `fetch()` decompress option
- fuma-nama/fumadocs (2 PRs): [#2092](https://github.com/fuma-nama/fumadocs/pull/2092) TanStack Start integration fixes (vite-react plugin, 404 component, module resolution, hydration errors), [#2095](https://github.com/fuma-nama/fumadocs/pull/2095) formatting for changesets release
- rudrankriyam/App-Store-Connect-CLI (1 PR): [#784](https://github.com/rudrankriyam/App-Store-Connect-CLI/pull/784) macOS app window capture via `screencapture` and Swift `CGWindowListCopyWindowInfo`, Mac App Store canvas framing
- TanStack/db (1 PR): [#17](https://github.com/TanStack/db/pull/17) docs fix

I also maintain a public [patches](https://github.com/ramonclaudio/patches) repo with drop-in fixes for packages where the upstream PR is slow. Available for bun, pnpm, and npm.

Open PRs (patches available now):

- `@shopify/hydrogen`, `@shopify/hydrogen-react`, `@shopify/mini-oxygen`, `@shopify/cli-hydrogen`: Vite 7 support ([Shopify/hydrogen#3493](https://github.com/Shopify/hydrogen/pull/3493))
- `bun`: peer dep validation and CI fix ([oven-sh/bun#27085](https://github.com/oven-sh/bun/pull/27085), [#27086](https://github.com/oven-sh/bun/pull/27086))
- `convex`: WebSocketManager addEventListener guard
- `react-native-view-shot`: React Native 0.84 new architecture compatibility
- `@tobilu/qmd`: local fixes

Previously open, now merged upstream:

- `@expo/ui`: per-axis scaleEffect and clipShape/mask fixes (merged in [#43228](https://github.com/expo/expo/pull/43228), [#43158](https://github.com/expo/expo/pull/43158))
- `@convex-dev/better-auth`: auth state, token dedup, peer deps (merged in [#218](https://github.com/get-convex/better-auth/pull/218), [#245](https://github.com/get-convex/better-auth/pull/245), [#267](https://github.com/get-convex/better-auth/pull/267))
- `bun`: fetch decompress types (merged in [#21855](https://github.com/oven-sh/bun/pull/21855))

### What I build with

TypeScript (primary since 2023), Python (2013–2023). Bun, Convex, TanStack Start, Next.js, Astro, Expo, React Native, Tauri, shadcn/ui, Tailwind CSS.

### What I haven't done

I've built systems under real load (drop commerce with thousands of concurrent buyers, bot protection, real-time inventory) but haven't worked at the scale of distributed microservices or production DevOps. I've coordinated across teams operationally but haven't worked inside an engineering org with code review, on-call, and sprint cycles. I ship fast and own projects end-to-end. Now I want to do that on a team.

### Education

B.S. Computer Science, Long Island University, 2016

\- Ray
