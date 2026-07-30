---
author: Ray
pubDatetime: 2026-04-12T16:00:00Z
modDatetime: 2026-04-21T12:25:00Z
title: "Dark Mode in TanStack Start with shadcn (and the PR)"
slug: tanstack-start-dark-mode
featured: true
draft: false
tags:
  - tanstack
  - shadcn
  - dark-mode
  - ssr
  - open-source
description: shadcn documents dark mode for Next.js, Vite, Remix, and Astro. TanStack Start was missing. I opened a PR. It merged.
---

I build all my web apps on TanStack Start with shadcn. Every new project starts the same way: `shadcn init`, add components, build. It's been this way for a while now.

Dark mode's been a pain the whole time.

shadcn has [dark mode docs](https://ui.shadcn.com/docs/dark-mode) for Next.js, Vite, Remix, and Astro. TanStack Start isn't listed. The Vite guide is the closest match since Start runs on Vite, but it's a client-only pattern that breaks the moment SSR is involved. I've tried copying it, adapting it, wrapping it in guards. Every approach had the same problem: either a flash of white on load, a hydration mismatch, or both.

Over the past few months I've wired dark mode into TanStack Start projects at least a dozen times. Each time I'd end up with some variation of the same workaround: an inline `<script>` in the head, a React context for state, and a lot of hoping the two stayed in sync. It worked, but it was always duct tape. There was no canonical pattern to point at.

### I'm not the only one

[shadcn-ui/ui#7055](https://github.com/shadcn-ui/ui/issues/7055) was opened in March 2025 asking for dark mode docs for React Router v7 and TanStack Start. A commenter tried the Vite guide and hit `localStorage is not defined` during SSR. The OP eventually self-closed it with "just use next-themes."

Three separate PRs have been opened to shadcn trying to fill this gap. None have been merged:

- [#7173](https://github.com/shadcn-ui/ui/pull/7173) by @nisabmohd (April 2025) uses cookies via `createServerFn` + `getCookie`/`setCookie`. No `ScriptOnce`, no "system" mode. First-time visitors always get light mode regardless of OS preference. [@shadcn commented](https://github.com/shadcn-ui/ui/pull/7173#issuecomment-3023669836) asking how it compares to the next PR.
- [#7490](https://github.com/shadcn-ui/ui/pull/7490) by @joeyfinkel (May 2025) was inspired by [TanStack.com's own ThemeToggle.tsx](https://github.com/TanStack/tanstack.com/blob/main/src/components/ThemeToggle.tsx). Also cookie-based. Uses `ScriptOnce` but only conditionally when theme is "system", which means it doesn't fire for users who explicitly set light or dark. [@shadcn commented](https://github.com/shadcn-ui/ui/pull/7490#issuecomment-3023666599) on this one too.
- [#9096](https://github.com/shadcn-ui/ui/pull/9096) by @Knitesik (December 2025) wraps [tanstack-theme-kit](https://github.com/augiwan/tanstack-theme-kit), a 28-star adaptation of `next-themes`. Adds a third-party dependency to the official docs.

Beyond the PRs, the community has been solving this in blog posts and libraries. [Leonardo Montini](https://leonardomontini.dev/tanstack-start-theme/) wrote a guide using `ScriptOnce` and `createIsomorphicFn()`. [tigawanna](https://dev.to/tigawanna/tanstack-start-ssr-friendly-theme-provider-5gee) wrapped `ScriptOnce` in a custom `FunctionOnce` abstraction. [ishchhabra](https://dev.to/ishchhabra/how-to-add-theming-to-an-ssr-app-tanstack-start-56mn) went full server-side with cookies, `beforeLoad` hooks, and `useOptimistic`. Two standalone libraries exist: [tanstack-theme-kit](https://github.com/augiwan/tanstack-theme-kit) (~28 stars, credits a [GitHub Gist by WellDone2094](https://gist.github.com/WellDone2094/16107a2a9476b28a5b394bee3fa1b8a3) as its origin) and [themer](https://github.com/lukonik/themer) (~30 stars).

Even the Vite dark mode guide has open PRs trying to patch the same underlying problems: [#8969](https://github.com/shadcn-ui/ui/pull/8969) adds `typeof window` guards to prevent the `localStorage` SSR crash, [#10132](https://github.com/shadcn-ui/ui/pull/10132) adds a FOUC prevention script to `index.html`, and [#7599](https://github.com/shadcn-ui/ui/pull/7599) adds the missing `colorScheme` style property. All open, none merged.

Everyone hits the same wall. Nobody agrees on the fix.

I decided to go find the canonical answer.

### How TanStack does it

I cloned the [TanStack Router repo](https://github.com/TanStack/router) and grepped every `start-*` example for theme handling. Most of them don't have a toggle at all, just `color-scheme: light dark` in CSS and `dark:` variants driven by `prefers-color-scheme`. Pure CSS, no JavaScript.

But buried in the [document head management guide](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management#inline-scripts-with-scriptonce) is `ScriptOnce`, a component exported from `@tanstack/react-router` that renders a `<script>` tag during SSR, executes it before React hydrates, then removes itself from the DOM. The docs list theme detection first among its use cases. It also supports CSP nonce through `router.options.ssr?.nonce`.

That's the FOUC prevention primitive I'd been reimplementing by hand every time.

### Why the Vite pattern breaks

shadcn's [Vite ThemeProvider](https://ui.shadcn.com/docs/dark-mode/vite) initializes state directly from `localStorage`:

```tsx
const [theme, setTheme] = useState<Theme>(
  () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
);
```

No server render means no problem. TanStack Start does SSR. `localStorage` doesn't exist on the server. This either throws or produces a hydration mismatch where the server renders "system" and the client immediately reads "dark" from storage.

The Next.js guide sidesteps this with `next-themes`. Remix uses `remix-themes` with cookie sessions. Both are framework-specific. TanStack Start doesn't have an equivalent, and pulling `next-themes` into a non-Next.js app felt wrong.

### ScriptOnce + Context

The solution is two layers. `ScriptOnce` handles the DOM before React touches it. A React Context handles state after hydration.

The inline script reads `localStorage`, resolves the preference, and adds the class to `<html>` before the browser paints. Wrapping it in a function threads the provider's `storageKey` and `defaultTheme` props through `JSON.stringify`, so custom configs actually reach the pre-hydration pass:

```tsx
function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultTheme);

  return `(function(){
    try {
      var t = localStorage.getItem(${key});
      if (t !== 'light' && t !== 'dark' && t !== 'system') { t = ${fallback} }
      var d = matchMedia('(prefers-color-scheme: dark)').matches;
      var r = t === 'system' ? (d ? 'dark' : 'light') : t;
      var e = document.documentElement;
      e.classList.add(r);
      e.style.colorScheme = r;
    } catch(e) {}
  })();`;
}
```

The `colorScheme` line is easy to miss. Without it, native browser controls (scrollbars, form inputs, color picker) ignore your theme and render in their default scheme. None of the three open PRs set it. None of the community guides set it. TanStack's own [document head management example](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management#inline-scripts-with-scriptonce) doesn't set it. There's an [open PR to the Vite guide](https://github.com/shadcn-ui/ui/pull/7599) that adds it, but it's been sitting since June 2025.

On the React side, `useState` initializes to `defaultTheme` (not from storage) so server and client produce the same initial render. A `mounted` flag gates the apply-side effects so the inline script's work isn't clobbered before `localStorage` is read:

```tsx
const [theme, setThemeState] = useState<Theme>(defaultTheme);
const [mounted, setMounted] = useState(false);

useEffect(() => {
  const stored = localStorage.getItem(storageKey);
  setThemeState(
    stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : defaultTheme,
  );
  setMounted(true);
}, [defaultTheme, storageKey]);
```

Server renders "system". Client hydrates "system". No mismatch. The effect fires, state updates, and React re-renders with the stored value. The user never sees a flash because `ScriptOnce` already applied the right class before any of this ran.

A second effect applies the resolved class whenever theme changes. A third listens for OS-level `prefers-color-scheme` changes when mode is "system", so toggling your Mac between light and dark while the tab is open actually updates the page. Both route through a shared `applyTheme` helper and both wait on `mounted`. Neither [#7173](https://github.com/shadcn-ui/ui/pull/7173) nor [#7490](https://github.com/shadcn-ui/ui/pull/7490) include this listener.

The provider wraps it all:

```tsx
return (
  <ThemeProviderContext value={{ theme, setTheme }}>
    <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
    {children}
  </ThemeProviderContext>
);
```

### Root layout

Standard TanStack Start root route. `suppressHydrationWarning` on `<html>` because the inline script modifies the class before React hydrates. `ThemeProvider` wraps `<Outlet />` inside `<body>`. `<Scripts />` sits outside the provider.

```tsx
function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

### Mode toggle

Same as every other shadcn dark mode guide. `DropdownMenu` with three items, dual Sun/Moon icons with CSS transforms that crossfade based on `.dark`, `sr-only` label. The only import that changes is `useTheme` pointing at the local provider instead of `next-themes`.

### The gap in TanStack's own docs

TanStack actually has a [shadcn integration guide](https://tanstack.com/router/latest/docs/framework/react/how-to/integrate-shadcn-ui) with its own ThemeProvider example. But that example doesn't use `ScriptOnce` (their own FOUC primitive) and reads `localStorage` directly in `useState` (breaks SSR). Their document head management guide recommends `ScriptOnce` for exactly this use case, but the two docs don't reference each other. So you end up with a pattern that works in development but flashes in production.

The cookie approach from [#7173](https://github.com/shadcn-ui/ui/pull/7173) and [ishchhabra's guide](https://dev.to/ishchhabra/how-to-add-theming-to-an-ssr-app-tanstack-start-56mn) eliminates FOUC by making the server aware of the theme, but it adds server functions, route loaders, and cookie management. For most apps that's more machinery than a theme toggle warrants. `ScriptOnce` + `localStorage` is the simpler path and matches what TanStack's own docs recommend.

### What this covers that the existing PRs don't

|                                   | [#7173](https://github.com/shadcn-ui/ui/pull/7173) | [#7490](https://github.com/shadcn-ui/ui/pull/7490) | [#9096](https://github.com/shadcn-ui/ui/pull/9096) | Mine   |
| --------------------------------- | -------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | ------ |
| `ScriptOnce`                      | no                                                 | conditional                                        | library                                            | always |
| System mode                       | no                                                 | yes                                                | yes                                                | yes    |
| System preference listener        | no                                                 | no                                                 | yes                                                | yes    |
| `colorScheme`                     | no                                                 | no                                                 | yes                                                | yes    |
| `suppressHydrationWarning`        | no                                                 | no                                                 | yes                                                | yes    |
| SSR-safe `useState`               | n/a (cookie)                                       | n/a (cookie)                                       | n/a (library)                                      | yes    |
| No server functions or extra deps | uses server fns + cookies                          | uses server fns + cookies                          | uses `tanstack-theme-kit`                          | yes    |
| Targets current v4 docs           | no                                                 | no                                                 | yes                                                | yes    |

### Full implementation

If you want to wire this up yourself, here's everything you need. Install `dropdown-menu` if you haven't:

```bash
npx shadcn@latest add dropdown-menu
```

If you're on Tailwind v4, make sure your CSS has the class-based dark variant:

```css
@custom-variant dark (&:is(.dark *));
```

**`components/theme-provider.tsx`**

```tsx
import { createContext, useContext, useEffect, useState } from "react";
import { ScriptOnce } from "@tanstack/react-router";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultTheme);

  return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`;
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => {},
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setThemeState(
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : defaultTheme,
    );
    setMounted(true);
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, mounted]);

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next);
    setThemeState(next);
  };

  return (
    <ThemeProviderContext value={{ theme, setTheme }}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeProviderContext>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
```

**`components/mode-toggle.tsx`**

```tsx
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**`routes/__root.tsx`**

```tsx
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { ThemeProvider } from "@/components/theme-provider";

export const Route = createRootRoute({
  head: () => ({
    // ...
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

Drop `<ModeToggle />` wherever you want the toggle to appear.

### The PR

After doing this manually enough times I opened [shadcn-ui/ui#10396](https://github.com/shadcn-ui/ui/pull/10396) adding TanStack Start as a fifth dark mode guide next to Next.js, Vite, Astro, and Remix. Three files. The MDX guide with a `ThemeProvider`, root layout, and mode toggle. An index card with the TanStack logo. A `meta.json` update.

Merged on April 21, 2026. It's now the [official TanStack Start dark mode guide](https://ui.shadcn.com/docs/dark-mode/tanstack-start).

In review shadcn pushed a refactor worth calling out. My draft hardcoded `'theme'` and `'system'` inside the inline script string, so custom `storageKey` or `defaultTheme` props on the provider would silently get ignored by the pre-hydration pass. He wrapped the string in `getThemeScript(storageKey, defaultTheme)` and threaded the props through `JSON.stringify`. Same commit also extracted the class-swap into an `applyTheme` helper and added a `mounted` gate so the inline script's work isn't overwritten with `defaultTheme` on first mount before `localStorage` is read. All three changes are reflected in the code above.

### The starter and the live demo

Rather than ship the PR and wait, I turned the pattern into a working starter so anyone can grab it today.

[tanstack-cn](https://github.com/ramonclaudio/tanstack-cn) is a TanStack Start template on the latest majors: Vite 8 with Rolldown + Oxc, Tailwind v4, shadcn on Base UI (base-luma variant), Oxlint + Oxfmt. Dark mode wired up exactly as described above: `ScriptOnce`, `suppressHydrationWarning`, `colorScheme`, OS-preference listener, SSR-safe `useState`.

Two npm packages back it:

- [`create-tanstack-cn`](https://www.npmjs.com/package/create-tanstack-cn) scaffolds a new project via `bun create tanstack-cn my-app`
- [`tanstack-cn`](https://www.npmjs.com/package/tanstack-cn) is the shared package the scaffolded project consumes

Live demo: [tanstack-cn.vercel.app](https://tanstack-cn.vercel.app/).

#10396 shipped. The starter mirrors the official guide for anyone hitting the same wall.

\- Ray
