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

I'm a CLI-first person. Ghostty, yazi, lazygit, if it runs in a terminal I'm probably interested. But this needed to be a menubar app, something that's always there without competing with 40 browser tabs. That meant a native wrapper, and I'd been wanting to build something with [Tauri](https://v2.tauri.app/) for a while.

Rust backend, web frontend, ~5MB binary against Electron's 100MB+. Tauri v2 gave me tray icon support, menubar window positioning, macOS vibrancy (the frosted glass effect), and a shell plugin for running `gh auth token` at runtime. The Rust side ended up being 118 lines for window management, the tray icon, and vibrancy. Everything else is TypeScript and React.

### Auth via `gh`

This is the call that saved me from the entire OAuth dance. Instead of a callback server and a persistent session, Gitbar shells out to the `gh` CLI once on launch:

```typescript
import { Command } from "@tauri-apps/plugin-shell";

export async function getToken(): Promise<string | null> {
  const out = await Command.create("gh", ["auth", "token"]).execute();
  return out.stdout.trim() || null;
}
```

If you're logged into `gh`, you're logged into Gitbar. No env vars, no registered OAuth app, no per-user setup. The token comes back, the app caches it in memory for the session, and every GitHub API call from the frontend carries it as `Authorization: bearer <token>`.

### The data layer

Three GraphQL queries and one REST call fire in parallel the moment the window opens:

1. `VIEWER_QUERY`: repos you own plus the contribution graph (355-day heatmap and aggregate stats)
2. `PR_SEARCH_QUERY`: PRs where you're the author, assignee, reviewer, or mentioned
3. `ISSUE_SEARCH_QUERY`: issues where you're the author, assignee, or mentioned
4. `/users/:username/events`: recent activity feed (no GraphQL equivalent, so REST)

The left panel renders as soon as the viewer data lands, PRs and issues fill in when their searches complete, and activity loads last. Each section has its own error boundary so a flaky query doesn't take the whole dashboard down.

Everything is cached in `localStorage` with a 30-minute TTL. The cached username lives under a separate key so the events call can fire in parallel with the viewer query on first load instead of waiting for the viewer response to learn the username. Cold starts are basically instant because stale data renders first and the background refresh swaps it in.

### The native bits

Tauri gives you the tray icon's position and the monitor's dimensions, but putting the window under the tray, fitting it to the monitor, and keeping it from clipping off-screen on a 4K display with retina scaling is on you. That's the `fit_to_monitor` helper in `src-tauri/src/lib.rs`:

```rust
fn fit_to_monitor(
    window: &tauri::WebviewWindow,
    tray_pos: Option<tauri::PhysicalPosition<f64>>,
    padding: f64,
) {
    let monitor = tray_pos
        .and_then(|pos| {
            window.available_monitors().ok().and_then(|monitors| {
                monitors.into_iter().find(|m| {
                    let mp = m.position();
                    let ms = m.size();
                    let px = pos.x as i32;
                    let py = pos.y as i32;
                    px >= mp.x && px < mp.x + ms.width as i32
                        && py >= mp.y && py < mp.y + ms.height as i32
                })
            })
        })
        .or_else(|| window.current_monitor().ok().flatten());
    // then: divide by scale factor, subtract padding, set size and position
}
```

Find the monitor the tray icon lives on, divide by the scale factor so retina DPI doesn't double the window, apply padding so the frame has breathing room, fall back to the primary monitor if the tray coordinates don't match anything. Took way more iterations than I'd like to admit.

macOS vibrancy is a one-liner with [`window-vibrancy`](https://crates.io/crates/window-vibrancy):

```rust
apply_vibrancy(
    &window,
    NSVisualEffectMaterial::FullScreenUI,
    Some(NSVisualEffectState::Active),
    Some(12.0),
);
```

`FullScreenUI` is the blur level macOS uses for notification center and the app switcher. `12.0` is the corner radius so the window matches the native menubar rounding, and it ends up feeling like a native OS widget.

### Merging PR review comments with issue comments

Each detail view shows a merged timeline of comments. GitHub's API splits these across two endpoints with different shapes:

- `/repos/:repo/issues/:n/comments` for issue-thread comments
- `/repos/:repo/pulls/:n/comments` for review comments on specific lines

One call per endpoint, in parallel, merged client-side:

```typescript
export async function fetchAllComments(
  repo: string,
  number: number,
): Promise<Comment[]> {
  const [issueComments, reviewComments] = await Promise.all([
    fetchComments(repo, number),
    fetchPRReviewComments(repo, number),
  ]);
  return [...issueComments, ...reviewComments].sort(byCreatedAt);
}
```

Normalizing the two shapes into a single `Comment` type so they sort chronologically was the fiddly part. [`react-markdown`](https://github.com/remarkjs/react-markdown) with `rehype-sanitize` and `rehype-raw` handles the rendering so PR bodies with inline HTML don't execute anything they shouldn't.

### The privacy toggle

This came from a real situation. I was on a call sharing my screen and realized my private repos, PRs, and issues were all visible. So I added a lock icon that filters out everything marked `isPrivate` across all panels. Yellow when active, grayed when hiding.

### The numbers

Tauri shell with a TypeScript + React frontend, ~118 lines of Rust for the native bits. No state library, no data-fetching library, just `fetch`, `localStorage`, and `useState`. Built and shipped on January 29, 2026.

I use Gitbar every day. It does the thing I needed it to do. If you live on GitHub and you're tired of tab-hopping, [give it a try](https://github.com/ramonclaudio/gitbar).

\- Ray
