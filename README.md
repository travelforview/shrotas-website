# SHROTAS

A production-ready, one-page product experience for SHROTAS premium bottled water, built with supplied transparent product photography and a cinematic, tap-driven hero interaction.

## Stack

Next.js App Router, React, TypeScript, Three.js, React Three Fiber, GSAP ScrollTrigger, and custom responsive CSS.

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

Production verification: `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Production serving: `pnpm start` after a successful build.

## Structure

- `src/components/BottleExperience.tsx` owns the opening state machine and loading gate.
- `src/components/ParticleBottle.tsx` samples the real front PNG alpha channel into GPU particle targets.
- `src/components/BottleReveal.tsx` owns the high-resolution 2D product reveal.
- `src/components/HeroScene.tsx` provides the stable hero boundary.
- `src/data/siteContent.ts` contains editable copy and centralized web asset paths.
- `src/data/productFacts.ts` centralizes verified product and contact details.
- `public/assets/shrotas` contains the web-ready brand assets.

## Asset mapping

- `bottle-front.png`: particle alpha mask, hero reveal, and first product angle.
- `bottle-side.png`: second product-detail angle.
- `bottle-back.png`: third product-detail angle.
- `bottle-spin.mp4`: retained because the current experience preloads its metadata.
- `logo.png`: intro brand reveal, navigation, favicon, and finale.

Before public deployment, replace the placeholder canonical domain in `layout.tsx`, `robots.ts`, and `sitemap.ts` with the final verified domain. No deployment or hosting configuration is included.
