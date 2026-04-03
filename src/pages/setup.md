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

[Zed](https://zed.dev/) is my editor. Fast, and I switched from VS Code without looking back. [Ghostty](https://ghostty.org/) for terminal because it's GPU-accelerated, native on macOS, and the config is just a text file. I run zsh with a [starship](https://starship.rs/) prompt.

[Helium](https://helium.computer/) for browsing.

### Stack

I'm full-stack TypeScript. [Bun](https://bun.com/) runs everything: runtime, package manager, test runner. I tried going back to Node once and it felt slow. I still use uv when I need Python, which is rare now but still happens.

Backend is Convex. Real-time, no infra to manage, and the DX is the best I've used. Better Auth for auth because I got tired of rolling my own. Zod for validation because I don't trust anything that comes over the wire.

Frontend is Tailwind v4 and shadcn/ui for styling. If it doesn't have shadcn support, I don't want it. React and React Native for UI, Expo for mobile, TanStack for routing, state, and queries.

Linting is Oxlint and Oxfmt for TypeScript, Ruff for Python. Type checking with tsgo or tsc for TypeScript, ty for Python.

### CLI Tools

I replaced most of the default Unix tools with faster Rust alternatives. Keyboard over mouse, terminal over GUI.

yazi for file management, lazygit for git, delta for diffs, gh for GitHub, fzf for fuzzy finding. fnm for Node versions. jq and yq for JSON and YAML, jless for viewing JSON. bat instead of cat, fd instead of find, ripgrep instead of grep, eza instead of ls, zoxide instead of cd. duf and dust for disk usage, btm for system monitoring, procs instead of ps, trash instead of rm. hyperfine for benchmarking, tldr for man pages.

### Coffee

V60 pour over most days, [AeroPress](https://aeropress.com/products/aeropress-coffee-maker) when I want something different. Looking at getting an [Orea](https://usa-shop.orea.uk/products/o1-brewer). I follow the [James Hoffmann technique](https://www.youtube.com/watch?v=AI4ynXzkSQo). [1Zpresso ZP6](https://1zpresso.coffee/zp6/) grinder, [Fellow Stagg EKG Pro](https://fellowproducts.com/products/stagg-ekg-electric-pour-over-kettle) kettle, [Third Wave Water](https://thirdwavewater.com/) with a dialed-in mineral formula. I drink it out of a [KH Wurtz](https://khwurtz.dk/) cup I [picked up at La Cabra](https://us.lacabra.com/products/kh-wurtz-cup-dark).

The rumors are true, the ZP6 gives you a cup that's "too clean." I just raise my dial to 6 and grind a bit coarser. I also had to stop using Cafec ABACA filters because the drawdown was too fast, so I'm back on Hario natural brown V60 filters. Open to suggestions.

I drink Nordic style ultralight roasts. [Sey](https://www.seycoffee.com/), [Native](https://www.thenativecoffeecompany.com/), and [Dak](https://www.dakcoffeeroasters.com/) are the roasters I keep coming back to. [Tim Wendelboe](https://timwendelboe.no/) is the goat. Recently been into [Promethium](https://promethiumcoffee.com/) and their wild omni-roast blends. If the bag doesn't have tasting notes that sound like fruit, I'm not buying it.

\- Ray
