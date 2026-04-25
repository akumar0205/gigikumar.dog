# gigikumar.dog

> The official website of Gigi Kumar, Chief of the Fun Police Department.

## About

A fun, interactive website for the world's best dog. Built with modern web tech and packed with playful interactions.

## Features

- **Hero** — Full-viewport intro with Gigi's best photo
- **Pet Gigi** — Click to pet Gigi, with wobble animations, floating hearts, and a counter. Click fast enough to trigger **Zoomies Mode** 🐾
- **Give Gigi a Treat** — Animated treat button with flying bones, accumulating treat emojis, and milestone messages
- **Fun Police Badge** — Gigi's official police credentials with a "Report Fun" button that dispatches Gigi to the scene with random dispatch messages and siren effects
- **Floating Paw Particles** — Subtle animated paw prints drifting across the background

## Tech Stack

- [Astro](https://astro.build) — Static site framework
- [React](https://react.dev) — Interactive components (islands architecture)
- [Framer Motion](https://motion.dev) — Animations
- [Tailwind CSS](https://tailwindcss.com) — Styling

## Project Structure

```
src/
├── components/
│   ├── PawParticles.tsx      # Floating paw print canvas background
│   ├── PetGigi.tsx            # Pet interaction + zoomies easter egg
│   ├── TreatCounter.tsx       # Give treats interaction
│   └── FunPoliceBadge.tsx    # Fun police badge + dispatch
├── layouts/
│   └── Layout.astro          # Base layout, meta, fonts
├── pages/
│   └── index.astro           # Main page
└── styles/
    └── global.css             # Tailwind + custom animations
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Built for **Cloudflare Pages**:

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node.js version**: 22+

All interactive features use `localStorage` only — no backend required.

## Photos

Three photos of Gigi are used across the site:

| File | Location |
|------|----------|
| `gigi.jpg` | Hero section |
| `gigi2.jpg` | Pet Gigi interaction |
| `gigi3.jpg` | Fun Police badge mugshot |

## License

All rights reserved. Gigi's fun-stopping services are not subject to negotiation.