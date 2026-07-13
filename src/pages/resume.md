---
layout: ../layouts/ResumeLayout.astro
title: "Resume"
description: "Ray, product engineer in NYC, freelance since 2013. 55 merged PRs upstream, 10 npm packages, React Native on Expo with Convex and Better Auth."
---

**Product Engineer** · Brooklyn, NY

[ramonclaudio.com](https://ramonclaudio.com) · [github.com/ramonclaudio](https://github.com/ramonclaudio) · [hello@ramonclaudio.com](mailto:hello@ramonclaudio.com)

## Summary

Product engineer in New York. Freelancing solo since 2013. Give me a real bug with the time to dig and I'll ship the fix. 55 PRs merged upstream to Expo, Convex, Bun, shadcn/ui, and others, every one came from hitting a wall in my own apps and chasing it down.

## Experience

### Product Engineer · Independent

**2013 to Present · Brooklyn, NY**

- 55 PRs merged upstream across 11 repos: [expo/expo](https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (33), [shadcn-ui/ui](https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (5), [get-convex/better-auth](https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (5), [better-auth](https://github.com/better-auth/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (3), [fumadocs](https://github.com/fuma-nama/fumadocs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (2), [withastro/compiler-rs](https://github.com/withastro/compiler-rs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged) (2), plus [bun](https://github.com/oven-sh/bun/pull/21855), [TanStack/db](https://github.com/TanStack/db/pull/17), [napi-rs](https://github.com/napi-rs/napi-rs/pull/3189), App-Store-Connect-CLI, and [hermes](https://github.com/facebook/hermes/pull/2047). 11 more open across 6 repos including 2 source fixes to facebook/hermes (object-accessor home object, class-in-finally var caching), 2 in oven-sh/bun (CI YAML fix, peer-dep lockfile determinism), and the hermes-engine podspec in react/react-native.
- Build and maintain [convex-revenuecat](https://www.convex.dev/components/ramonclaudio-convex-revenuecat) (12,500+ npm downloads, listed on the Convex Components Directory), [tanstack-cn](https://www.npmjs.com/package/create-tanstack-cn) (CLI scaffolder, ~1,250 downloads), [create-claude](https://www.npmjs.com/package/create-claude) (1,800+ downloads), and 7 other shipped npm packages, 22,000+ downloads across all of them.
- Maintain [ramonclaudio/patches](https://github.com/ramonclaudio/patches) (60 patches for Bun, npm, pnpm, and Yarn) so my apps and other users ship the fix while upstream PRs are in review.
- 10,800+ GitHub contributions since Dec 2023 across 52 public repos (384 stars earned).
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

## Projects

- **[convex-revenuecat](https://github.com/ramonclaudio/convex-revenuecat)**: Convex component mirroring RevenueCat subscription state. Webhook and REST sync with lifecycle hooks for entitlement transitions. ~12,500 npm downloads, listed on the Convex Components Directory.
- **[vexpo](https://github.com/ramonclaudio/vexpo)**: Expo SDK 56 + Convex + Better Auth + Resend starter paired with a CLI that runs the full 0-to-1. `create-vexpo` scaffolds the template, then `vexpo full` provisions Convex, Apple Developer / ASC, EAS, and Resend end-to-end: account auth, secrets, env mirroring, Sign In With Apple JWT signing with 90-day auto-rotation, EAS workflows, and more.
- **[tanvex](https://github.com/ramonclaudio/tanvex)**: TanStack Start + Convex + Better Auth + Resend SaaS starter. SSR auth, email + OTP, rate-limited HTTP API, avatar uploads. Live demo at [tanvex-demo.vercel.app](https://tanvex-demo.vercel.app).
- **dreamseeker**: goal-achievement app, RevenueCat Shipyard Hackathon 2026 submission. Expo SDK 56 canary + Convex + Better Auth + RevenueCat. Row-level security, rate-limited endpoints, input validation on every mutation.
- **[uniwind-ui](https://github.com/ramonclaudio/uniwind-ui)**: shadcn/ui for React Native. Copy-and-paste components built on Uniwind, iOS + Android + Web from one codebase. Live demo at [uniwind-ui.vercel.app](https://uniwind-ui.vercel.app).

## Skills

TypeScript, Node, Bun, React, React Native, Postgres, Redis, Python.

## Education

**B.S. Computer Science** · Long Island University · 2016
