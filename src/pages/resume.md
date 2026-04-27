---
layout: ../layouts/AboutLayout.astro
title: "Resume"
---

Product engineer in New York. I build React Native apps on Expo with Convex for backend and Better Auth for auth, mostly on canary. Most of what's on my GitHub started as friction in my own app: a dep behaves strangely, an API doesn't do what the docs promise, a build breaks in a way the error message doesn't explain. I follow the thread until I understand what's wrong, file the PR upstream, and keep a patch around so my projects aren't waiting on review.

I'm not the kind of engineer who has framework internals memorized. Give me a real problem and time to read the source, though, and I'll ship the fix. That's how I got 28 PRs merged upstream to [expo](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), [Convex](https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), [better-auth](https://github.com/better-auth/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), [shadcn/ui](https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), [bun](https://github.com/oven-sh/bun/pull/21855), [napi-rs](https://github.com/napi-rs/napi-rs/pull/3189), [fumadocs](https://github.com/fuma-nama/fumadocs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), [Astro](https://github.com/withastro/compiler-rs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged), and [TanStack](https://github.com/TanStack/db/pull/17).

Full-stack TypeScript across dev tools: Convex components, Tauri desktop apps, Expo mobile, CLIs, npm packages. 7 published packages, ~6,800 total downloads. Freelancing since 2013, CS degree 2016.

### Selected projects

- [convex-revenuecat](/projects/convex-revenuecat): **3,767 total downloads**, listed on the [Convex Components Directory](https://www.convex.dev/components/ramonclaudio-convex-revenuecat). Convex component that mirrors RevenueCat subscription state. Webhook and REST sync with lifecycle hooks for entitlement transitions.
- [tanstack-cn](/projects/tanstack-cn) + [create-tanstack-cn](https://www.npmjs.com/package/create-tanstack-cn): **657 total downloads**. CLI scaffolder and shared runtime package, same shape as shadcn's (`bun create tanstack-cn my-app`). Vite 8 Rolldown+Oxc, Tailwind v4 and shadcn/ui base-luma on Base UI, Oxlint+Oxfmt. No Radix, no ESLint, no Prettier.
- [ccbase](/projects/ccbase): **200 total downloads**. Local analytics dashboard, session history, and cost tracking for Claude Code. [npm](https://www.npmjs.com/package/@ramonclaudio/ccbase).
- [coderabbit-shadcn-registry](/projects/coderabbit-shadcn-registry): **listed in the [shadcn/ui registry](https://github.com/shadcn-ui/ui/pull/9331)**. Ships the CodeRabbit API as a shadcn registry. Framework-agnostic client, 5 storage adapters, React components.
- [gitbar](/projects/gitbar): **~5MB Tauri binary**. Menubar GitHub dashboard. 3 parallel GraphQL queries, stale-while-revalidate caching, progressive rendering.

[Full project list →](/projects)

### Open source

28 PRs merged across 10 upstream repos: [expo/expo](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (8), [shadcn-ui/ui](https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (5), [get-convex/better-auth](https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (4), [better-auth/better-auth](https://github.com/better-auth/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (3), [fuma-nama/fumadocs](https://github.com/fuma-nama/fumadocs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (2), [withastro/compiler-rs](https://github.com/withastro/compiler-rs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (2), [napi-rs/napi-rs](https://github.com/napi-rs/napi-rs/pull/3189), [oven-sh/bun](https://github.com/oven-sh/bun/pull/21855), [rorkai/App-Store-Connect-CLI](https://github.com/rorkai/App-Store-Connect-CLI/pull/784), [TanStack/db](https://github.com/TanStack/db/pull/17). 9 more open across 6 repos. Plus a public [patches](https://github.com/ramonclaudio/patches) repo (112 patch files for Bun, npm, and pnpm) so my projects and anyone else hitting the same bug can ship while the upstream PR is in review. Every PR I have merged shipped as a patch first.

10 PRs to [expo/expo](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio) (8 merged, 2 open). Nine are `@expo/ui` modifiers: `textContentType` with all 45 `UITextContentType` values, `textInputAutocapitalization`, `defaultScrollAnchor`, `defaultScrollAnchorForRole`, `scrollTargetBehavior`, `scrollTargetLayout`, `scrollPosition` binding with worklet callbacks, `scaleEffect` per-axis, and the `clipShape`/`mask` `ShapeType` fix. The tenth is an open `expo-router` infinite-render-loop fix in `Stack` composition components.

Other highlights: a `napi-rs` v3 cross-compile regression breaking deploys to Amazon Linux 2023 and Vercel build containers. A `PersistentFileLog.readEntries` race condition that was flaking `expo-updates` CI (the only reader bypassing the serial queue every writer relied on). A `jose` Edge Runtime bug I traced and got fixed in `v6.0.4`. A `concurrent fetchAccessToken` dedup with `useRef` that closed an issue and reduced action counts on Convex. A 17-file better-auth 1.6 migration PR handling three breaking changes at once (`Where.mode`, `shouldReturnResponse` flip, `twoFactor.verified`).

[Full contributions list →](/contributions)

### How I work

Most of my time goes into the open source tools I use every day. I'll be building something, hit a bug in a dep, and end up reading the source to figure out what's going on. Whatever fix I write usually makes sense as a PR, so it goes upstream. If I can't wait for review (and on canary that's most of the time) I drop a patch in [ramonclaudio/patches](https://github.com/ramonclaudio/patches) so my projects, and anyone else hitting the same thing, can ship without waiting. 112 patch files for Bun, npm, and pnpm. When the release lands I bump the dep and delete the patch.

The reason I've been chipping away at [`@expo/ui`](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio) since it shipped is I want my apps off NativeWind-style layers, including my own [uniwind-ui](/projects/uniwind-ui) port. Native Swift components directly inside Expo is where I want the stack to end. Same reason I'm on canary. Nine of my ten Expo PRs are SwiftUI modifiers: `textContentType` with all 45 `UITextContentType` values, `textInputAutocapitalization`, `defaultScrollAnchor`, `defaultScrollAnchorForRole`, `scrollTargetBehavior`, `scrollTargetLayout`, per-axis `scaleEffect`, the `ShapeType` capsule / ellipse fix, and the open `scrollPosition` binding with worklet callbacks.

Most of the bugs I end up fixing passed CI. Silent fallthroughs to defaults nobody tested, type coercion that reads sensible but evaluates false, test setups that don't match production. The fix usually lands in a few lines, but finding it means reading a lot of adjacent code first. Most of my merged PRs start with me grep'ing for every place a pattern is already used so I can figure out what the broken call site was supposed to look like.

Some fixes span more than one repo. The session rotation fix is two PRs: [better-auth#9087](https://github.com/better-auth/better-auth/pull/9087) adds `/change-password` to the upstream `atomListeners` matcher, [get-convex/better-auth#329](https://github.com/get-convex/better-auth/pull/329) invalidates the cached JWT in the Convex adapter. Neither is useful alone. The better-auth 1.6 migration touched validators, plugins, schema, and hooks across 17 files in a single PR because shipping any piece without the others breaks production auth.

When a new API ships I usually end up building something with it fast, just to see what it can do. First Claude wrapper went up the day Claude 3 dropped. First Grok wrapper before xAI had a Python SDK. Same rhythm with Vite 7, Next.js 16, Bun, Expo canary, Polar.

When I file an issue I try to give maintainers enough to act on in one pass: a specific repro, the stack trace, the line in their source where the behavior diverges. That's how I've landed next-patch-release fixes, picked up invites to send the PR myself, and gotten same-day `Fix incoming` replies from people who didn't owe me the time.

I work in short loops. Research, plan, implement, verify, commit. Claude Code and Cursor are in the loop with me. I keep a local search index of the docs I hit most (Convex, Expo, AI SDK, Better Auth, RevenueCat, Remotion, Tauri) so I check the source before I guess. Same with research: model releases, eval papers, new agentic patterns. When I think I'm done, I re-read the diff in the PR view one more time. I get things wrong. Usually catching it takes one more pass than I want.

Destructive operations make me paranoid. Early pentesting work taught me how many things can go wrong at once. My commit guard blocks force-push, `--no-verify`, and GPG bypass so I can't accidentally ship a dirty commit. I `trash` instead of `rm`. If I can't undo it, I check the diff one more time first.

### What I build with

TypeScript full-stack since 2023, Python before that (2013 to 2023). Swift on `@expo/ui` modifier PRs. Rust on Tauri apps and the `napi-rs` cross-compile regression. Zig 0.16 for Claude Code infra (`seetree`) at the `std_options` level. Go on the App Store Connect CLI patch.

Runtime is Bun for everything non-mobile. Node when I have to. Single-file binaries via `bun build --compile` for CLIs.

Mobile is Expo on canary, always. `@expo/ui` and `expo-glass-effect` for UI because I want to stay as close to native Swift as possible. Six apps running on the same skeleton: Expo canary + Convex + Better Auth + RevenueCat + Resend + `@expo/ui` glass components. No NativeWind.

Web splits. New work is TanStack Start + Vite 8 + Base UI + shadcn + oxlint/oxfmt + Bun. No Radix, no ESLint, no Prettier. Next 16 for content and marketing surfaces. Astro for this site. Shopify Hydrogen for storefronts.

Backend is Convex. Real-time queries, file storage, cron, HTTP routes, scheduled functions. Better Auth via `@convex-dev/better-auth`. Resend via `@convex-dev/resend`. RevenueCat via my own `convex-revenuecat` component on npm (published with provenance). Zod 4 for validation everywhere.

AI work: prompt engineering, tool-use loops, MCP servers, agent orchestration. `@anthropic-ai/sdk` in production pipelines. `@ai-sdk/*` for provider-agnostic inference. ElevenLabs and LiveKit for voice. Firecrawl and Exa for search. `node-llama-cpp` for local inference when the work calls for it.

Desktop is Tauri 2 with Rust. `gitbar` is the reference.

Tooling is oxlint + oxfmt for TypeScript, Ruff for Python. `tsgo` / `tsc` for type checking. Custom git hooks, Expo config plugins, CI workflows when the default isn't enough.

### Background

Started freelancing in 2013. Reverse engineering APIs, scraping large datasets, pentesting, learning by doing. A few of those sneaker-bot and art-drop systems cleared six figures in annual revenue before I moved on.

Spent 2015 to 2021 in LA collecting art and working with the street-art scene: artist websites, e-commerce handling thousands of concurrent drop buyers, AR in Swift, print production and distribution. Ran operations on limited-edition drops with Adidas, Nike, Converse, NTWRK, and Beyond The Streets. One charity print drop raised over $80K in 24 hours.

That led straight into the AI wave. Same pattern, new medium. If I do something twice I write a script. Every tool I build goes public.

### What I'm looking for

I ship a lot. Been solo my whole career, so every project is end-to-end. 40 repos, 7 npm packages, 28 upstream PRs merged, 9 more open. The art years also put me through drop commerce with thousands of concurrent buyers, bot protection, and real-time inventory.

Most of my team engineering experience comes from contributing upstream and getting feedback from core maintainers on my PRs. What I haven't done is sit inside an engineering org with code review, on-call, and sprint cycles. I want that next. Specifically, I want to work next to people who are better than me so I get better faster. Every time a maintainer has pushed back on one of my PRs or refactored something I wrote, I've come away a better engineer for it. I want those conversations happening every day instead of once a month. Developer tools, devex, mobile, or AI tooling are where my habits would add up fastest.

### Education

B.S. Computer Science, Long Island University, 2016

\- Ray
