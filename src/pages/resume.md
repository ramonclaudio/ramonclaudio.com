---
layout: ../layouts/AboutLayout.astro
title: "Resume"
---

Software engineer in New York. Full-stack TypeScript across dev tools: Convex components, Tauri desktop apps, Expo mobile, CLIs, npm packages. 5 published packages, ~900 weekly downloads combined. 19 PRs merged upstream to [expo](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), [bun](https://github.com/oven-sh/bun/pull/21855), [shadcn/ui](https://github.com/shadcn-ui/ui/pull/9331), [napi-rs](https://github.com/napi-rs/napi-rs/pull/3189), [Convex](https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), [fumadocs](https://github.com/fuma-nama/fumadocs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), and [TanStack](https://github.com/TanStack/db/pull/17). Freelancing since 2013.

### Selected projects

- [convex-revenuecat](/projects/convex-revenuecat) — **~717 weekly downloads**, listed on the [Convex Components Directory](https://www.convex.dev/components/ramonclaudio-convex-revenuecat). RevenueCat sync for Convex. All 18 webhook event types, REST API sync, entitlement checking.
- [ccbase](/projects/ccbase) — **~172 weekly downloads**. Local analytics dashboard, session history, and cost tracking for Claude Code. [npm](https://www.npmjs.com/package/@ramonclaudio/ccbase).
- [coderabbit-shadcn-registry](/projects/coderabbit-shadcn-registry) — **listed in the [shadcn/ui registry](https://github.com/shadcn-ui/ui/pull/9331)**. Ships the CodeRabbit API as a shadcn registry. Framework-agnostic client, 5 storage adapters, React components.
- [gitbar](/projects/gitbar) — **~5MB Tauri binary**. Menubar GitHub dashboard. 3 parallel GraphQL queries, stale-while-revalidate caching, progressive rendering.

[Full project list →](/projects)

### Open source

19 PRs merged across 8 upstream repos: [expo/expo](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (8), [get-convex/better-auth](https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (4), [fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (2), [napi-rs/napi-rs](https://github.com/napi-rs/napi-rs/pull/3189), [shadcn-ui/ui](https://github.com/shadcn-ui/ui/pull/9331), [oven-sh/bun](https://github.com/oven-sh/bun/pull/21855), [rudrankriyam/App-Store-Connect-CLI](https://github.com/rudrankriyam/App-Store-Connect-CLI/pull/784), [TanStack/db](https://github.com/TanStack/db/pull/17). Plus a public [patches](https://github.com/ramonclaudio/patches) repo with drop-in fixes shipped in Bun, npm, pnpm, and Yarn formats so my projects (and anyone else hitting the same bug) can ship while the upstream PR is in review. Every PR I have merged shipped as a patch first.

Highlights: SwiftUI `textContentType` modifier wiring `@expo/ui` text fields into all 45 iOS keychain autofill values. `defaultScrollAnchor` for chat UIs to remove `scaleEffect(y: -1)` flips. A `PersistentFileLog.readEntries` race condition that was flaking `expo-updates` CI. A `napi-rs` v3 cross-compile regression that was breaking deploys to Amazon Linux 2023 and Vercel build containers. A `concurrent fetchAccessToken` dedup with `useRef` that closed an issue and reduced action counts on Convex. A `jose` Edge Runtime bug I traced and got fixed in `v6.0.4`.

[Full contributions list →](/contributions)

### How I work

I build tools for people who build things. When their dep breaks, I fix it upstream. When they can't wait for the release, I ship a patch. When they need a reference implementation, I put mine on GitHub. That's the whole thing.

I read code before I change it. Most of my merged PRs start by grep'ing for every place a pattern is already used. The `@expo/ui` `ClipShapeModifier` silent fallthrough to `Rectangle` was obvious once I lined it up against the four other shape modifiers in the same directory already using `ShapeType`. The `expo-modules-core` `PersistentFileLog.readEntries` race was obvious once I noticed it was the only reader bypassing the serial queue every writer relied on. The `napi-rs` v3 cross-compile regression was obvious once I found the v2 fix the rewrite dropped. The fix is usually in the diff. The understanding is in the adjacent code.

I ship the fix before the merge lands. Bug → upstream PR → drop-in patch in [ramonclaudio/patches](https://github.com/ramonclaudio/patches) so my projects (and anyone else hitting the same bug) ship without waiting for review. Every PR above shipped as a patch first. The repo supports Bun, npm, pnpm, and Yarn so the format isn't a gate. When the release lands, I bump the dep and delete the patch.

I test on real targets. iOS modifiers get validated in a bare-expo app on a simulator before the PR goes out. `react-native-view-shot` got tested on an actual RN 0.84 new-arch build. The App Store Connect CLI screen capture got tested against both a regular windowed app and a menubar panel. When a test plan says "built and ran," it was.

I write reproducible issue reports. `jose` `process.getBuiltinModule` Edge Runtime bug got fixed in [`v6.0.4`](https://github.com/panva/jose/releases/tag/v6.0.4) after my traces convinced [@panva](https://github.com/panva) it was real. The `shadcn/ui` registry directory submission led [@shadcn](https://github.com/shadcn) to invite a PR, which I shipped as [#9331](https://github.com/shadcn-ui/ui/pull/9331). The Claude Code symlink bug got a same-day "Fix incoming" from [@bcherny](https://github.com/bcherny) and a close. I try to make the maintainer's job easier than the bug made mine.

I take destructive operations seriously. The early pentesting work made me paranoid about side effects, and that paranoia ships in the tools I build. My commit guard blocks force-push, `--no-verify`, and GPG bypass so I can't accidentally ship a dirty commit. I `trash` instead of `rm`. If I can't undo it, I check the diff one more time first.

I work in short loops. Research, plan, implement, verify, commit. I keep a local search index of the docs I hit most (Convex, Expo, AI SDK, Better Auth, RevenueCat, Remotion, Tauri) so I check the source before I guess. I follow the research too: model releases, eval papers, new agentic patterns. When I think I'm done, I re-read the diff in the PR view one more time.

### What I build with

TypeScript across the full stack since 2023. Python before that, 2013 to 2023. Comfortable in Rust (via Tauri), Swift (via Expo native modules), and Go (when patching CLI tools) when the work calls for it.

- **Runtimes:** Bun (daily driver), Node when I have to, Deno when it's the right tool. Tauri with Rust for desktop. Expo with React Native for mobile.
- **Frontend:** React across web and React Native (via Expo). Hooks, context, suspense, server components when the framework supports them. Astro and TanStack Start for web, Next.js when client work calls for it. shadcn/ui and Tailwind v4 for UI.
- **Backend:** Convex with Better Auth, Zod, and `@convex-dev/*` components. Resend for email, Stripe and RevenueCat for payments. Cron jobs and HTTP routes inside Convex.
- **AI / LLM:** Prompt engineering, tool-use loops, MCP servers, agent orchestration, CLI plugin systems. Hands-on with Gemini, Perplexity, Claude, Grok, Groq, Mistral via my own CLI wrappers and SDK integrations.
- **Tooling:** Oxlint and Oxfmt for TypeScript, Ruff and ty for Python. tsgo or tsc for type checking. Custom git hooks, scripts, and CLI extensions when the default isn't enough.

### Background

Started freelancing in 2013. Reverse engineering APIs, scraping large datasets, pentesting, learning by doing. A few of those projects turned into businesses that crossed $100K ARR. The freelance life let me travel the world and still be with the people I love while I worked.

Spent 2015 to 2021 in LA collecting art and working with the street art scene: artist websites, e-commerce handling thousands of concurrent drop buyers, AR in Swift, print production and distribution. Ran collaborations with Nike, Adidas, Converse, NTWRK, and Beyond The Streets. One charity print drop raised over $80K in 24 hours.

That led straight into the AI wave. Same pattern, new medium. If I do something twice I write a script. Every tool I build goes public.

### What I'm looking for

I ship fast, own projects end-to-end, and the things I build get used. 39 repos, 5 npm packages, 19 upstream PRs. I've built systems under real load (drop commerce with thousands of concurrent buyers, bot protection, real-time inventory).

What I haven't done is sit inside an engineering org with code review, on-call, and sprint cycles. I want that next. Most interested in small teams building developer tools, devex, mobile, or AI tooling. Those are the spaces where I'm sharpest and where the habits above add up.

### Education

B.S. Computer Science, Long Island University, 2016

\- Ray
