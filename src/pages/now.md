---
layout: ../layouts/AboutLayout.astro
title: "Now"
description: "What Ray is shipping right now and the upstream PRs still in flight. Updated as things change."
---

Last updated: 2026-06-03.

### Shipping

Just shipped [vexpo](https://github.com/ramonclaudio/vexpo), the mobile sibling of tanvex. Expo SDK 56 starter wiring Convex, Better Auth, and Resend end-to-end for iOS, from `npm create` to TestFlight in one afternoon. Recent merges landed in expo (the `@expo/ui` `Alert`, `Host` modifiers, and the Dynamic Type `font` work, now extended with the `dynamicTypeSize` clamp, a Text-concatenation fix, and the `accessibilityIdentifier` modifier, plus a fork-safety CI sweep), better-auth, Convex, and Astro's compiler. Open PRs right now:

- [expo/expo#46579](https://github.com/expo/expo/pull/46579): iOS `accessibilityHidden` modifier to hide decorative views (hero icons, already-described imagery) from VoiceOver traversal.
- [facebook/hermes#2045](https://github.com/facebook/hermes/pull/2045): cherry-pick the object-literal accessor home-object fix onto the stable Hermes branch RN 0.85 ships, so `super.x` in a getter or setter stops SIGSEGV'ing `hermesc`. The direct source fix that replaced the `babel-preset` workaround.
- [facebook/hermes#2046](https://github.com/facebook/hermes/pull/2046): cherry-pick the class-in-`finally` variable-caching fix so a `class` declared in a `finally` block stops miscompiling. Same Hermes V1 root cause.
- [facebook/hermes#2047](https://github.com/facebook/hermes/pull/2047): use the repo name instead of a hardcoded `hermes` dir in the `test-linux-armv7` CI job so it passes on forks.
- [facebook/react-native#56912](https://github.com/facebook/react-native/pull/56912): set `always_out_of_date` on the `hermes-engine` podspec's Replace Hermes phase to silence the Xcode clean-build warning.
- [oven-sh/bun#30855](https://github.com/oven-sh/bun/pull/30855): drop the order-dependent peer-dep early match so `bun.lock` stops varying run to run, and fix `bun add X@version` being ignored when `X` is a same-name peer dep.
- [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086): invalid YAML in the `update-root-certs` workflow `labels` field.
- [get-convex/better-auth#368](https://github.com/get-convex/better-auth/pull/368): wrap `fetchAccessToken` in `new Promise(executor)` so `useConvexAuth().isAuthenticated` flips after sign-in on Hermes V1. Expo SDK 56 canary dropped a Babel transform that was hiding a bridge race.
- [get-convex/better-auth#329](https://github.com/get-convex/better-auth/pull/329): drop the cached JWT when the session id changes so `useConvexAuth` stops holding a token for a session that was just rotated out.
- [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345): preserve the current session on `change-password` when `revokeOtherSessions` is set.
- [hugeicons/react#5](https://github.com/hugeicons/react/pull/5): `core-free-icons` subpath type shim.
- [shadcn-ui/ui#10364](https://github.com/shadcn-ui/ui/pull/10364): strip control characters from `prompts` text input so pasted hidden bytes don't break the CLI.

Patches for each one live in [ramonclaudio/patches](https://github.com/ramonclaudio/patches) so my projects aren't waiting on review.

### Maintaining

- [vexpo](https://github.com/ramonclaudio/vexpo): Expo SDK 56 + Convex + Better Auth + Resend, wired for iOS. Email + password, OTP, Apple Sign In, push notifications, universal links, OTA via EAS Update, submit + workflows.
- [seetree](https://github.com/ramonclaudio/seetree) at v0.1.1. Live tree viewer for Claude Code, written in Zig. Lights up files as Claude reads, writes, edits, or deletes them. ~200K binary, brew + npm.
- [convex-revenuecat](/projects/convex-revenuecat) at v0.3.2. Around 7,700 downloads, listed in the [Convex Components Directory](https://www.convex.dev/components/ramonclaudio-convex-revenuecat). Sync hooks, webhook handlers, lifecycle transitions.
- [tanstack-cn](/projects/tanstack-cn) + [create-tanstack-cn](https://www.npmjs.com/package/create-tanstack-cn): CLI scaffolder and shared runtime package, same shape as shadcn's (`bun create tanstack-cn my-app`). Around 1,050 downloads combined. TanStack Start + Vite 8 + Base UI + shadcn + oxlint/oxfmt. The [shadcn dark mode PR](https://github.com/shadcn-ui/ui/pull/10396) is wired in.
- [tanvex](/projects/tanvex): tanstack-cn extended with Better Auth and Convex, running on latest majors (Vite 8, Oxc, canary). My web dogfood, where I reproduce edge cases for TanStack, Convex, and Better Auth PRs.
- [ccbase](/projects/ccbase) for Claude Code analytics. Just shipped `ccbase mv` for rewriting paths when you move or rename a Claude Code project.
- [gitbar](/projects/gitbar): Tauri menubar GitHub dashboard. PRs, issues, reviews, and activity in one window. ~5MB binary.
