---
author: Ray
pubDatetime: 2026-05-01T13:00:00Z
title: "Building seetree: A terminal tree viewer and Claude Code companion written in Zig"
slug: building-seetree
featured: true
draft: false
tags:
  - project
  - zig
  - claude-code
  - cli
  - terminal
description: A live tree for Claude Code in Zig. Lights up files as they're read, written, edited, or deleted.
---

I usually have at least four or five Claude Code sessions going at any given time. I tell Claude what I want, it goes off and reads files, edits them, writes to them, but I can never tell exactly which files got touched without reading through all the thinking and bash calls. My IDE shows the same modified dot for every tracked or untracked file, so the file edited a second ago looks identical to the file edited two weeks ago. It's fine in a clean repo, but once four or five agents have been writing in parallel for an hour it's useless.

So I built [seetree](https://github.com/ramonclaudio/seetree), a terminal tree viewer written in Zig that lights up as Claude works. Files flash when they're being read, written, edited, or deleted, with line counts on writes and edits. Click any name and it opens in your editor. When Claude isn't running it's a fast terminal tree viewer.

### Why Zig

Wrote it in Zig because a CLI that sits in a side pane all day has to start fast and stay small. I started by reading [Mitchell's libghostty post](https://mitchellh.com/writing/libghostty-is-coming) and cloning [ghostling](https://github.com/ghostty-org/ghostling) since I run [Ghostty](https://ghostty.org/) full-time, but libghostty-vt is for embedding a terminal emulator into your own window, which would have meant raylib for the surface, glyph rendering by hand, and a ~10MB binary. That wasn't going to work for me.

Zig has no runtime and no garbage collector, so the binary is only what I put in it. I rewrote the JSONL scanner from scratch and swapped `std.process.spawn` and `std.Io.Dir` out for direct POSIX so it'd actually fit at or around 200K instead of the 250K it was creeping up to.

### The numbers

I wanted seetree to start fast and stay small, comparable to the Rust and Go alternatives. So I benchmarked it with hyperfine and `--shell=none` on an M4 Pro. Run them yourself if you want to check, and tell me if you get something different.
`seetree --once` cold start is 6ms for 5K files, 71ms for 100K, and 695ms for 1M. Same machine, GNU tree takes 463ms for 100K and gives up at 1M, eza takes 622ms and gives up too, fd just lists files (no tree) and still takes 118ms at 100K. The tree itself is an arena, about 240 bytes per node, so live mode idles at around 2MB RSS and under 0.5% CPU. Zero leaks across `--once`, the live loop, and the test suite, verified with Zig's `DebugAllocator` and macOS `leaks --atExit`.

Zero external deps. By default it polls `~/.claude/projects/*.jsonl` every 2 seconds, but `seetree --install-hook --apply` wires Claude's `FileChanged` hook into your settings (with a `.bak`, safe to run twice) and drops the poll to 30 seconds, refreshing on every event instead.

`brew install ramonclaudio/tap/seetree` or `npm i -g seetree` and you're set. The npm package is a small dispatcher that picks the right prebuilt binary at install time, so `bun add -g`, `pnpm add -g`, and `npx seetree` all work too. I use it every day. If you've got Claude sessions running and want to actually see what's getting touched, [give it a try](https://github.com/ramonclaudio/seetree).

\- Ray
