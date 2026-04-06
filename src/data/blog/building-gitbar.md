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

I live on GitHub. It's where basically all my work happens, and for the past two years my workflow for checking "what needs my attention?" has been the same: open GitHub, click through like 4 tabs, lose 5 minutes, forget what I was doing before. I do this dozens of times a day.

So I built [Gitbar](https://github.com/ramonclaudio/gitbar), a menubar app that puts everything in one window. Click the icon, glance at your PRs and issues, close it. That's really the whole thing.

### Why Tauri

I'm a CLI-first person. Ghostty, yazi, lazygit, if it runs in a terminal I'm probably interested. But this needed to be a menubar app, something that's just always there without competing with 40 browser tabs. That meant a native wrapper, and I'd been wanting to build something with [Tauri](https://v2.tauri.app/) for a while.

Rust backend, web frontend, ~5MB binary. Compare that to Electron's 100MB+ and it's really not even a conversation. Tauri v2 gave me tray icon support, menubar window positioning, macOS vibrancy (the frosted glass effect), and a shell plugin to call `gh auth token` at runtime. No OAuth flow, no env vars. If you're logged into `gh`, you're logged into Gitbar.

The Rust side ended up being like 113 lines. Window management, tray icon, vibrancy. Everything else is TypeScript and React.

### How it works

The app fires 3 GraphQL queries and 1 REST call in parallel the moment you open it. Viewer data for repos and contribution stats, a PR search, an issue search, and recent activity via REST. The left panel renders as soon as the viewer data lands, then PRs and issues just fill in when their searches complete. Activity loads last.

Everything is cached in localStorage with a 30-minute TTL. Cold starts are pretty much instant because the app renders stale data immediately and refreshes behind the scenes. I also cache the username separately so the events query can fire in parallel on first load instead of waiting for the viewer response.

### The privacy toggle

This one actually came from a real situation. I was on a call sharing my screen and realized my private repos, PRs, and issues were all visible. So I added a lock icon that filters out everything marked `isPrivate` across all panels. Yellow when active, grayed when hiding.

### What I learned

Tauri is good. The DX was honestly smoother than I expected for a Rust-based tool, and the binary size alone makes it worth picking over Electron. The shell plugin for calling `gh` was really what made the whole thing click because I could skip the entire OAuth dance and just piggyback on the user's existing auth.

The hardest part was menubar window positioning across different monitor setups. Tauri gives you the tray icon's position and the monitor's dimensions, but you have to do the math yourself so the window doesn't clip off-screen. Merging PR review comments with issue comments into a single timeline was also pretty annoying because GitHub's API splits them into two endpoints with completely different data shapes. Spent way more time on that than I'd like to admit.

About 3,900 lines of TypeScript across 38 files. No state library, no data fetching library. Just `fetch`, `localStorage`, and `useState`.

I use Gitbar every day. It's not flashy, it just does the thing I needed it to do. If you live on GitHub and you're tired of tab-hopping, [give it a try](https://github.com/ramonclaudio/gitbar).

\- Ray
