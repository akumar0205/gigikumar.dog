# Gigi Kumar Dog Website

## Commands

- `npm run dev` — Astro dev server
- `npm run build` — Static build to `dist/`
- `npm run preview` — Preview the built site

There are no tests, lint, or typecheck scripts. Verify changes by running `npm run build` — if it succeeds, the site works.

## Architecture

Astro static site with React "islands" for interactive components. No SSR, no backend.

- **Astro** handles the page shell and static sections (`src/pages/`, `src/layouts/`)
- **React components** (`src/components/*.tsx`) are loaded via `client:load` directive — they ship JS to the browser, everything else is static HTML
- **Tailwind CSS v4** via Vite plugin (not PostCSS). Custom theme tokens defined in `src/styles/global.css` under `@theme {}`
- **Framer Motion** is only imported in React components — never in Astro files
- All interactivity uses `localStorage` only (pet count, treat count, happiness, fun-stopped count) — no database or API

## Key conventions

- React components use `export default`, Astro components use named exports
- Photo assets live in `public/images/` — they are NOT processed by Vite, just copied as-is to `dist/`
- Optimize photos before adding to `public/` (raw 8MB+ photos bloat the repo). Use `sips --resampleWidth 1440` on macOS
- The `.gitignore` excludes raw source photos (`*.JPG`, `Gigi_photo.jpg`) — only the optimized versions in `public/images/` should be committed
- Output is **static only** (`dist/`) — deploy target is Cloudflare Pages

## Deploy

- Build command: `npm run build`
- Output directory: `dist`
- Node >= 22.12.0 required
- No environment variables needed