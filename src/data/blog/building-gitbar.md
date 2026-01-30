---
author: Ray
pubDatetime: 2026-01-29T22:00:00Z
title: "Building Gitbar: A Menubar GitHub Dashboard"
slug: building-gitbar
featured: true
draft: false
tags:
  - project
  - tauri
  - rust
  - github
  - desktop
description: I got tired of opening 4 GitHub tabs to answer one question. So I built a menubar app that answers it in one glance.
---

I live on GitHub. PRs, issues, repos, activity — it's where my work happens. And for the past two years, my workflow for checking "what needs my attention?" has been the same: open GitHub, click through 4 tabs, lose 5 minutes, forget what I was doing before.

I do this dozens of times a day.

So I built [Gitbar](https://github.com/ramonclaudio/gitbar) — a menubar app that puts everything in one window. Click the icon, glance, close. Done.

### Why a desktop app

I'm a CLI-first person. Keyboard over mouse. Terminal over GUI. I use [Ghostty](https://ghostty.org), [yazi](https://github.com/sxyazi/yazi), [lazygit](https://github.com/jesseduffield/lazygit) — basically if it runs in a terminal, I'm interested.

But this needed to be a menubar app. I wanted something that was always there, not buried in a browser tab competing with 40 others. Fast, native, tiny footprint.

That meant Tauri.

### Why Tauri over Electron

I've been wanting to build something with [Tauri](https://v2.tauri.app/) for a while. The pitch is simple: native wrapper, Rust backend, web frontend, ~5MB binary. Compare that to Electron's 100MB+ and it's not even a conversation.

Tauri v2 gave me everything I needed: tray icon, menubar window positioning, macOS vibrancy (the frosted glass effect), auto-hide on blur, and a shell plugin to call `gh auth token` at runtime. No OAuth flow. No env vars. If you're logged into `gh`, you're logged into Gitbar.

The Rust side is 113 lines. Window management, tray icon, vibrancy. That's it. Everything else is TypeScript and React.

### How it works

The app fires 3 GraphQL queries and 1 REST call in parallel the moment you open it:

1. **Viewer query** — repos, contribution stats, calendar
2. **PR search** — created, review requested, assigned, mentioned
3. **Issue search** — created, assigned, mentioned
4. **Events** — recent activity via REST

The left panel renders as soon as the viewer data lands. PRs and issues fill in when their searches complete. Activity loads last. No loading spinner.

Everything is cached in localStorage with a 30-minute TTL. Cold starts are instant. The app renders stale data immediately, then refreshes behind the scenes. I also cache the username separately so the events query can fire in parallel on first load instead of waiting for the viewer response.

### The privacy toggle

This one came from a real need. I was on a call sharing my screen and realized my private repos, PRs, and issues were all visible. So I added a lock icon that filters out everything marked `isPrivate` across all panels. Yellow when active, grayed when hiding. One click.

### Progressive rendering

Every list uses `IntersectionObserver`. Only visible items are in the DOM. Scroll down and more load automatically. This matters when you have hundreds of PRs across multiple repos. Without it, the app would choke on initial render.

### The stack

- **Tauri v2** — native wrapper, Rust backend
- **React 19** — UI
- **Vite 7** — build
- **Tailwind v4** — styling
- **shadcn/ui** — scroll area, avatar, badge, button
- **react-resizable-panels** — draggable panel layout
- **react-markdown** + remark-gfm — PR/issue body rendering
- **Bun** — package manager

About 3,900 lines of TypeScript across 38 files. No state library. No data fetching library. Just `fetch`, `localStorage`, and `useState`.

### What I learned

Tauri is good. Really good. The DX is smoother than I expected for a Rust-based tool, and the binary size alone makes it worth the switch from Electron. The shell plugin for calling `gh` was what made it all click. I could skip the entire OAuth dance and just piggyback on the user's existing auth.

The hardest part was menubar window positioning across different monitor setups. Tauri gives you the tray icon's position and the monitor's dimensions, but you have to do the math yourself so the window doesn't clip off-screen.

Merging PR review comments with issue comments into a single timeline was also annoying. GitHub's API splits them into two endpoints, and the data shapes are different. Spent more time on that than I'd like to admit.

### What's next

I use Gitbar every day. It's not flashy. It doesn't have AI. It just does the thing I needed it to do.

If you live on GitHub and you're tired of tab-hopping, [give it a try](https://github.com/ramonclaudio/gitbar). Fork it, fix it, open a PR. Go build something cool.

\- Ray
