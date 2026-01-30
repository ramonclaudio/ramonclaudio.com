---
layout: ../layouts/AboutLayout.astro
title: "Setup"
---

Everything I use to build, write, and ship. Updated as things change.

### Hardware

I type on a **Keychron Q10 Max** — Alice layout, wireless, QMK. The split ergo layout fixed the wrist pain I was getting from flat keyboards. When I'm working from a coffee shop I bring the **NuPhy Air75 V3**, which is thin enough to fit in my bag without thinking about it.

Mouse is a **Logitech MX Vertical**. Took a week to get used to the grip. Now a normal mouse feels wrong.

All of this runs on a **MacBook Pro 14" M4 Pro**. Everything I need fits in an **Arc'teryx Aerios 35** — laptop, charger, keyboard, water bottle, and still room for a layer.

### Apps

**Zed** for editing. Fast and has Vim mode. I switched from VS Code and haven't looked back.

**Ghostty** for terminal. GPU-accelerated, native on macOS, and the config is just a text file. I run **tmux** inside it and **zsh** with a **starship** prompt.

**Helium** for browsing. Lightweight, no bloat.

**Obsidian** for everything else. Notes, vaults, all my markdown. If I'm writing something that isn't code, it's in Obsidian.

### Stack

I'm full-stack TypeScript. **Bun** runs everything — runtime, package manager, test runner. I tried going back to Node once and it felt slow. **uv** when I need Python, which is rare now but still happens.

Backend is **Convex**. Real-time, no infra to manage, and the DX is the best I've used. **Better Auth** for auth because I got tired of rolling my own. **Zod** for validation because I don't trust anything that comes over the wire.

Frontend is **Tailwind v4** + **shadcn/ui** for styling — if it doesn't have shadcn support, I don't want it. **React** and **React Native** for UI, **Expo** for mobile, **TanStack** for routing, state, and queries.

Linting is **Oxlint** + **Oxfmt** for TypeScript, **Ruff** for Python. Type checking with **tsgo** or **tsc**.

### CLI Tools

I replaced most of the default Unix tools with faster Rust alternatives. Keyboard over mouse, terminal over GUI.

| Tool | Purpose |
|------|---------|
| yazi | File manager |
| lazygit | Git TUI |
| delta | Git diffs |
| gh | GitHub CLI |
| fzf | Fuzzy finder |
| fnm | Node version manager |
| jq | JSON processor |
| yq | YAML processor |
| jless | JSON viewer |
| bat | Cat with syntax highlighting |
| fd | Fast find |
| ripgrep | Fast grep |
| eza | Modern ls |
| zoxide | Smarter cd |
| duf | Disk usage |
| dust | Disk usage visualizer |
| fastfetch | System info |
| btm | System monitor |
| procs | Modern ps |
| trash | Safe rm |
| hyperfine | Benchmarking |
| tldr | Man pages |

### Coffee

V60 pour over, every morning. I drink Nordic style light roasts — **Sey** and **Native** are the two roasters I keep coming back to. If the bag doesn't have tasting notes that sound like fruit, I'm not buying it.
