---
layout: ../layouts/AboutLayout.astro
title: "Now"
---

Last updated: 2026-05-13.

### Shipping

Just shipped [vexpo](https://github.com/ramonclaudio/vexpo), the mobile sibling of tanvex. Expo SDK 56 starter wiring Convex, Better Auth, and Resend end-to-end for iOS, from `npm create` to TestFlight in one afternoon. Most of my recent PRs have landed in expo, better-auth, Astro's compiler, TanStack, Convex, and napi-rs. Open PRs right now:

- [expo/expo#45700](https://github.com/expo/expo/pull/45700): SwiftUI `Alert` component for `@expo/ui` wrapping iOS 15 `.alert(_:isPresented:actions:message:)`, with `Alert.Trigger`, `Alert.Actions`, and optional `Alert.Message` slots.
- [get-convex/better-auth#368](https://github.com/get-convex/better-auth/pull/368): wrap `fetchAccessToken` in `new Promise(executor)` so `useConvexAuth().isAuthenticated` flips after sign-in on Hermes V1. Expo SDK 56 canary dropped a Babel transform that was hiding a bridge race.
- [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345): preserve the current session on `change-password` when `revokeOtherSessions` is set.
- [hugeicons/react#5](https://github.com/hugeicons/react/pull/5): `core-free-icons` subpath type shim.
- [shadcn-ui/ui#10364](https://github.com/shadcn-ui/ui/pull/10364): strip control characters from `prompts` text input so pasted hidden bytes don't break the CLI.
- [oven-sh/bun#27085](https://github.com/oven-sh/bun/pull/27085) and [#27086](https://github.com/oven-sh/bun/pull/27086): peer dep semver validation and YAML workflow fix.

Patches for each one live in [ramonclaudio/patches](https://github.com/ramonclaudio/patches) so my projects aren't waiting on review.

### Maintaining

- [vexpo](https://github.com/ramonclaudio/vexpo): Expo SDK 56 + Convex + Better Auth + Resend, wired end-to-end for iOS. Email + password, OTP, Apple Sign In, push notifications, universal links, OTA via EAS Update, submit + workflows.
- [seetree](https://github.com/ramonclaudio/seetree) at v0.1.1. Live tree viewer for Claude Code, written in Zig. Lights up files as Claude reads, writes, edits, or deletes them. ~200K binary, brew + npm.
- [convex-revenuecat](/projects/convex-revenuecat) at v0.3.0. Around 5,900 downloads, listed in the [Convex Components Directory](https://www.convex.dev/components/ramonclaudio-convex-revenuecat). Sync hooks, webhook handlers, lifecycle transitions.
- [tanstack-cn](/projects/tanstack-cn) + [create-tanstack-cn](https://www.npmjs.com/package/create-tanstack-cn): CLI scaffolder and shared runtime package, same shape as shadcn's (`bun create tanstack-cn my-app`). Around 1,000 downloads combined. TanStack Start + Vite 8 + Base UI + shadcn + oxlint/oxfmt. The [shadcn dark mode PR](https://github.com/shadcn-ui/ui/pull/10396) is wired in.
- [tanvex](/projects/tanvex): tanstack-cn extended with Better Auth and Convex, running on latest majors (Vite 8, Oxc, canary). My web dogfood, where I reproduce edge cases for TanStack, Convex, and Better Auth PRs.
- [ccbase](/projects/ccbase) for Claude Code analytics. Just shipped `ccbase mv` for rewriting paths when you move or rename a Claude Code project.
- [gitbar](/projects/gitbar): Tauri menubar GitHub dashboard. PRs, issues, reviews, and activity in one window. ~5MB binary.
