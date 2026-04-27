---
layout: ../layouts/AboutLayout.astro
title: "Setup"
---

Everything I use to build, write, and ship. Updated as things change.

### Hardware

I type on a [Keychron Q10 Max](https://www.keychron.com/products/keychron-q10-max-alice-layout-qmk-via-wireless-custom-mechanical-keyboard). Alice layout, wireless, QMK. The split ergo layout fixed the wrist pain I was getting from flat keyboards. When I'm working from a coffee shop I bring the [NuPhy Air75 V3](https://nuphy.com/products/nuphy-air75-v3), thin enough to fit in my bag without thinking about it.

Mouse is a [Logitech MX Vertical](https://www.logitech.com/en-us/products/mice/mx-vertical-ergonomic-mouse.910-005447.html). Took a week to get used to the grip. Now a normal mouse feels wrong.

All of this runs on a [MacBook Pro 14" M4 Pro](https://www.apple.com/shop/buy-mac/macbook-pro). Everything I need fits in an [Arc'teryx Aerios 35](https://arcteryx.com/us/en/shop/aerios-35-backpack-9588). Laptop, charger, keyboard, water bottle, and still room for a layer.

### Apps

[Zed](https://zed.dev/) is my editor. Fast. Switched from VS Code and never looked back. [Ghostty](https://ghostty.org/) is my terminal. GPU-accelerated, native on macOS, and the config is just a text file. I run zsh with a [starship](https://starship.rs/) prompt. [Claude Code](https://docs.anthropic.com/en/docs/claude-code) runs inside it, pretty much where I spend the whole day.

[Helium](https://helium.computer/) for browsing.

### Skills

I built 9 plugins for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and open sourced them all at [ramonclaudio/skills](https://github.com/ramonclaudio/skills). Context kept vanishing between sessions. Commits took too many steps. No good way to audit a codebase or coordinate parallel agents. So I built the tools I wanted. `/plugin marketplace add ramonclaudio/skills` installs the whole set.

Honestly [handoff](https://github.com/ramonclaudio/skills/tree/main/plugins/handoff) is the one I'd keep if I could only keep one. Two hooks (`SessionStart` and `PostCompact`) auto-inject resume context. `/handoff:end` archives session state with build, test, and lint checks. I don't lose anything between days or machines anymore.

[qmd](https://github.com/ramonclaudio/skills/tree/main/plugins/qmd) is my second brain for docs. It clones GitHub repos, indexes them with BM25 + vector + hybrid search, and exposes an MCP `query` tool so Claude checks the source before guessing. Convex, Expo, AI SDK, Better Auth, RevenueCat, Remotion, Ghostty, and the Claude Code docs all indexed locally. All on-device. The CLI is [`@tobilu/qmd`](https://github.com/tobi/qmd). Node or Bun, SQLite for storage, GGUF models for embeddings. My plugin wraps it as an MCP server with 21 `/qmd:*` commands.

[commit](https://github.com/ramonclaudio/skills/tree/main/plugins/commit) ships atomic conventional commits grouped by architectural layer. GPG-signed. A `PreToolUse` hook blocks force-push, `--no-verify`, and GPG bypass so I can't accidentally ship a dirty commit. `--push`, `--pr`, and `--merge PR#` all work from one command.

[polish](https://github.com/ramonclaudio/skills/tree/main/plugins/polish), [audit](https://github.com/ramonclaudio/skills/tree/main/plugins/audit), and [techdebt](https://github.com/ramonclaudio/skills/tree/main/plugins/techdebt) are my three code-quality sweeps. Polish scores every file 0-10 and refines anything 5+ with up to 5 parallel agents. Audit runs 4 agents in parallel for architecture, bugs, security, and convention compliance. Techdebt runs 3 agents for duplicated code, dead exports, unused deps, stale TODOs, and bloated files. Polish after a feature. Audit periodically. Techdebt at end-of-session.

[teams](https://github.com/ramonclaudio/skills/tree/main/plugins/teams) orchestrates multiple Claude Code sessions in parallel with file ownership so they don't clobber each other. When a task has two or three independent concerns (frontend plus backend, feature plus docs), I use this instead of going sequential. [gif](https://github.com/ramonclaudio/skills/tree/main/plugins/gif) and [frames](https://github.com/ramonclaudio/skills/tree/main/plugins/frames) are my ffmpeg wrappers. Gif does a two-pass palette for compressed GIFs from screen recordings. Frames extracts 3 to 15 frames from a video so Claude can analyze bug repros visually.

### Stack

I'm full-stack TypeScript. [Bun](https://bun.com/) runs everything: runtime, package manager, test runner. I tried going back to Node once and it felt slow. I still use uv when I need Python, which is rare now but still happens.

Backend is Convex. Real-time, no infra to manage, and the DX is the best I've used. Better Auth via `@convex-dev/better-auth` for auth because I got tired of rolling my own. Zod 4 for validation because I don't trust anything that comes over the wire.

Mobile is Expo, on canary. `@expo/ui` and `expo-glass-effect` for UI because I want to stay as close to native Swift as possible. Six apps running on the same skeleton: Expo + Convex + Better Auth + RevenueCat + Resend. No NativeWind.

Web is [Astro](https://astro.build/) for content sites (this one) and [TanStack Start](https://tanstack.com/start) for apps. Tailwind v4 and shadcn/ui for styling. TanStack for routing, state, and queries.

Desktop is [Tauri](https://tauri.app/) with Rust. Small binaries, native webview, no Electron.

Linting is Oxlint and Oxfmt for TypeScript, Ruff for Python. Type checking with tsgo or tsc for TypeScript, ty for Python.

### CLI Tools

I replaced most of the default Unix tools with faster Rust alternatives. If it's written in Rust and saves me a keystroke I'll probably try it.

[yazi](https://github.com/sxyazi/yazi) for file management, [lazygit](https://github.com/jesseduffield/lazygit) for git, [delta](https://github.com/dandavison/delta) for diffs, [gh](https://cli.github.com/) for GitHub, [fzf](https://github.com/junegunn/fzf) for fuzzy finding. [fnm](https://github.com/Schniz/fnm) for Node versions.

[jq](https://jqlang.github.io/jq/) and [yq](https://github.com/mikefarah/yq) for JSON and YAML, [jless](https://github.com/PaulJuliusMartinez/jless) for viewing JSON.

[bat](https://github.com/sharkdp/bat) instead of cat, [fd](https://github.com/sharkdp/fd) instead of find, [ripgrep](https://github.com/BurntSushi/ripgrep) instead of grep, [eza](https://github.com/eza-community/eza) instead of ls, [zoxide](https://github.com/ajeetdsouza/zoxide) instead of cd.

[duf](https://github.com/muesli/duf) and [dust](https://github.com/bootandy/dust) for disk usage, [btm](https://github.com/ClementTsang/bottom) for system monitoring, [procs](https://github.com/dalance/procs) instead of ps, [trash](https://github.com/sindresorhus/trash-cli) instead of rm.

[hyperfine](https://github.com/sharkdp/hyperfine) for benchmarking, [git-filter-repo](https://github.com/newren/git-filter-repo) for history rewrites.

### Coffee

V60 pour over most days, [AeroPress](https://aeropress.com/products/aeropress-coffee-maker) when I want something different. Looking at getting an [Orea](https://usa-shop.orea.uk/products/o1-brewer). I follow the [James Hoffmann technique](https://www.youtube.com/watch?v=AI4ynXzkSQo). [1Zpresso ZP6](https://1zpresso.coffee/zp6/) grinder, [Fellow Stagg EKG Pro](https://fellowproducts.com/products/stagg-ekg-electric-pour-over-kettle) kettle, [Third Wave Water](https://thirdwavewater.com/) with a dialed-in mineral formula. I drink it out of a [KH Wurtz](https://khwurtz.dk/) cup I [picked up at La Cabra](https://us.lacabra.com/products/kh-wurtz-cup-dark).

The rumors are true, the ZP6 gives you a cup that's "too clean." I just raise my dial to 6 and grind a bit coarser. I also had to stop using Cafec ABACA filters because the drawdown was too fast, so I'm back on Hario natural brown V60 filters. Open to suggestions.

I drink Nordic style ultralight roasts. [Sey](https://www.seycoffee.com/), [Native](https://www.thenativecoffeecompany.com/), and [Dak](https://www.dakcoffeeroasters.com/) are the roasters I keep coming back to. [Tim Wendelboe](https://timwendelboe.no/) is the goat. Recently been into [Promethium](https://promethiumcoffee.com/) and their wild omni-roast blends. If the bag doesn't have tasting notes that sound like fruit, I'm not buying it.

\- Ray
