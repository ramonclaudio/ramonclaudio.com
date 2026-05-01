---
layout: ../layouts/AboutLayout.astro
title: "Setup"
---

Everything I use to build, write, and ship. Updated as things change.

### Hardware

I type on a [Keychron Q10 Max](https://www.keychron.com/products/keychron-q10-max-alice-layout-qmk-via-wireless-custom-mechanical-keyboard). Alice layout, wireless, QMK. The split ergo layout fixed the wrist pain I was getting from flat keyboards. When I'm working from a coffee shop I bring the [NuPhy Air75 V3](https://nuphy.com/products/nuphy-air75-v3), thin enough to fit in my bag without thinking about it.

Mouse is a [Logitech MX Vertical](https://www.logitech.com/en-us/products/mice/mx-vertical-ergonomic-mouse.910-005447.html). Took a week to get used to the grip, but a normal mouse feels wrong to me now.

All of this runs on a [MacBook Pro 14" M4 Pro](https://www.apple.com/shop/buy-mac/macbook-pro). Everything I need fits in an [Arc'teryx Aerios 35](https://arcteryx.com/us/en/shop/aerios-35-backpack-9588). Laptop, charger, keyboard, water bottle, and still room for a layer.

### Apps

[Zed](https://zed.dev/) is my editor. It's fast and does what I want from an editor these days, mostly reviewing the code changes Claude Code or Codex made. [Ghostty](https://ghostty.org/) is my terminal, GPU-accelerated and native on macOS, with the config in a text file. I run zsh with a [starship](https://starship.rs/) prompt, plus [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) and [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting). Most of my time now is in [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Codex](https://github.com/openai/codex), and GitHub.

[Helium](https://helium.computer/) for browsing.

### Skills

I built 9 plugins for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and open sourced them all at [ramonclaudio/skills](https://github.com/ramonclaudio/skills). Context kept vanishing between sessions, commits took too many steps, and there was no good way to audit a codebase or coordinate parallel agents, so I built the tools I wanted. `/plugin marketplace add ramonclaudio/skills` installs the whole set.

The three I reach for every day:

[commit](https://github.com/ramonclaudio/skills/tree/main/plugins/commit) is the one I'd keep if I could only keep one. `/commit --pr` does the whole thing: atomic conventional commits grouped by architectural layer, GPG-signed, pushed, PR opened. A `PreToolUse` hook blocks force-push, `--no-verify`, and GPG bypass so I don't accidentally ship something dirty. `--push` and `--merge PR#` work standalone.

[teams](https://github.com/ramonclaudio/skills/tree/main/plugins/teams) runs multiple Claude Code sessions in parallel and gives each one its own file ownership so they don't clobber each other. When a task has two or three independent concerns (frontend plus backend, feature plus docs), I use this instead of going sequential.

[qmd](https://github.com/ramonclaudio/skills/tree/main/plugins/qmd) extends [`@tobilu/qmd`](https://github.com/tobi/qmd) into an MCP server with 21 `/qmd:*` commands wired up for both Claude Code and Codex. Clones GitHub repos, indexes them with BM25 + vector + hybrid search, and exposes a `query` tool so the model checks the source before guessing. Convex, Expo, AI SDK, Better Auth, RevenueCat, Remotion, Ghostty, and the Claude Code docs all indexed locally. SQLite for storage, GGUF models for embeddings. The point is to give Claude and Codex more real source to read on every task instead of having them guess.

### Stack

I'm full-stack TypeScript. I default to [Bun](https://bun.com/) for runtime, package manager, and test runner. When Bun hits a bug or a library or platform doesn't support it (not abnormal), I fall back to [pnpm](https://pnpm.io/), then [npm](https://www.npmjs.com/), and only [yarn](https://yarnpkg.com/) if I have to. [uv](https://github.com/astral-sh/uv) for Python, which is rare these days.

[Expo](https://expo.dev/) is the top of my stack. Every new project starts here, on canary, because the future is Expo across all platforms: iOS, Android, and web from one codebase.

For web-only work, [TanStack Start](https://tanstack.com/start) on Convex, Better Auth, and [shadcn/ui](https://ui.shadcn.com/) handles pretty much everything. Tailwind v4 for styling, TanStack for routing, state, and queries. [Astro](https://astro.build/) for static sites like this one.

Backend is Convex. Real-time, no infra to manage, and the DX is the best I've used. Better Auth via `@convex-dev/better-auth` because I got tired of rolling my own.

Desktop is [Tauri](https://tauri.app/) with Rust. Small binaries and a native webview instead of Electron.

Linting is Oxlint and Oxfmt for TypeScript, Ruff for Python. Type checking with tsgo or tsc for TypeScript, ty for Python.

### CLI Tools

I've replaced most of the default Unix tools with faster Rust alternatives. I'll usually try the Rust version of a tool when I see one.

[delta](https://github.com/dandavison/delta) for diffs, [gh](https://cli.github.com/) for GitHub, [fzf](https://github.com/junegunn/fzf) for fuzzy finding, [tlrc](https://github.com/tldr-pages/tlrc) for tldr pages. [fnm](https://github.com/Schniz/fnm) for Node versions.

[jq](https://jqlang.github.io/jq/) and [yq](https://github.com/mikefarah/yq) for JSON and YAML, [jless](https://github.com/PaulJuliusMartinez/jless) for viewing JSON.

[bat](https://github.com/sharkdp/bat) instead of cat, [fd](https://github.com/sharkdp/fd) instead of find, [ripgrep](https://github.com/BurntSushi/ripgrep) instead of grep, [eza](https://github.com/eza-community/eza) instead of ls, [zoxide](https://github.com/ajeetdsouza/zoxide) instead of cd.

[duf](https://github.com/muesli/duf) and [dust](https://github.com/bootandy/dust) for disk usage, [btm](https://github.com/ClementTsang/bottom) for system monitoring, [procs](https://github.com/dalance/procs) instead of ps, [trash](https://github.com/sindresorhus/trash-cli) instead of rm. [hyperfine](https://github.com/sharkdp/hyperfine) for benchmarking.

### Coffee

V60 pour over most days, [AeroPress](https://aeropress.com/products/aeropress-coffee-maker) when I want something different. Looking at getting an [Orea](https://usa-shop.orea.uk/products/o1-brewer). I follow the [James Hoffmann technique](https://www.youtube.com/watch?v=AI4ynXzkSQo). [1Zpresso ZP6](https://1zpresso.coffee/zp6/) grinder, [Fellow Stagg EKG Pro](https://fellowproducts.com/products/stagg-ekg-electric-pour-over-kettle) kettle, [Third Wave Water](https://thirdwavewater.com/) with a dialed-in mineral formula. I drink it out of a [KH Wurtz](https://khwurtz.dk/) cup I [picked up at La Cabra](https://us.lacabra.com/products/kh-wurtz-cup-dark).

The rumors are true, the ZP6 gives you a cup that's "too clean." I just raise my dial to 6 and grind a bit coarser. I also had to stop using Cafec ABACA filters because the drawdown was too fast, so I'm back on Hario natural brown V60 filters. Open to suggestions.

I drink Nordic style ultralight roasts. [Sey](https://www.seycoffee.com/), [Native](https://www.thenativecoffeecompany.com/), and [Dak](https://www.dakcoffeeroasters.com/) are the roasters I keep coming back to. [Tim Wendelboe](https://timwendelboe.no/) is my favorite. Recently been into [Promethium](https://promethiumcoffee.com/) and their wild omni-roast blends. I tend to gravitate toward bags with fruit-leaning tasting notes.
