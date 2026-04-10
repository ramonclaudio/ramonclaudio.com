![ramonclaudio.com](public/assets/ramonclaudio-site.gif)

# ramonclaudio.com

I wanted a personal site that was actually mine, not a template with swapped colors. Somewhere to put my projects, writing, and upstream contributions in one place. Ended up with a static Astro site that generates OG images on build, indexes everything for full-text search, and deploys in seconds.

Astro 6 + Tailwind CSS v4 + TypeScript. Deployed on Vercel.

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
  pages/          # file-based routing: blog, projects, tags, search, RSS, OG endpoints
  components/     # Header, Footer, Card, Tag, Pagination, ShareLinks, etc.
  layouts/        # Layout, Main, PostDetails, AboutLayout
  data/           # blog posts (markdown), projects.ts
  styles/         # global.css (Tailwind v4 theme + OKLch tokens), typography.css
  utils/          # post filtering, OG image generation, slug helpers
  config.ts       # site metadata
  constants.ts    # socials, nav
  content.config.ts
```

## What's in it

- Blog with content collections, tags, pagination
- Dynamic OG images per post via Satori + resvg
- Client-side full-text search with Pagefind
- View transitions via Astro `ClientRouter`
- Dark mode with system preference detection
- Shiki syntax highlighting (min-light / night-owl)
