---
layout: ../layouts/AboutLayout.astro
title: "About"
description: "Ray, developer tools engineer in NYC, 13 years shipping software. CLIs and build tooling, Expo, Convex, plus 63 merged PRs upstream and a public patches repo."
---

I've been building out of New York since 2013. Started by reverse engineering APIs and scraping datasets with Python, figuring out how things worked by poking at them from the outside. I still debug the same way.

I've been collecting art since 2015. Got to work with a lot of artists I admired along the way and ended up with a collection I'm proud of. By 2021 the art world had pulled me back into building. I started solving problems I was personally running into, and the AI wave hit right around then. Been shipping open source ever since.

That era pulled me from Python to TypeScript full-time. Claude Code and Codex are part of how I work day-to-day, Zed for the editor and Ghostty for the terminal. Most of the work is TypeScript, and most of that is developer tools: CLIs, scaffolders, a Tauri menubar GitHub dashboard. Plus Expo mobile apps and Convex components. Just shipped [seetree](https://github.com/ramonclaudio/seetree), written in Zig, and I'm pulling together a big Bun monorepo with a bunch of apps in it. If I do something twice I write a script. Every tool I build goes public, 53 and counting.

When I hit a bug in a dep, I don't just fix it locally. I open the upstream PR and drop a patch in [ramonclaudio/patches](https://github.com/ramonclaudio/patches) so my projects, and anyone else hitting the same bug, can ship without waiting for the merge to land. 70 patches across Bun, npm, pnpm, and Yarn. When the release lands, I bump the dep and delete the patch. A lot of those are tooling fixes: a lockfile that came out different every run in Bun's installer, broken CI config, Xcode build warnings baked into podspecs. Most of that work has been in [expo/expo](https://github.com/expo/expo/pulls?q=is:pr+author:ramonclaudio) lately, the bulk of it in `@expo/ui`, with fixes reaching into React Native core and Hermes when the bug lives deeper. I've been chipping away at the Swift side because I want my Expo apps to use real SwiftUI components, not the CSS-like wrappers that other libraries layer on top.

I have a CS degree from Long Island University (2016), but most of what I actually know came from building things, breaking them, and reading other people's code.

[hello@ramonclaudio.com](mailto:hello@ramonclaudio.com) / [GitHub](https://github.com/ramonclaudio) / [X](https://x.com/ramonclaudio) / [resume](/resume)

\- Ray
