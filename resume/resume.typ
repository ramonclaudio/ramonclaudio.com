#set document(title: "Ramon Claudio · Resume", author: "Ramon Claudio")
#set page(
  paper: "us-letter",
  margin: (x: 0.55in, y: 0.4in),
)
#set text(
  font: ("Helvetica Neue", "Helvetica", "Arial"),
  size: 9.25pt,
  fill: rgb("#1a1a1a"),
)
#set par(leading: 0.40em, justify: false)
#show link: it => text(fill: rgb("#1a1a1a"))[#it]
#set list(spacing: 0.25em)

#let section(title) = {
  v(0.2em)
  text(weight: "semibold", size: 7.5pt, tracking: 0.18em, fill: rgb("#555"))[#upper(title)]
  v(-0.4em)
  line(length: 100%, stroke: 0.5pt + rgb("#bbb"))
  v(-0.1em)
}

#let role(title, org, dates, location) = {
  grid(
    columns: (1fr, auto),
    align: (left, right),
    [#text(weight: "semibold")[#title] · #text(fill: rgb("#444"))[#org]],
    text(fill: rgb("#666"), size: 9pt)[#dates · #location],
  )
  v(-0.3em)
}

#let prlabel(t) = text(font: ("Menlo", "Monaco", "Courier"), size: 8.8pt, weight: "semibold", fill: rgb("#222"))[#t]

// Header
#grid(
  columns: (1fr, auto),
  align: (left + bottom, right + bottom),
  [
    #text(size: 24pt, weight: "bold", tracking: -0.01em)[Ramon Claudio]
    #v(-0.3em)
    #text(size: 10.5pt, fill: rgb("#555"))[Product Engineer · Brooklyn, NY]
  ],
  text(size: 9pt, fill: rgb("#555"))[
    #link("https://ramonclaudio.com")[ramonclaudio.com] \
    #link("https://github.com/ramonclaudio")[github.com/ramonclaudio] \
    #link("mailto:hello@ramonclaudio.com")[hello\@ramonclaudio.com]
  ],
)

#v(0.4em)
#line(length: 100%, stroke: 1pt + rgb("#1a1a1a"))
#v(0.3em)

// Summary
Product engineer in New York. Freelancing solo since 2013. Give me a real bug with the time to dig and I'll ship the fix. 55 PRs merged upstream to Expo, Convex, Bun, shadcn/ui, and others, every one came from hitting a wall in my own apps and chasing it down.

#section[Experience]

#role[Product Engineer][Independent][2013 to Present][Brooklyn, NY]
- 55 PRs merged upstream across 11 repos: #link("https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[expo/expo] (33), #link("https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[shadcn-ui/ui] (5), #link("https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[get-convex/better-auth] (5), #link("https://github.com/better-auth/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[better-auth] (3), #link("https://github.com/fuma-nama/fumadocs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[fumadocs] (2), #link("https://github.com/withastro/compiler-rs/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[withastro/compiler-rs] (2), plus #link("https://github.com/oven-sh/bun/pull/21855")[bun], #link("https://github.com/TanStack/db/pull/17")[TanStack/db], #link("https://github.com/napi-rs/napi-rs/pull/3189")[napi-rs], App-Store-Connect-CLI, and #link("https://github.com/facebook/hermes/pull/2047")[hermes]. 11 more open across 6 repos including 2 source fixes to facebook/hermes (object-accessor home object, class-in-finally var caching), 2 in oven-sh/bun (CI YAML fix, peer-dep lockfile determinism), and the hermes-engine podspec in react/react-native.
- Build and maintain #link("https://www.convex.dev/components/ramonclaudio-convex-revenuecat")[convex-revenuecat] (7,600+ npm downloads, listed on the Convex Components Directory), #link("https://www.npmjs.com/package/create-tanstack-cn")[tanstack-cn] (CLI scaffolder, \~1,050 downloads), #link("https://www.npmjs.com/package/create-claude")[create-claude] (1,640+ downloads), and 7 other shipped npm packages, 12,000+ downloads across all of them.
- Maintain #link("https://github.com/ramonclaudio/patches")[ramonclaudio/patches] (60 patches for Bun, npm, pnpm, and Yarn) so my apps and other users ship the fix while upstream PRs are in review.
- 10,800+ GitHub contributions since Dec 2023 across 52 public repos (384 stars earned).
- 2018 to 2021 at This Is Not Art: built and maintained a custom Shopify storefront (Liquid) with anti-bot protections (velocity detection, duplicate-order blocking, URL gating) years before Shopify shipped native mitigation. Built internal tools: AR sculpture preview app, Instagram head-tracking game, inventory management, custom event registration with timeslot booking.
- 2013 to 2017 at Software Automation Services: designed and operated automation and monitoring infrastructure for the e-commerce sector, with hands-on application security research and API reverse-engineering. Shipped Python and JavaScript tooling, Chrome extensions, and related web services.

#v(0.15em)
#text(weight: "semibold", size: 9pt)[Selected merged PRs]
- #link("https://github.com/better-auth/better-auth/pull/9281")[#prlabel[better-auth/better-auth#9281]]: ported `./instrumentation` to conditional exports after Convex's V8 isolate threw synchronously from `import()`. Verified by reading `convex-backend`'s Rust isolate.
- #link("https://github.com/get-convex/better-auth/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[#prlabel[get-convex/better-auth]]: 5 merged PRs including #link("https://github.com/get-convex/better-auth/pull/323")[\#323] (breaking migration to better-auth 1.6, five runtime breaks in one rebase), #link("https://github.com/get-convex/better-auth/pull/218")[\#218] (stale credentials after session expiry), and #link("https://github.com/get-convex/better-auth/pull/267")[\#267] (`fetchAccessToken` deduplication).
- #link("https://github.com/expo/expo/pull/46714")[#prlabel[expo/expo#46714]]: an internal SwiftUI font pin silently dropped `font`, `dynamicTypeSize`, and `resizable` on `@expo/ui`'s `Image`. Rerouted through the modifier pipeline so SF Symbols scale with Dynamic Type.
- #link("https://github.com/withastro/compiler-rs/pull/25")[#prlabel[withastro/compiler-rs#25]] + #link("https://github.com/napi-rs/napi-rs/pull/3189")[#prlabel[napi-rs#3189]]: root-caused the glibc incompatibility breaking Astro deploys on Vercel and Amazon Linux 2023: a zigbuild baseline in Astro's Rust compiler CI and a silent `--cross-compile` fallthrough in `@napi-rs/cli`. Shipped in `@astrojs/compiler-rs@0.1.8`.
- #link("https://github.com/expo/expo/pull/45872")[#prlabel[expo/expo#45872]]: `<Host modifiers={...}>` was a silent no-op on iOS: Swift never declared the field the TS side forwarded. One field plus one `.applyModifiers` chain restored the whole modifier surface.
- #link("https://github.com/expo/expo/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[#prlabel[expo/expo \@expo/ui SwiftUI]]: the rest of the surface: the SwiftUI `Alert` component, worklet-backed `scrollPosition` bindings, scroll anchors and snap paging, `clipShape`/`mask`, per-axis `scaleEffect`, `textContentType`, `textInputAutocapitalization`, Dynamic Type `font`, and the accessibility modifiers, plus the canary packaging fix and a fork-safety CI sweep.
- #link("https://github.com/shadcn-ui/ui/pulls?q=is%3Apr+author%3Aramonclaudio+is%3Amerged")[#prlabel[shadcn-ui/ui]]: 5 merged PRs including #link("https://github.com/shadcn-ui/ui/pull/10396")[\#10396] (TanStack Start dark mode guide, replacing 4 prior attempts), #link("https://github.com/shadcn-ui/ui/pull/9484")[\#9484] (ComponentsList Copy-Page fix), and #link("https://github.com/shadcn-ui/ui/pull/10337")[\#10337] (llms.txt audit of 97 URLs).

#section[Selected Projects]
- *#link("https://github.com/ramonclaudio/convex-revenuecat")[convex-revenuecat]*: Convex component mirroring RevenueCat subscription state. Webhook and REST sync with lifecycle hooks for entitlement transitions. \~7,600 npm downloads, listed on the Convex Components Directory.
- *#link("https://github.com/ramonclaudio/vexpo")[vexpo]*: Expo SDK 56 + Convex + Better Auth + Resend starter paired with a CLI that runs the full 0-to-1. `create-vexpo` scaffolds the template, then `vexpo full` provisions Convex, Apple Developer / ASC, EAS, and Resend end-to-end: account auth, secrets, env mirroring, Sign In With Apple JWT signing with 90-day auto-rotation, EAS workflows, and more.
- *#link("https://github.com/ramonclaudio/tanvex")[tanvex]*: TanStack Start + Convex + Better Auth + Resend SaaS starter. SSR auth, email + OTP, rate-limited HTTP API, avatar uploads. Live demo at #link("https://tanvex-demo.vercel.app")[tanvex-demo.vercel.app].
- *dreamseeker*: goal-achievement app, RevenueCat Shipyard Hackathon 2026 submission. Expo SDK 56 canary + Convex + Better Auth + RevenueCat. Row-level security, rate-limited endpoints, input validation on every mutation.
- *#link("https://github.com/ramonclaudio/uniwind-ui")[uniwind-ui]*: shadcn/ui for React Native. Copy-and-paste components built on Uniwind, iOS + Android + Web from one codebase. Live demo at #link("https://uniwind-ui.vercel.app")[uniwind-ui.vercel.app].

#section[Skills]
TypeScript, Node, Bun, React, React Native, Postgres, Redis, Python.

#section[Education]
*B.S. Computer Science*, Long Island University, 2016
