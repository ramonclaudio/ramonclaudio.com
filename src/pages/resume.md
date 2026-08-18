---
layout: ../layouts/ResumeLayout.astro
title: "Resume"
description: "Ray, developer tools engineer in NYC, 13 years shipping software. 63 merged PRs upstream, 11 npm packages, CLIs and build tooling, React Native on Expo with Convex and Better Auth."
---

**Developer Tools Engineer** · Brooklyn, NY

[ramonclaudio.com](https://ramonclaudio.com) · [github.com/ramonclaudio](https://github.com/ramonclaudio) · [hello@ramonclaudio.com](mailto:hello@ramonclaudio.com)

## Summary

Developer tools engineer in New York. 13 years shipping software. CLIs and build tooling. 63 PRs merged upstream to Expo, React Native, Convex, Bun, shadcn/ui, and others.

## Experience

### Software Engineer

**2013 to Present · Brooklyn, NY**

- 63 PRs merged upstream across 12 repos: [expo/expo](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (36), [shadcn-ui/ui](https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (5), [get-convex/better-auth](https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (5), [better-auth](https://github.com/better-auth/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (3), [hermes](https://github.com/facebook/hermes/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (3), [fumadocs](https://github.com/fuma-nama/fumadocs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (2), [withastro/compiler-rs](https://github.com/withastro/compiler-rs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (2), [react-native](https://github.com/react/react-native/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (3), plus [bun](https://github.com/oven-sh/bun/pull/21855), [TanStack/db](https://github.com/TanStack/db/pull/17), [napi-rs](https://github.com/napi-rs/napi-rs/pull/3189), and App-Store-Connect-CLI. 4 more open across 4 repos: `bun.lock` determinism in oven-sh/bun, session preservation on password change in better-auth, a pasted-control-character fix in the shadcn-ui/ui CLI, and a codegen ref-type backport in microsoft/react-native-macos.
- Build and maintain [tanstack-cn](https://www.npmjs.com/package/create-tanstack-cn) (CLI scaffolder, ~1,300 downloads), [create-claude](https://www.npmjs.com/package/create-claude) (1,870+ downloads), [convex-revenuecat](https://www.convex.dev/components/ramonclaudio-convex-revenuecat) (21,500+ npm downloads, listed on the Convex Components Directory), and 8 other shipped npm packages, 34,000+ downloads across all of them.
- Maintain [ramonclaudio/patches](https://github.com/ramonclaudio/patches) (70 patches for Bun, npm, pnpm, and Yarn) so my apps and other users ship the fix while upstream PRs are in review.
- 11,600+ GitHub contributions since Dec 2023 across 53 public repos (394 stars earned).
- 2018 to 2021 at This Is Not Art: built and maintained a custom Shopify storefront (Liquid) with anti-bot protections (velocity detection, duplicate-order blocking, URL gating) years before Shopify shipped native mitigation. Built internal tools: AR sculpture preview app, Instagram head-tracking game, inventory management, custom event registration with timeslot booking.
- 2013 to 2017 at Software Automation Services: designed and operated automation and monitoring infrastructure for the e-commerce sector, with hands-on application security research and API reverse-engineering. Shipped Python and JavaScript tooling, Chrome extensions, and related web services.

#### Selected merged PRs

- [better-auth/better-auth#9281](https://github.com/better-auth/better-auth/pull/9281): ported `./instrumentation` to conditional exports after Convex's V8 isolate threw synchronously from `import()`. Verified by reading `convex-backend`'s Rust isolate.
- [get-convex/better-auth](https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged): 5 merged PRs including [#323](https://github.com/get-convex/better-auth/pull/323) (breaking migration to better-auth 1.6, five runtime breaks in one rebase), [#218](https://github.com/get-convex/better-auth/pull/218) (stale credentials after session expiry), and [#267](https://github.com/get-convex/better-auth/pull/267) (`fetchAccessToken` deduplication).
- [expo/expo#46714](https://github.com/expo/expo/pull/46714): an internal SwiftUI font pin silently dropped `font`, `dynamicTypeSize`, and `resizable` on `@expo/ui`'s `Image`. Rerouted through the modifier pipeline so SF Symbols scale with Dynamic Type.
- [withastro/compiler-rs#25](https://github.com/withastro/compiler-rs/pull/25) + [napi-rs/napi-rs#3189](https://github.com/napi-rs/napi-rs/pull/3189): root-caused the glibc incompatibility breaking Astro deploys on Vercel and Amazon Linux 2023: a zigbuild baseline in Astro's Rust compiler CI and a silent `--cross-compile` fallthrough in `@napi-rs/cli`. Shipped in `@astrojs/compiler-rs@0.1.8`.
- [expo/expo#45872](https://github.com/expo/expo/pull/45872): `<Host modifiers={...}>` was a silent no-op on iOS: Swift never declared the field the TS side forwarded. One field plus one `.applyModifiers` chain restored the whole modifier surface.
- [expo/expo `@expo/ui` SwiftUI](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged): the rest of the surface: the SwiftUI `Alert` component, worklet-backed `scrollPosition` bindings, scroll anchors and snap paging, `clipShape`/`mask`, per-axis `scaleEffect`, `textContentType`, `textInputAutocapitalization`, Dynamic Type `font`, and the accessibility modifiers, plus the canary packaging fix and a fork-safety CI sweep.
- [shadcn-ui/ui](https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged): 5 merged PRs including [#10396](https://github.com/shadcn-ui/ui/pull/10396) (TanStack Start dark mode guide, replacing 4 prior attempts), [#9484](https://github.com/shadcn-ui/ui/pull/9484) (ComponentsList Copy-Page fix), and [#10337](https://github.com/shadcn-ui/ui/pull/10337) (llms.txt audit of 97 URLs).
- [facebook/hermes#2047](https://github.com/facebook/hermes/pull/2047) + [react/react-native#57518](https://github.com/react/react-native/pull/57518): fixes landed in Meta's Hermes and React Native core through the internal codesync import: the armv7 CI job that failed on any fork not named `hermes`, and the TurboModule ArrayBuffer test that had never compiled on OSS main.

## Projects

- **[seetree](https://github.com/ramonclaudio/seetree)**: terminal tree viewer written in Zig. Tails JSONL session logs and lights up files as they get read, written, edited, or deleted. Hand-rolled JSONL scanner and direct POSIX calls instead of `std.process.spawn`, so the binary fits at or around 200K. On Homebrew and npm.
- **[ccbase](https://github.com/ramonclaudio/ccbase)**: local log indexer. Parses a session directory into SQLite with full-text search across every project, plus a dashboard over the result. `ccbase mv` rewrites the absolute paths that break history when a project directory moves.
- **[gitbar](https://github.com/ramonclaudio/gitbar)**: menubar GitHub dashboard on Tauri. Three parallel GraphQL queries plus REST events instead of one blocking call, progressive rendering, stale-while-revalidate caching. ~5MB binary.
- **CLI scaffolders**: [tanstack-cn](https://github.com/ramonclaudio/tanstack-cn) puts up TanStack Start on Vite 8 Rolldown+Oxc, Tailwind v4, and Oxlint+Oxfmt, with package-manager detection and git init. [create-claude](https://github.com/ramonclaudio/create-claude) and [create-codex](https://github.com/ramonclaudio/create-codex) wire agent config into an existing project. ~3,500 downloads across them.
- **[vexpo](https://github.com/ramonclaudio/vexpo)**: Expo + Convex + Better Auth starter paired with a CLI that does the setup. `create-vexpo` scaffolds the template, then `vexpo full` provisions Convex, Apple Developer and ASC, EAS, and Resend end-to-end: account auth, secrets, env mirroring, Sign In With Apple JWT signing with 90-day auto-rotation, and EAS workflows.
- **[convex-revenuecat](https://github.com/ramonclaudio/convex-revenuecat)**: Convex component mirroring RevenueCat subscription state. Webhook and REST sync with lifecycle hooks for entitlement transitions. ~21,500 npm downloads, listed on the Convex Components Directory.

## Skills

TypeScript, JavaScript, Python, HTML, CSS, React, React Native, Expo, Convex, Node, Bun, SwiftUI.

## Education

**B.S. Computer Science** · Long Island University · 2016
