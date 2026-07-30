---
layout: ../layouts/AboutLayout.astro
title: "Now"
description: "What Ray is shipping right now and the upstream PRs still in flight. Updated as things change."
---

Last updated: 2026-07-29.

### Shipping

Just shipped [vexpo](https://github.com/ramonclaudio/vexpo), the mobile sibling of tanvex. Expo SDK 56 starter wiring Convex, Better Auth, and Resend end-to-end for iOS, from `npm create` to TestFlight in one afternoon. Recent merges landed in expo (the `@expo/ui` `Alert`, `Host` modifiers, and the Dynamic Type `font` work, now extended with the `dynamicTypeSize` clamp, a Text-concatenation fix, the `accessibilityIdentifier`, `accessibilityHidden`, `accessibilityInputLabels`, and `accessibilityElement` modifiers, an `Image` fix that lets SF Symbols scale with Dynamic Type, `imageScale`, the SwiftUI redaction modifiers for skeleton loading and privacy-sensitive views, the `accessibilityAddTraits` and `accessibilityRemoveTraits` VoiceOver modifiers, and a `strokeBorder` modifier for dashed and shape-following borders, plus a fork-safety CI sweep), Hermes (the armv7 fork CI fix), React Native core (the TurboModule ArrayBuffer test include that got `yarn test-ios` compiling again), better-auth, Convex, and Astro's compiler. Open PRs right now:

<!-- open-prs:start -->

- [react/react-native#56912](https://github.com/react/react-native/pull/56912): silence the Xcode clean-build warning on the `hermes-engine` podspec.
- [oven-sh/bun#30855](https://github.com/oven-sh/bun/pull/30855): make `bun.lock` come out the same every run, and stop `bun add X@version` being ignored for peer deps.
- [oven-sh/bun#27086](https://github.com/oven-sh/bun/pull/27086): invalid YAML in the `update-root-certs` workflow `labels` field.
- [expo/expo#47622](https://github.com/expo/expo/pull/47622): silence the Xcode every-build warning on the `EXUpdates` podspec.
- [better-auth/better-auth#9345](https://github.com/better-auth/better-auth/pull/9345): preserve the current session on `change-password` when `revokeOtherSessions` is set.
- [shadcn-ui/ui#10364](https://github.com/shadcn-ui/ui/pull/10364): strip control characters from `prompts` text input so pasted hidden bytes don't break the CLI.
- [expo/expo#47772](https://github.com/expo/expo/pull/47772): fix deep import warning baked into the web overlay bundle.
- [microsoft/react-native-macos#3045](https://github.com/microsoft/react-native-macos/pull/3045): accept `React.ComponentRef` as the first argument of a codegen command.
<!-- open-prs:end -->

Patches for each one live in [ramonclaudio/patches](https://github.com/ramonclaudio/patches) so my projects aren't waiting on review.

### Maintaining

- [vexpo](https://github.com/ramonclaudio/vexpo): Expo SDK 56 + Convex + Better Auth + Resend, wired for iOS. Email + password, OTP, Apple Sign In, push notifications, universal links, OTA via EAS Update, submit + workflows.
- [seetree](https://github.com/ramonclaudio/seetree) at v0.1.1. Live tree viewer for Claude Code, written in Zig. Lights up files as Claude reads, writes, edits, or deletes them. ~200K binary, brew + npm.
- [convex-revenuecat](/projects/convex-revenuecat) at v0.3.2. Around 12,500 downloads, listed in the [Convex Components Directory](https://www.convex.dev/components/ramonclaudio-convex-revenuecat). Sync hooks, webhook handlers, lifecycle transitions.
- [tanstack-cn](/projects/tanstack-cn) + [create-tanstack-cn](https://www.npmjs.com/package/create-tanstack-cn): CLI scaffolder and shared runtime package, same shape as shadcn's (`bun create tanstack-cn my-app`). Around 1,250 downloads combined. TanStack Start + Vite 8 + Base UI + shadcn + oxlint/oxfmt. The [shadcn dark mode PR](https://github.com/shadcn-ui/ui/pull/10396) is wired in.
- [tanvex](/projects/tanvex): tanstack-cn extended with Better Auth and Convex, running on latest majors (Vite 8, Oxc, canary). My web dogfood, where I reproduce edge cases for TanStack, Convex, and Better Auth PRs.
- [ccbase](/projects/ccbase) for Claude Code analytics. Just shipped `ccbase mv` for rewriting paths when you move or rename a Claude Code project.
- [gitbar](/projects/gitbar): Tauri menubar GitHub dashboard. PRs, issues, reviews, and activity in one window. ~5MB binary.
