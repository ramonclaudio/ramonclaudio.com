// Single source of truth for upstream contributions. The homepage, the
// contributions page, now.md's open-PR list, llms.txt, and the JSON-LD schema
// derive from this file. `bun reconcile` audits it against live GitHub;
// `bun reconcile:fix` fixes it: new PRs get scaffolded entries, open PRs
// move to merged when they land, closed ones drop out, and patchesCount
// refreshes from the patches README. Titles and details are editorial — polish
// the scaffolds, the structure is machine-managed.

export type Contribution = {
  repo: string;
  number: number;
  title: string; // terse one-liner (homepage, now.md open list)
  detail?: string; // fuller description (contributions page); falls back to title
};

// Row count of the ramonclaudio/patches README tables (Open + Merged).
export const patchesCount = 68;

export const merged: Contribution[] = [
  {
    repo: "better-auth/better-auth",
    number: 9281,
    title:
      "noop ./instrumentation export so Convex's V8 isolate stops crashing",
    detail:
      'serve a noop `./instrumentation` via conditional exports for `browser` and edge runtimes, matching the shape `./async_hooks` already uses. The dynamic `import("@opentelemetry/api")` in `packages/core/src/instrumentation/api.ts` threw synchronously on runtimes like Convex\'s V8 isolate (bare specifiers rejected at resolve time via `deno_core::resolve_import`), so the `.catch()` in `getOpenTelemetryAPI` never ran and every `withSpan` call through `to-auth-endpoints.ts` and `with-hooks.ts` surfaced an uncaught error. The breaking pattern landed in `#9111` and shipped in v1.6.6. `@opentelemetry/api` itself ships a noop proxy when no SDK is registered, so this is about dynamic-import-probe portability, not OTel runtime support. Unblocks the 1.6 migration for `@convex-dev/better-auth` consumers',
  },
  {
    repo: "better-auth/better-auth",
    number: 9087,
    title: "fire $sessionSignal after session-rotating endpoints",
    detail:
      "add `/change-password` and `/revoke-other-sessions` to the `atomListeners` matcher so `$sessionSignal` fires after session-rotating endpoints. Without this, callers like `useSession()` kept returning stale session data after password changes because the client never re-fetched",
  },
  {
    repo: "better-auth/better-auth",
    number: 9072,
    title: "fix operationId on the password reset callback endpoint",
    detail:
      "incorrect `operationId` in the password reset callback endpoint, plus `forget` to `forgot` cleanup across demo apps and tests",
  },
  {
    repo: "get-convex/better-auth",
    number: 323,
    title:
      "migrate to better-auth 1.6, five runtime breaks fixed in one rebase",
    detail:
      'migrated `@convex-dev/better-auth` to `better-auth` 1.6.9+, fixing five runtime breaks across the 1.6.x line in one rebase. `Where.mode` folding (1.6.0): `CleanedWhere = Required<Where>` forced the new field onto every adapter call, so `adapterWhereValidator` and per-table validators threw `ArgumentValidationError` on bump. Fix accepts `mode` in validators, case-folds `eq`/`ne`/`in`/`not_in`/`contains`/`starts_with`/`ends_with` in `filterByWhere`, and excludes insensitive clauses from `findIndex` and `paginate` fast-paths since Convex indexes are byte-compared. `shouldReturnResponse` flip (1.6.0, commit `8304f65`): `to-auth-endpoints.ts` defaults to a `Response` when context carries a `Request`, so internal endpoint calls from cross-domain hooks returned a `Response` instead of a parsed object, JWT cookies got the literal string `"undefined"`, and `setSessionCookie` crashed. Fix passes `asResponse: false` at all 7 internal call sites with regression tests that pre-set the flags to `true` so dropping the override fails the assertion. `twoFactor.verified` (1.6.2, #8711): new schema column the Convex validator rejected. `parseSetCookieHeader`: deleted the 34-line local copy in `cross-domain/client.ts` that split on `", "` and shattered `Expires=Wed, 21 Oct 2015 07:28:00 GMT` into four garbage cookies, re-exported from `better-auth/cookies`. `./instrumentation` (1.6.6, #9111): peer floor raised to 1.6.9, past 1.6.7 where #9281 routes the dynamic `import("@opentelemetry/api")` to a noop on `browser` and `edge` conditions, fixing Convex V8 isolate\'s synchronous bare-specifier rejection. Shipped in `@convex-dev/better-auth@0.12.0`',
  },
  {
    repo: "get-convex/better-auth",
    number: 218,
    title: "four bugs leaving stale auth state after a session expires",
    detail:
      'four bugs causing stale auth state and incorrect `isAuthenticated` values. (1) `getCookie()` parsed cookies from JSON, which turned `expires` into a string. Comparing `string < new Date()` coerced the Date to a number and the string to `NaN`, and `NaN < anything` is always `false`, so expired cookies were never filtered out. (2) Cookies persisted after `/get-session` returned `null`, so combined with bug 1, stale credentials shipped indefinitely. (3) Sign-out stored `"{}"` in `localCacheName` and `JSON.parse("{}")` returns truthy `{}`, breaking `if (sessionData)` checks. Fix stores `"null"` so `JSON.parse("null")` returns `null`. (4) `isAuthenticated` was `session !== null`, which returned `true` for `{}` (from bug 3) and `undefined` during loading edges. Fix uses `Boolean(session?.session)`',
  },
  {
    repo: "get-convex/better-auth",
    number: 267,
    title: "dedup concurrent fetchAccessToken calls with a ref",
    detail:
      "concurrent `fetchAccessToken` dedup with `useRef`. On page load, `sessionId` transitions from `undefined` to a value, which creates a new `fetchAccessToken` reference and triggers `ConvexProviderWithAuth` to call `setAuth()` again while the first request is still in-flight. React 18 StrictMode doubles this in dev. Each `/convex/token` call hits the DB for session middleware and runs JWT signing, so N concurrent calls meant N redundant round-trips with only one result used. Fix stores the in-flight promise in a `useRef` so concurrent callers share it, with `forceRefreshToken: true` bypassing the guard and `.finally()` clearing the ref after resolution. Closes #219, likely reduces the action count reported in #186",
  },
  {
    repo: "get-convex/better-auth",
    number: 245,
    title: "widen the better-auth peer dep to cover the whole 1.4.x line",
    detail:
      "widened the `better-auth` peer dep from exact `1.4.9` to `>=1.4.9 <1.5.0` after verifying every import path is stable across 1.4.9 through 1.4.18. Explicitly excludes 1.5.0, which moved `createAuthEndpoint` and `createAuthMiddleware` from `better-auth/plugins` to `better-auth/api`, removed the `better-auth/adapters/test` export path, and deleted `runAdapterTest` entirely",
  },
  {
    repo: "get-convex/better-auth",
    number: 278,
    title: "drop the dead react-dom peer dep",
    detail:
      "removed the dead `react-dom` peer dep declaration. Zero imports of `react-dom`, `ReactDOM`, `createRoot`, `hydrateRoot`, `flushSync`, or `createPortal` across all 32 files in `src/`. None of the exports (`/react`, `/nextjs`, `/react-start`) touch it. The declaration was generating peer dep warnings in `bun` and `pnpm` projects that don't use `react-dom`",
  },
  {
    repo: "expo/expo",
    number: 47748,
    title:
      'surface the real `xcodebuild` error when `expo run:ios` fails but the log formatter parsed none, instead of "0 error(s)" and a truncated dump',
    detail:
      "on the `expo run:ios` failure path where `@expo/xcpretty` parsed zero errors, `_assertXcodeBuildResults` dumped the entire raw log, which CI truncates before the real error line, so genuine build failures read as `0 error(s)` with exit 65 and no visible cause (how #47688's `ios-build` failures presented). Pinned two live formatter gaps on the way: a routine `.xcodeproj`-prefixed `ld: warning: ignoring duplicate libraries: '-lc++'` line latches the compile-warning matcher so the parser emits the next complete compile error as a warning, and the anchored matchers never see diagnostics that xcodebuild forwards indented, while stderr never reaches the formatter at all. The fix scans the complete stdout and stderr for `error:` lines on that zero-parsed path, dedupes, prints them directly under the `CommandError` header, and keeps the full log below for context. Verified end to end on a fresh `create-expo-app` project: unpatched, the real error sat at line 15402 of a 15425-line dump, patched it prints at line 69. New tests drive the real `ExpoRunFormatter` against both gaps, written red first. Filed and merged the same day",
  },
  {
    repo: "expo/expo",
    number: 47693,
    title:
      "fix the `expo-dev-menu` macOS build against react-native-macos's older `RCTDevMenu` surface",
    detail:
      "guarded the `RCTDevMenu.devMenuEnabled` and `keyboardShortcutsEnabled` writes added in #47638 with `#if !os(macOS)` so `expo-dev-menu` compiles on macOS again. react-native-macos trails RN core and its `RCTDevMenu` gains those members only in core 0.83, so the writes failed with `value of type 'RCTDevMenu' has no member 'devMenuEnabled'` and broke the `test-suite-macos` CI job. The guard in `openRNDevMenu` covers only the enabled toggle: macOS `RCTDevMenu` still has `show()` with no enabled gate, so the Open RN dev menu button keeps working by calling `show()` directly. iOS and tvOS use RN core and keep the writes. Verified both ways against `react-native-macos@0.81.8`: the bare-expo `ExpoMacOS-macOS` scheme fails without the guard and builds with it, and iOS native unit tests pass unchanged",
  },
  {
    repo: "expo/expo",
    number: 47688,
    title:
      "guard the dev-only `RCTBundleURLProviderAllowPackagerServerAccess` calls so `expo-dev-launcher` compiles in Release again",
    detail:
      "fixed `expo-dev-launcher` Release builds broken by #47638's swizzling removal. The new direct calls to `RCTBundleURLProviderAllowPackagerServerAccess` reference a function React Native declares only under `#if RCT_DEV_MENU | RCT_PACKAGER_LOADING_FUNCTIONALITY`, both 0 in Release, so clang failed with `call to undeclared function` and the `ios-build` job went red on every PR that triggered it. The removed swizzle had been accidentally Release-safe: it resolved `guessPackagerHost` at runtime via `class_getInstanceMethod`, which returns NULL in Release, so it silently no-opped. Wrapped both call sites in the header's exact guard, since plain `RCT_DEV` would still break a `RCT_DEV=1` `RCT_DEV_MENU=0` build. Verified with a standalone clang repro in both configs, the CI-parity bare-expo Release build, native unit tests, and a Debug sim boot exercising dev server discovery. Filed and merged the same afternoon",
  },
  {
    repo: "expo/expo",
    number: 47670,
    title: "fix dead docs data mapping entries, report all failures",
    detail:
      "fixed two dead entries in the docs data generator's package mapping: `expo-ui/jetpack-compose/filterchip` pointed at a file removed when FilterChip merged into `Chip` (#43900), and `expo-speech` pointed at `Speech/Speech.ts`, flattened to `Speech.ts` in the TypeScript 6 bump (#44791). The old runner logged only the first `Promise.all` rejection, so the filterchip error hid the speech one and `expo-speech.json` sat unregenerable from April to July, its content frozen at a February refresh. Switched the runner to `Promise.allSettled` so every failure reports by package name (exit semantics unchanged), added a unit test asserting all 215 mapping entries resolve to existing source files, and shipped the regenerated `expo-speech.json`, which only generates with the fixed mapping",
  },
  {
    repo: "expo/expo",
    number: 47663,
    title:
      "regenerate 32 drifted unversioned API data files so local docs stop rendering stale content",
    detail:
      "regenerated the unversioned docs API data for every package where the committed JSON no longer matched a clean `et generate-docs-api-data` run, 32 files. The last full refresh was the SDK 56 cut-off, then the TypeScript 6 + TypeDoc bump landed a day later without a regen and nothing had been swept since. `expo-cellular.json` still documented `allowsVoipAsync` (removed in #47148), `expo-location.json` was missing the Motion Activity API, and ~25 more files differed only by TypeScript 6 union ordering. Production regenerates this data at build time, but local docs dev rendered stale content and any PR regenerating a single package inherited the whole drift in its diff. Also drops the cellular page intro's VoIP mention, whose API is gone. `expo-speech.json` was left out on purpose, its mapping pointed at a moved source file, fixed in #47670",
  },
  {
    repo: "expo/expo",
    number: 47472,
    title:
      "add `testID` and `accessibilityLabel` to `NativeTabs.Trigger` so native tab items can be matched in end-to-end tests and relabeled for screen readers without the `unstable_nativeProps` escape hatch",
    detail:
      "add `testID` and `accessibilityLabel` props to `NativeTabs.Trigger`. `testID` maps to the tab bar item's `accessibilityIdentifier` on iOS, so XCUITest and Maestro can target tabs, and to the item's view tag on Android. `accessibilityLabel` sets the tab's screen-reader label (`contentDescription` on Android, iOS 26+ on iOS). The native `NativeTabsView` already accepted `tabBarItemTestID` and `tabBarItemAccessibilityLabel`, so this wires the two JS props through `convertTabPropsToOptions`",
  },
  {
    repo: "expo/expo",
    number: 47426,
    title:
      "strokeBorder modifier for dashed and shape-following borders with a full StrokeStyle",
    detail:
      "iOS `strokeBorder` modifier for `@expo/ui` wrapping SwiftUI's `InsettableShape.strokeBorder(_:style:antialiased:)`. Strokes an inset border that follows the view's shape with a full `StrokeStyle` (line width, cap, join, miter limit, dash array, dash phase), so a border can be dashed or dotted and hug rounded corners instead of only a solid rectangle. Takes an optional `color` (omit for the foreground style), `style`, `antialiased`, a `shape` (`rectangle`, `circle`, `capsule`, `ellipse`, `roundedRectangle`, `containerRelativeShape`), and `cornerRadius`. Registers `StrokeBorderModifier` and exports `strokeBorder(params)`",
  },
  {
    repo: "expo/expo",
    number: 47387,
    title:
      "accessibilityAddTraits and accessibilityRemoveTraits modifiers tagging a view's VoiceOver role",
    detail:
      "iOS `accessibilityAddTraits` and `accessibilityRemoveTraits` modifiers for `@expo/ui` wrapping SwiftUI's `accessibilityAddTraits(_:)` and `accessibilityRemoveTraits(_:)`. Tag a view with semantic traits so VoiceOver announces its role (`isButton`, `isHeader`, `isImage`, `isSelected`, `isModal`, `isSummaryElement`, and more) or strip inherited ones. Both take an `AccessibilityTrait[]`, with `isToggle` and `isTabBar` behind iOS 17. Registers `AccessibilityAddTraitsModifier` and `AccessibilityRemoveTraitsModifier` and exports the two factories",
  },
  {
    repo: "expo/expo",
    number: 47269,
    title:
      "redaction modifiers for skeleton loading and privacy-sensitive views",
    detail:
      "iOS redaction modifiers for `@expo/ui`: `redacted`, `unredacted`, `privacySensitive`, and `invalidatableContent`. `redacted('placeholder')` swaps a subtree for skeleton placeholders, the iOS-native loading state. `redacted('privacy')` and `redacted('invalidated')` redact only descendants marked `privacySensitive()` or `invalidatableContent()`, and `unredacted()` exempts a subtree from a redacted ancestor. Reasons are additive through an array, `invalidated` needs iOS 17, the rest work at the package's iOS 16.4 floor. Registers `RedactedModifier`, `UnredactedModifier`, `PrivacySensitiveModifier`, and `InvalidatableContentModifier`. Shipped in `56.0.19` and `57.0.1`",
  },
  {
    repo: "expo/expo",
    number: 46714,
    title:
      "font, dynamicTypeSize, and resizable were dropped on Image, SF Symbols now scale with Dynamic Type",
    detail:
      "`font`, `dynamicTypeSize`, and `resizable` modifiers were silently dropped on the `Image` component. `ImageView` pinned an internal `.font(.system(size: props.size ?? 24))` that beat any `font` modifier, since SwiftUI resolves `.font` nearest-to-leaf, and `resizable` got lost because the wrapper runs the view-modifier pipeline, not the image pipeline. Fix routes `size` and `color` through `font` and `foregroundStyle` modifiers from JS (a supplied `font` always wins), drops the native pins, and runs `applyImageModifiers` on the concrete `Image` so `resizable` applies to SF Symbols too. Symbols now scale with Dynamic Type via `font({ textStyle })`. Shipped in `56.0.17`",
  },
  {
    repo: "expo/expo",
    number: 45872,
    title:
      "Host modifiers were a silent no-op on iOS, one Swift field restored the whole set",
    detail:
      "`<Host modifiers={...}>` was a silent no-op on iOS. `HostProps` extended `CommonViewModifierProps` and `Host/index.tsx` already forwarded `modifiers` to the native view, but the Swift `HostViewProps` never declared the field, so every typechecked modifier on `Host` did nothing. Adding the field plus one `.applyModifiers(...)` chain in `HostView.body` restored the entire registered modifier surface to `Host` in one shot. Shipped in `56.0.10`",
  },
  {
    repo: "expo/expo",
    number: 44652,
    title:
      "scrollPosition and id modifiers binding a ScrollView's leading target to JS",
    detail:
      "`scrollPosition` and `id` modifiers (iOS 17+) binding a `ScrollView`'s leading target to JS via `useNativeState` and the worklet `.value` write path. Reading `state.value` returns the id of the leading target; writing scrolls to the matching view. The optional `onChange` callback fires on the JS thread when the leading target changes. `id(string)` marks views as scroll targets and works on `ScrollView`, `LazyVStack`, and `LazyHStack`. Built on the worklet infrastructure from #44214 and #44215. Deferred from #43955 per [@intergalacticspacehighway](https://github.com/intergalacticspacehighway)",
  },
  {
    repo: "expo/expo",
    number: 45403,
    title:
      "resolve workspace:* peer deps for scoped packages whose dir name differs",
    detail:
      '`getPackageByName` did a `packages/<name>/package.json` lookup, which misses for scoped packages whose dir name differs from the package name (`@expo/ui` lives at `packages/expo-ui/`, `@expo/app-integrity` at `packages/expo-app-integrity/`). On a miss, `Workspace.getInfoAsync` recorded empty `workspacePeerDependencies` for those packages, so `updateWorkspaceProjects` never rewrote `workspace:*` to the canary version, and the published canary tarballs shipped `peerDependencies.expo: "workspace:*"`. `bun add @expo/ui@canary` errored with `Workspace dependency "expo" not found` and `npm install @expo/ui@canary` errored with `EUNSUPPORTEDPROTOCOL`. Fix keeps the existing path-based fast path and falls back to scanning `cachedPackages` by `name` field when the path lookup misses. Same root cause as #44412, different call site',
  },
  {
    repo: "expo/expo",
    number: 46007,
    title: "font textStyle for iOS Dynamic Type, all 11 Font.TextStyle cases",
    detail:
      "iOS `font({ textStyle })` for Dynamic Type, wiring `textStyle` through to SwiftUI's `Font.system(_:design:)` and `Font.custom(_:size:relativeTo:)` so `@expo/ui` text scales with the user's preferred content size, the SwiftUI-native path for the Larger Text Accessibility Nutrition Label. All 11 `Font.TextStyle` cases. Shipped in `56.0.10`",
  },
  {
    repo: "expo/expo",
    number: 46540,
    title:
      "dynamicTypeSize modifier to clamp how far Dynamic Type scales, a single size or { min, max }",
    detail:
      "iOS `dynamicTypeSize` modifier to set or clamp Dynamic Type within a view. A single size pins it, `{ min, max }` bounds the range with either end optional. Caps how far text grows at the largest accessibility sizes for layout safety while still honoring Dynamic Type, and cascades from `<Host>` to every descendant. Bounds the `textStyle` scaling from #46007. Shipped in `56.0.16`",
  },
  {
    repo: "expo/expo",
    number: 43958,
    title: "PersistentFileLog read-race fix that flaked expo-updates CI",
    detail:
      "`PersistentFileLog.readEntries` race condition where reads bypassed the `serialQueue` that guards every write. Caused flaky `UpdatesLogReaderTests.PurgeOldLogs` failures in `expo-updates` CI when a read executed before a queued write flushed to disk and returned `entries1.count == 1` instead of `2`. Fix wraps `readEntries` in `serialQueue.sync` so reads wait for pending writes. No deadlock risk because all callers are external to the queue",
  },
  {
    repo: "expo/expo",
    number: 43955,
    title: "scrollTargetBehavior and scrollTargetLayout for snap paging",
    detail:
      "`scrollTargetBehavior` and `scrollTargetLayout` modifiers (iOS 17+) for paging and view-aligned scroll snapping in `@expo/ui` `ScrollView`. Brings SwiftUI's snap-paging API to React Native through `@expo/ui` modifier composition with `#available` guards for iOS 17, tvOS 17, and macOS 14",
  },
  {
    repo: "expo/expo",
    number: 46509,
    title:
      "font on concatenated Text runs, restoring Dynamic Type scaling and weight",
    detail:
      "the `font` modifier dropped Dynamic Type scaling (`relativeTo`) and `weight` on concatenated `<Text>` runs, so `font({ textStyle, weight })` scaled standalone but lost both once nested in another `<Text>`. Made `FontModifier.resolveFont()` non-private and routed the concatenation path through it so both resolve the identical `Font`. Completes #46007. Shipped in `56.0.16`",
  },
  {
    repo: "expo/expo",
    number: 44548,
    title:
      "textContentType modifier wiring text fields into iOS keychain autofill",
    detail:
      "`textContentType` modifier wrapping SwiftUI's `textContentType(_:)` with all 45 `UITextContentType` values. Wires `@expo/ui` `TextField` and `SecureField` into iOS keychain autofill for passwords, emails, addresses, credit cards, and OTP codes. Before this, `@expo/ui` text fields could not participate in iOS autofill at all. Includes `#available` guards for the iOS 17+ values (`creditCardExpiration`, `birthdate`, etc.) and iOS 17.4+ values (`cellularEID`, `cellularIMEI`)",
  },
  {
    repo: "expo/expo",
    number: 45700,
    title: "SwiftUI Alert component for @expo/ui",
    detail:
      "`Alert` component for `@expo/ui` wrapping SwiftUI's iOS 15 `.alert(_:isPresented:actions:message:)`, with `Alert.Trigger`, `Alert.Actions`, and optional `Alert.Message` slots. Mirrors `ConfirmationDialog`'s shape so `isPresented` bindings and `Button` actions compose the same way. Fills in the previously-stubbed iOS half. Shipped in `56.0.8`",
  },
  {
    repo: "expo/expo",
    number: 43914,
    title: "defaultScrollAnchor so chat UIs drop the scaleEffect(y: -1) flip",
    detail:
      "`defaultScrollAnchor` modifier (iOS 17+) for controlling where a `ScrollView` or `List` starts. Removes the need for `scaleEffect(y: -1)` flips, reversed data arrays, and inverted scroll indicator hacks that chat UIs used to need. Reuses the existing `UnitPointOptions` enum and falls back to a no-op on iOS < 17",
  },
  {
    repo: "expo/expo",
    number: 43923,
    title: "defaultScrollAnchorForRole for per-role scroll anchors",
    detail:
      "`defaultScrollAnchorForRole` modifier (iOS 18+) wrapping the two-parameter `defaultScrollAnchor(_:for:)` overload. Lets you set independent scroll anchors per `ScrollAnchorRole` (`initialOffset`, `sizeChanges`, `alignment`), so a chat view can anchor to bottom globally but start at top via a per-role override. Also added `null` support to match Apple's `UnitPoint?` signature and the missing `@platform macos 14.0+` JSDoc to the single-arg version from #43914",
  },
  {
    repo: "expo/expo",
    number: 46774,
    title:
      "imageScale modifier so SF Symbols scale small, medium, or large relative to text",
    detail:
      "iOS `imageScale` modifier wrapping SwiftUI's `imageScale(_:)`. Scales SF Symbols relative to the surrounding text with the standard `small`, `medium`, and `large` sizes, and cascades from a container to descendant images like `controlSize`. Rounds out the symbol-sizing axis with `font({ textStyle })` from #46007 and `dynamicTypeSize` from #46540, and pairs with #46714, which made those modifiers apply to `Image` at all. Registers `ImageScaleModifier` and exports `imageScale(scale)`. Shipped in `56.0.17`",
  },
  {
    repo: "expo/expo",
    number: 46661,
    title:
      "accessibilityInputLabels modifier setting the phrases Voice Control listens for",
    detail:
      'iOS `accessibilityInputLabels` modifier wrapping SwiftUI\'s `accessibilityInputLabels(_:)`. Sets the alternative spoken phrases Voice Control listens for, so a control with a terse visible label like "End" answers to "Hang up" or "End call". The JS factory takes `string[]` and maps to `[Text]` natively. Registers `AccessibilityInputLabelsModifier` and exports `accessibilityInputLabels(labels)`. Shipped in `56.0.17`',
  },
  {
    repo: "expo/expo",
    number: 43158,
    title:
      "ShapeType enum fix unblocking capsule and ellipse in clipShape and mask",
    detail:
      "`ClipShapeModifier` and `MaskModifier` were silently rendering `Rectangle` for any shape other than `circle` or `roundedRectangle` because they used a raw `String` field instead of the `ShapeType` enum from #40748. Every other shape modifier (`BackgroundModifier`, `ContainerShapeModifier`, `ContentShapeModifier`, `GlassEffectModifier`) already used `ShapeType`. Switched both to exhaustive `ShapeType` switching with no `default` fallthrough, added `roundedCornerStyle` and `cornerSize` fields, and unblocked `capsule` and `ellipse` in `clipShape()` and `mask()`",
  },
  {
    repo: "expo/expo",
    number: 44547,
    title: "textInputAutocapitalization without forcing an ASCII keyboard",
    detail:
      '`textInputAutocapitalization` modifier (iOS 15+) with all four `TextInputAutocapitalization` modes: `never`, `words`, `sentences`, `characters`. Before this, the only way to disable auto-capitalization on `@expo/ui` `TextField` was forcing `keyboardType="ascii-capable"`, which changed the keyboard layout entirely. Username and email fields can now behave correctly without that workaround',
  },
  {
    repo: "expo/expo",
    number: 46556,
    title:
      "accessibilityIdentifier modifier setting a stable id for XCUITest to target a view",
    detail:
      "iOS `accessibilityIdentifier` modifier wrapping SwiftUI's `accessibilityIdentifier(_:)`. Sets a stable, machine-readable id that UI-testing tools like XCUITest read to locate a view, distinct from `accessibilityLabel` in that it's not user-visible and exists purely for test targeting. Registers `AccessibilityIdentifierModifier` and exports `accessibilityIdentifier(id)`. Shipped in `56.0.16`",
  },
  {
    repo: "expo/expo",
    number: 46579,
    title:
      "accessibilityHidden modifier hiding decorative views from VoiceOver",
    detail:
      "iOS `accessibilityHidden` modifier wrapping SwiftUI's `accessibilityHidden(_:)`, hiding decorative views (hero icons, imagery already described by adjacent text) from VoiceOver traversal. Registers `AccessibilityHiddenModifier` and exports `accessibilityHidden(hidden?)`, defaulting to `true`. Shipped in `56.0.16`",
  },
  {
    repo: "expo/expo",
    number: 47156,
    title:
      "accessibilityElement modifier grouping a subtree into one VoiceOver element",
    detail:
      "iOS `accessibilityElement` modifier wrapping SwiftUI's `accessibilityElement(children:)`. Collapses a view's subtree into one accessibility element, so a `star.fill` symbol next to a \"4.8 out of 5 stars\" label reads as a single VoiceOver element instead of stopping on each. Takes `ignore`, `combine`, or `contain` and defaults to `ignore`, matching SwiftUI. iOS 13+ so no `#available` guard. Registers `AccessibilityElementModifier` and exports `accessibilityElement(children?)`",
  },
  {
    repo: "expo/expo",
    number: 43228,
    title: "per-axis scaleEffect accepting { x, y }",
    detail:
      "per-axis `scaleEffect` accepting `{ x, y }` in addition to `number`. Backwards-compatible: `scaleEffect(0.5)` still normalizes to `{ x: 0.5, y: 0.5 }` in the TS layer before hitting native",
  },
  {
    repo: "expo/expo",
    number: 45782,
    title: "make five auto-firing scheduled workflows fork-safe",
    detail:
      "made five auto-firing scheduled workflows fork-safe. Swapped `../expo/` (breaks on forks named anything but `expo`) for `${{ github.workspace }}` in `fingerprint` and both `development-client-e2e` matrices, and gated `validate-npm-owners`, `check-issues-nightly`, and `publish-canaries` on the repo check. Dropped failing checks and 120-minute fork CI burns",
  },
  {
    repo: "expo/expo",
    number: 46050,
    title:
      "fork-safety CI sweep finale, gating 15 more workflows on the upstream repo",
    detail:
      "closed the fork-safety sweep. Gated 15 more workflows on `github.repository == 'expo/expo'` so fork CI stops red-checking nightly RN and test-suite jobs, hourly issue-maintenance crons, the GCP publish path in `ios-prebuild-external-xcframeworks`, and Slack-notify steps that reference org-only webhooks. Covers `test-react-native-nightly`, `test-suite-nightly`, `lock`, `issue-stale`, `cli`, `create-expo-app`, `create-expo-module`, `fingerprint`, `sdk`, `ios-static-frameworks`, `bare-diffs`, `native-component-list`, `test-suite`, `test-suite-macos`, and drops a redundant step-level repo check in `development-client-latest-e2e`. Finishes what #45782 and #45859 started",
  },
  {
    repo: "expo/expo",
    number: 45859,
    title: "skip 13 secret-gated workflows on forks",
    detail:
      "gated `pull_request_target`, `issues`, and label-event workflows on `github.repository == 'expo/expo'` so fork PRs stop red-checking on secret-gated jobs that can't run. Covers 13 workflows including `code-review`, `commentator`, `docs-pr`, `issue-triage`, and `sync-template`. Sibling to #45782",
  },
  {
    repo: "withastro/compiler-rs",
    number: 25,
    title:
      "switch linux-gnu builds to --use-napi-cross, dropping the glibc floor to 2.17",
    detail:
      "real fix for the `@astrojs/compiler-rs` `GLIBC_2.35` issue. [#22](https://github.com/withastro/compiler-rs/pull/22) added `-x` to the linux-gnu builds hoping zigbuild would pin glibc, but zigbuild without an explicit suffix falls back to zig's per-arch baseline (`GLIBC_2.35` on x86_64, `GLIBC_2.30` on aarch64 for zig 0.15), so the shipped 0.1.7 binary still couldn't load on Vercel (glibc 2.34), Amazon Linux 2023, AWS Lambda, RHEL/CentOS 7, or Debian 10. Switched both gnu targets to `--use-napi-cross`, which downloads `@napi-rs/cross-toolchain` with a sysroot pinned to glibc 2.17. Matches the pattern used by `oxc`, `@swc/core`, `@napi-rs/canvas`, `lightningcss`, and the official `@napi-rs/package-template`. Verified on a fork CI run plus a Vercel preview deploy with `experimental.rustCompiler: true`, both `objdump -T` showing `GLIBC_2.16` max on x64 and `GLIBC_2.17` on arm64. Shipped in `@astrojs/compiler-rs@0.1.8`",
  },
  {
    repo: "withastro/compiler-rs",
    number: 22,
    title: "first glibc compat attempt, superseded by #25",
    detail:
      "first-attempt glibc compat fix, added `-x` to `x86_64-unknown-linux-gnu`. Turned out to be insufficient, superseded by #25",
  },
  {
    repo: "napi-rs/napi-rs",
    number: 3189,
    title:
      "respect --cross-compile when host matches target, fixing glibc breaks on Vercel and Lambda",
    detail:
      "cross-compile regression in the v3 CLI rewrite. When `--cross-compile` / `-x` was passed for a linux or darwin target, `pickBinary()` in `cli/src/api/build.ts` skipped `cargo-zigbuild` if host platform, arch, and abi matched target, logged a warning, then silently fell through to `cargo build`. The whole point of `--cross-compile` on a native build is to pin a lower glibc via zig's linker. Without it, building `x86_64-unknown-linux-gnu` on `ubuntu-latest` (glibc 2.39) produced binaries incompatible with glibc < 2.35 systems like Amazon Linux 2023 (glibc 2.34) and Vercel's build container. v2 had this fix in #1432 (resolving #1430) but it wasn't carried over during the v3 rewrite in #1492. Fix removes the platform-match conditions in the `else` branch of `pickBinary()` so `--cross-compile` always uses `cargo-zigbuild` for non-Windows targets",
  },
  {
    repo: "shadcn-ui/ui",
    number: 10396,
    title: "official TanStack Start dark mode guide, replacing three stale PRs",
    detail:
      "added the TanStack Start dark mode guide to the official shadcn docs, the fifth framework-specific guide after Next.js, Vite, Astro, and Remix. The canonical pattern was scattered across Discord threads and three stale PRs with different tradeoffs: [#7173](https://github.com/shadcn-ui/ui/pull/7173) (cookies, no system mode), [#7490](https://github.com/shadcn-ui/ui/pull/7490) (cookies, conditional `ScriptOnce`), and [#9096](https://github.com/shadcn-ui/ui/pull/9096) (wrapped `tanstack-theme-kit` as a runtime dep). Pattern: `ScriptOnce` from `@tanstack/react-router` for the pre-hydration inline script, a React context for post-hydration state, `suppressHydrationWarning` on `<html>`, `document.documentElement.style.colorScheme` so native UI respects the theme, and a `prefers-color-scheme` listener for system mode. In review, [@shadcn](https://github.com/shadcn) refactored the inline script string into a `getThemeScript(storageKey, defaultTheme)` function so custom provider props reach the pre-hydration pass, extracted the class-swap into an `applyTheme` helper, and added a `mounted` gate so the inline script's work isn't overwritten on first mount",
  },
  {
    repo: "shadcn-ui/ui",
    number: 9484,
    title: "strip the raw <ComponentsList> tag from copy-to-markdown output",
    detail:
      "raw `<ComponentsList />` tag leaking into copy-to-markdown output on component pages",
  },
  {
    repo: "shadcn-ui/ui",
    number: 10369,
    title:
      "notFoundComponent on the Start templates to silence the Router warning",
    detail:
      '`notFoundComponent` on the Start root route in the `start-app` and `start-monorepo` templates. Silences the TanStack Router warning that fires on first load from phantom requests hitting `/favicon.ico` and Chrome DevTools\' `/.well-known/appspecific/com.chrome.devtools.json` when neither `notFoundComponent` nor `defaultNotFoundComponent` is configured. JSX shape matches the existing 404 `ErrorBoundary` pattern from `templates/react-router-app` and `templates/react-router-monorepo` (same `container mx-auto p-4 pt-16` wrapper, same "404" heading and "The requested page could not be found." copy) so the ten-template suite stays consistent',
  },
  {
    repo: "shadcn-ui/ui",
    number: 10337,
    title: "fix llms.txt 404s and backfill missing routes",
    detail:
      "fixed `llms.txt` 404s and backfilled missing routes so LLM crawlers can index the full docs site",
  },
  {
    repo: "shadcn-ui/ui",
    number: 9331,
    title:
      "register the @ramonclaudio-coderabbit registry in the official directory",
    detail:
      "registered the `@ramonclaudio-coderabbit` shadcn registry in the official open source directory after #8892 asked for it. Adds entries to `apps/v4/public/r/registries.json` and `apps/v4/registry/directory.json` so the registry is discoverable through the shadcn CLI. The registry itself ships a framework-agnostic CodeRabbit API client, pluggable storage adapters (LocalStorage, Convex, Supabase, PostgreSQL, MySQL), and React components for generating developer activity reports",
  },
  {
    repo: "rorkai/App-Store-Connect-CLI",
    number: 784,
    title: "Mac App Store screenshot support for the asc CLI",
    detail:
      "Mac App Store screenshot support for the `asc` CLI. New `--provider macos` grabs the frontmost window of a running macOS app by bundle ID using `screencapture -l <windowID>`, where the window ID comes from a Swift one-liner piped to `swift -` via `CGWindowListCopyWindowInfo`, without cgo or extra binaries. New `--device mac` renders to the 2880x1800 `APP_DESKTOP` canvas without a device bezel, with optional title, subtitle, and background color overlays. Also fixed `ASC_TIMEOUT` being silently ignored for `screenshots capture` and `screenshots frame`, both now use `ContextWithTimeout`",
  },
  {
    repo: "fuma-nama/fumadocs",
    number: 2092,
    title:
      "fix the TanStack Start template, four config and hydration issues at once",
    detail:
      "fixed the TanStack Start template in `create-fumadocs-app`. Wired the `vite-react` plugin with the required `customViteReactPlugin: true` flag, configured a custom `NotFound` component for TanStack Router, and bumped deps to current versions. Resolved four issues at once: TanStack Start `vite-react` plugin warning, missing custom 404 component warning, module resolution errors during client-side navigation, and React hydration errors caused by `useMemo` null references that flashed errors mid-route-change",
  },
  {
    repo: "fuma-nama/fumadocs",
    number: 2095,
    title: "prettier fix that unblocked the create-fumadocs-app release",
    detail:
      "prettier formatting fix that unblocked the changesets release PR #2093 for `create-fumadocs-app@15.7.0`. The release PR was stuck on a formatting check, so I ran the formatter and shipped the diff so the release could go out",
  },
  {
    repo: "oven-sh/bun",
    number: 21855,
    title: "typed decompress option for fetch, no more @ts-ignore",
    detail:
      "added the `decompress` property to the `BunFetchRequestInit` interface with JSDoc documentation. The option already worked at runtime in Bun's `fetch()`, but TypeScript users had to `@ts-ignore` it on every call to disable response decompression. Now it's a first-class typed option, no escape hatch required",
  },
  {
    repo: "facebook/hermes",
    number: 2047,
    title: "fix the armv7 CI job for forks not named hermes",
    detail:
      "swapped the hardcoded `hermes` source dir for `${{ github.event.repository.name }}` in the `test-linux-armv7` job's `cmake -S` and `test_runner.py` paths. The job runs `actions/checkout@v1` without `path:` (v4 breaks in the arm32 container), so the checkout dir takes the repo name and the job failed on any fork not named `hermes`. Unchanged upstream, where the repo is named `hermes`. Merged via Meta's internal import",
  },
  {
    repo: "TanStack/db",
    number: 17,
    title: "fix the stale example todo app link in the README",
    detail:
      "corrected the stale README link to the example todo app, repointing it at `examples/react/todo`. Tiny fix, but it was the first thing I clicked when I landed on the repo and it 404'd. Was PR #17 in the repo, early days",
  },
];

export const open: Contribution[] = [
  {
    repo: "facebook/hermes",
    number: 2045,
    title:
      "cherry-pick the object-literal accessor home-object fix onto the stable Hermes branch RN 0.85 ships, so `super.x` in a getter or setter stops SIGSEGV'ing `hermesc`. The direct source fix that replaced the `babel-preset` workaround",
  },
  {
    repo: "facebook/hermes",
    number: 2046,
    title:
      "cherry-pick the class-in-`finally` variable-caching fix so a `class` declared in a `finally` block stops miscompiling. Same Hermes V1 root cause",
  },
  {
    repo: "react/react-native",
    number: 56912,
    title:
      "set `always_out_of_date` on the `hermes-engine` podspec's Replace Hermes phase to silence the Xcode clean-build warning",
  },
  {
    repo: "oven-sh/bun",
    number: 30855,
    title:
      "drop the order-dependent peer-dep early match so `bun.lock` stops varying run to run, and fix `bun add X@version` being ignored when `X` is a same-name peer dep",
  },
  {
    repo: "oven-sh/bun",
    number: 27086,
    title: "invalid YAML in the `update-root-certs` workflow `labels` field",
  },
  {
    repo: "better-auth/better-auth",
    number: 9345,
    title:
      "preserve the current session on `change-password` when `revokeOtherSessions` is set",
  },
  {
    repo: "shadcn-ui/ui",
    number: 10364,
    title:
      "strip control characters from `prompts` text input so pasted hidden bytes don't break the CLI",
  },
  {
    repo: "expo/expo",
    number: 47622,
    title:
      "set `always_out_of_date` on the `EXUpdates` podspec's Generate updates resources phase to silence the Xcode every-build warning",
  },
  {
    repo: "expo/expo",
    number: 47691,
    title:
      "exit 1 when docs API data generation fails and run the `expotools` test suite in CI, so dead mapping entries stop shipping silently",
  },
  {
    repo: "react/react-native",
    number: 57517,
    title:
      "declare `RCTBundleURLProviderAllowPackagerServerAccess` unconditionally so the dev-only API stops vanishing in Release and breaking out-of-tree callers",
  },
  {
    repo: "react/react-native",
    number: 57518,
    title:
      "import `react/bridging/ArrayBuffer.h` in the TurboModule ArrayBuffer test so `yarn test-ios` compiles on OSS main again",
  },
];

export const prUrl = (c: Contribution) =>
  `https://github.com/${c.repo}/pull/${c.number}`;

export const repoUrl = (repo: string) =>
  `https://github.com/${repo}/pulls?q=is:pr+author:ramonclaudio`;

export function groupByRepo(list: Contribution[]) {
  const order: string[] = [];
  const groups = new Map<string, Contribution[]>();
  for (const c of list) {
    if (!groups.has(c.repo)) {
      groups.set(c.repo, []);
      order.push(c.repo);
    }
    groups.get(c.repo)!.push(c);
  }
  return order.map(repo => ({ repo, items: groups.get(repo)! }));
}

const distinctRepos = (list: Contribution[]) =>
  new Set(list.map(c => c.repo)).size;

export const stats = {
  merged: merged.length,
  mergedRepos: distinctRepos(merged),
  expo: merged.filter(c => c.repo === "expo/expo").length,
  open: open.length,
  openRepos: distinctRepos(open),
  patches: patchesCount,
};
