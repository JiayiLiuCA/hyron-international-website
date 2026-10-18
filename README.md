# HYRON website

Next.js 16 (App Router, Cache Components) + Tailwind CSS v4 + next-intl. English and Simplified Chinese, deployed on Vercel with **Root Directory = `site`**. Requirements and copy live in `../brief/` (BRIEF.md is the source of truth).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Runs `check:copy` + `check:font` (prebuild), then builds. Any banned Tier 1 word fails the build |
| `npm run check:copy` | Compliance word check (BRIEF §1.6). Extra files: `node scripts/check-copy.mjs ../brief/content-zh.md` |
| `npm run fonts:zh` | Rebuilds the Chinese headline font subset after Chinese copy changes (`check:font` fails the build until you do) |
| `npm run copy:review` | Regenerates `../brief/content-zh.md` (EN/ZH side-by-side for client review) |
| `npm run typecheck` / `npm run lint` | TypeScript / ESLint |

## Where things are

- Copy: `messages/en.json`, `messages/zh.json` — components never hard-code text.
- Company facts (phone, email, address, hours, legal name — all pending client confirmation): `src/config/site.ts`.
- Routes: `src/app/[locale]/…` (`/en`, `/zh`); `src/proxy.ts` redirects locale-less URLs by cookie / `Accept-Language`. Old Squarespace URLs are redirected in `next.config.ts`.
- Brand tokens, motion and reveal styles: `src/app/globals.css`. Scroll reveal is React state in `src/components/Reveal.tsx` (photo frames, gold rules); everything respects `prefers-reduced-motion`.
- Fonts: Trirong 600 (stand-in for Collier) + Open Sans via `next/font/google`; Chinese headlines use a self-hosted Noto Serif SC 600 subset (`src/fonts/`); Chinese body text uses the system CJK sans.
- Contact form: `src/lib/contact.ts` (client action for `useActionState` + zod + honeypot, posts to Web3Forms from the browser — its free plan rejects server-side calls). Env var in `.env.example`.

## Photo sources

- `bridge-cable-stayed-aerial.jpg` — brand guide key visual.
- `golden-gate-fog`, `man-on-rock-sea`, `mountain-mist-summit`, `tree-golden-sky`, `speedboat-deep-blue`, `great-wall-lowres`, `mountain-clouds-lowres` — extracted from the brand collateral; rights unconfirmed (BRIEF §3.5).
- Services page photos, free under the [Unsplash License](https://unsplash.com/license) (commercial use, no attribution required; downloaded at 2560px):

| File | Photographer | Source |
|---|---|---|
| `lighthouse-above-clouds.jpg` | Jeremy Bishop | https://unsplash.com/photos/DRKknUyra0Y |
| `glass-facade-looking-up.jpg` | Rafael Garcin | https://unsplash.com/photos/ISQ3M9fPa0g |
| `footbridge-into-mist.jpg` | Maria Teneva | https://unsplash.com/photos/HQnYH_zBcOg |
| `tower-cranes-blue-hour.jpg` | Feng Sun | https://unsplash.com/photos/5AmT_FPF5Jo |
| `highway-interchange-night.jpg` | Justin Zhu | https://unsplash.com/photos/r3R6KYnG8pI |
| `boardroom-city-dawn.jpg` | Yibei Geng | https://unsplash.com/photos/-UdYbiywGeg |

## Deploy (Vercel)

This repository contains only the site, so leave Root Directory at the repository root; framework Next.js, env vars from `.env.example`. The brief and design sources (referenced as `../brief/…` in scripts and comments) live outside this repo. Before pointing the domain at Vercel, record the existing MX/TXT DNS records so the `info@` mailbox keeps working (BRIEF §6.7).
