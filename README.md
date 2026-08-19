![ramonclaudio.com](public/assets/ramonclaudio-site.webp)

# ramonclaudio.com

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

I wanted a site that was fast, lightweight, and static. Astro was the obvious choice, and I wanted it as clean as I could get it.

So I forked [astro-paper](https://github.com/satnaing/astro-paper) and went at it.

## Install

```bash
bun install
bun run dev           # dev server on localhost:4321
bun run build         # type-check + build + pagefind index
bun run preview       # preview production build
bun run format        # format with oxfmt
bun run lint          # lint with oxlint
```

Requires Node.js 24+ and Bun.

## Structure

```
src/
  pages/          # file-based routing: posts, projects, apps, contributions,
                  # resume, setup, tags, search, RSS, llms.txt, OG endpoints
  components/     # Header, Footer, Card, Tag, Pagination, ShareLinks, etc.
  layouts/        # Layout, Main, PostDetails, AboutLayout, ResumeLayout
  data/           # blog posts (markdown), projects.ts, contributions.ts
  styles/         # global.css (Tailwind v4 theme + OKLch tokens), typography.css
  utils/          # post filtering, OG image generation, slug helpers
  config.ts       # site metadata
  constants.ts    # socials, nav
  content.config.ts
```

## License

MIT
