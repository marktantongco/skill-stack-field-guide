# Skill Stack Field Guide

> An interactive, mobile-first knowledge-base for motion-stack combinations, agent-skill synergy, and live 21st.dev component discovery. Built in Manila, deployed globally.

**Live:** https://skill-stack-field-guide.vercel.app · **Source:** https://github.com/marktantongco/skill-stack-field-guide

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/marktantongco/skill-stack-field-guide&env=API_KEY_21ST&envDescription=21st.dev%20API%20key%20for%20live%20component%20search&project-name=skill-stack-field-guide)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02?logo=greensock)](https://greensock.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## What this is

A **single-page interactive wiki** that helps developers, designers, and AI-agent builders choose the right motion-stack and skill combination for their project. Three sections work together:

1. **30 Skill-Stack Combinations** — three deliberately different directions (Silk & GPU / Zero-Bundle Fluidity / Spatial Storytelling), ten combos each. Every combo has a logic, a constraint, a mitigation, a synergy score (/10), and a mobile-performance rating.
2. **20-Row Synergy Matrix** — deduped motion-stack pairings ranked by synergy, error-risk, mobile perf, and best-for use case. Sortable.
3. **Live 21st.dev Component Registry** — real-time search of the public 21st.dev component library via the official `https://21st.dev/api/v1/components/search` endpoint. Preview PNGs, authors, tags, copyable install commands.
4. **Verified Skills Registry** — 23 agent skills with real install counts from [skills.sh](https://skills.sh), searchable and sortable.
5. **Top-5 Synergies per Foundational Core** — for `ui-ux-pro-max`, `stitch-design`, and `21st-registry`, the five highest-rated pairings with the why and the risk.

## Why it exists

The agent-skills ecosystem (skills.sh) and the motion-stack ecosystem (GSAP, Three.js, Framer Motion, Rive, WebGPU…) are both exploding. But **no resource maps which combinations work, which fight each other, and which break on mobile.** This guide closes that gap with verified data — not opinion.

## Table of contents

- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Deploy to Vercel](#deploy-to-vercel)
- [Architecture](#architecture)
- [Skills registry](#skills-registry)
- [The three directions](#the-three-directions)
- [Live 21st.dev integration](#live-21stdev-integration)
- [Secret management (git-crypt)](#secret-management-git-crypt)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Quick start

```bash
# Clone
git clone https://github.com/marktantongco/skill-stack-field-guide.git
cd skill-stack-field-guide

# Install deps
bun install  # or npm install / pnpm install

# Copy env template
cp .env.local.example .env.local
# Edit .env.local — add your API_KEY_21ST (see Environment variables below)

# Run dev server
bun run dev
# Open http://localhost:3000
```

The Live Component Registry section auto-searches "navbar" on load. Try "button", "hero", "card", "modal", "input", "tabs", "accordion", "tooltip", "sidebar" via the suggestion chips.

## Environment variables

This project uses **canonical env var names** per the `@21st-dev/registry` npm package (`src/config.ts`):

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `API_KEY_21ST` | ✅ yes | — | 21st.dev API key — powers the live component search proxy |
| `AN_API_KEY` | ❌ no | — | Legacy alias for `API_KEY_21ST` |
| `API_URL_21ST` | ❌ no | `https://21st.dev/api/v1` | Override the API base URL |
| `APP_URL_21ST` | ❌ no | `https://21st.dev` | Override the app base URL |

### Get your API key

1. Sign in at [21st.dev](https://21st.dev)
2. Visit `https://21st.dev/studio/<your-handle>/api-keys`
3. Generate a key (starts with `an_sk_`)
4. Add to `.env.local` locally, or to Vercel env vars for production

### `.env.local.example` (committed, safe to share)

```bash
# Primary 21st.dev API key (required for CLI + this wiki's /api/components proxy)
API_KEY_21ST=your_key_here

# Optional overrides (defaults shown). Uncomment to customize.
# API_URL_21ST=https://21st.dev/api/v1
# APP_URL_21ST=https://21st.dev
```

> ⚠️ **Never commit `.env.local`.** It's gitignored. For team secret sharing, see [Secret management](#secret-management-git-crypt).

## Deploy to Vercel

This is a Next.js 16 app with server-side API routes — **Vercel is the correct deploy target**, not GitHub Pages (Pages only serves static files and cannot run the `/api/components` proxy or read server-side env vars).

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/marktantongco/skill-stack-field-guide&env=API_KEY_21ST&envDescription=21st.dev%20API%20key%20for%20live%20component%20search&project-name=skill-stack-field-guide)

### Manual deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Link + deploy
vercel link
vercel deploy --prod

# Set the env var (if not set during link)
vercel env add API_KEY_21ST production
# Paste your an_sk_... key when prompted
```

### Why not GitHub Pages?

| Feature | GitHub Pages | Vercel |
|---------|-------------|--------|
| Static files | ✅ | ✅ |
| Server-side API routes (`/api/components`) | ❌ | ✅ |
| Server-side env vars (`API_KEY_21ST`) | ❌ | ✅ |
| Next.js 16 App Router | ❌ (static export only) | ✅ |
| Edge functions | ❌ | ✅ |

The `/api/components` route proxies your 21st.dev API key server-side — the key never reaches the browser. This requires a server runtime, which Pages does not provide.

## Architecture

```
Browser ──► /api/components (Next.js Route Handler, server-side)
                    │
                    │  Authorization: Bearer ${API_KEY_21ST}
                    ▼
            https://21st.dev/api/v1/components/search
                    │
                    ▼
            { results: [{ name, slug, preview_url, install_ref, … }] }
```

**Key design decisions:**

1. **Server-side proxy.** The browser never sees your API key. The Next.js Route Handler at `src/app/api/components/route.ts` reads `API_KEY_21ST` from `process.env` and forwards the request to 21st.dev. The key stays server-side.
2. **Canonical env var names.** The proxy reads `API_KEY_21ST ?? AN_API_KEY` — the same names the `@21st-dev/registry` CLI uses. One `.env.local` powers both the CLI and the app.
3. **Brief browser cache.** The proxy sets `Cache-Control: private, max-age=30, stale-while-revalidate=60` — rapid re-searches hit the cache, sparing the upstream API.
4. **GSAP for the hero, Framer Motion for the UI.** They never touch the same DOM nodes (see the Synergy Matrix's "Toxic Mixes" — GSAP + Framer Motion on the same element causes inline-style collision). GSAP owns the hero title split-and-stagger; Framer Motion owns layout transitions, reveals, and the drawer.

## Skills registry

Every skill in the wiki is verified against the live [skills.sh](https://skills.sh) leaderboard. Install counts are real telemetry, not estimates.

### Foundational cores

| Skill | Install | Use |
|-------|---------|-----|
| `ui-ux-pro-max` | 245.3K | Design-system + contrast + a11y enforcement |
| `stitch-design` | 25.3K | Google Labs design generation |
| `21st-registry` | 124 | 21st.dev component registry install |

### Install commands

```bash
# Foundational cores
npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
npx skills add google-labs-code/stitch-skills --skill stitch-design
npx skills add 21st-dev/registry --skill 21st-registry

# Motion stacks
npx skills add greensock/gsap-skills --skill gsap-core
npx skills add greensock/gsap-skills --skill gsap-scrolltrigger
npx skills add patricio0312rev/skills --skill framer-motion-animator
npx skills add https://github.com/LottieFiles/motion-design-skill --skill motion-design
npx skills add uxjoseph/supanova-design-skill --skill supanova-premium-aesthetic

# 21st.dev CLI (for installing components found via the Live search)
npx @21st-dev/registry add @author/slug
npx @21st-dev/registry search "button"
npx @21st-dev/registry login
npx @21st-dev/registry publish
```

> ⚠️ **Common gotchas:**
> - `npx skills add 21st-dev/registry --skill 21st-dev-components` **fails** — the skill name is `21st-registry`, not `21st-dev-components`.
> - `npx skills add https://github.com/LottieFiles/motion-design-skill --skill lottie-motion` **fails** — the skill name is `motion-design`, not `lottie-motion`.

## The three directions

The 30 combinations are grouped into three deliberately different directions:

### Direction A — Silk & GPU (Premium agency / portfolio)
GSAP + Three.js + Rive + isolated Framer Motion. Chases silk-smooth premium agency motion. Best for portfolios, immersive marketing sites, cinematic scrollytelling.

### Direction B — Zero-Bundle Fluidity (Performance SaaS) — *default scope*
CSS View Transitions + WAAPI + Tailwind + Popmotion. Bets on zero-bundle native browser primitives. Best for SaaS dashboards, enterprise apps, performance-critical mobile. The wiki opens on this direction by default.

### Direction C — Spatial Storytelling (Immersive 3D wiki)
Theatre.js + React Three Fiber + WebGPU + glTF. Goes spatial and immersive. Best for VR/AR experiences, 3D product showcases, cinematic browser intros.

## Live 21st.dev integration

The Live Component Registry section calls `GET /api/components?q=<query>&scope=public&limit=12`, which proxies to:

```
GET https://21st.dev/api/v1/components/search?q=<query>&scope=public&limit=<n>
Authorization: Bearer ${API_KEY_21ST}
```

**Response shape:**

```typescript
interface SearchResult {
  name: string;
  slug: string;
  description: string | null;
  install_ref: string;      // e.g. "@author/slug"
  url: string;              // https://21st.dev/@author/components/slug
  preview_url: string;      // CDN PNG
  author: string | null;
  tags: string[];
  updated_at: string;       // ISO 8601
}
```

Click any result to open a detail drawer with the copyable install command: `npx @21st-dev/registry add @author/slug`.

## Secret management (git-crypt)

This repo ships with a git-crypt workflow for team secret sharing. See [`SETUP_SECRETS.md`](./SETUP_SECRETS.md) for the full guide.

**TL;DR:**

- `.env.local` is **gitignored** (not committed) — for local dev + Vercel env vars.
- `.env.local.example` is **committed plaintext** — documents env var names with placeholders only.
- For team sharing, uncomment the `.env.local` line in `.gitattributes`, run `git-crypt init`, export the key, and commit `.env.local` encrypted.
- **Reference keys by name (`API_KEY_21ST`), never by value.** Rotate immediately if exposed.

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | Server-side API routes for the proxy; React Server Components |
| Language | TypeScript 5 | Type safety for the API response shape |
| Styling | Tailwind CSS 4 | Utility-first, mobile-first responsive |
| UI components | shadcn/ui (New York) | Accessible primitives, customizable |
| Animation | Framer Motion + GSAP | UI transitions + hero split-stagger (partitioned by DOM node) |
| Icons | lucide-react | Consistent, tree-shakeable |
| Deploy | Vercel | Native Next.js support, server-side env vars |
| Secrets | git-crypt (optional) | Team secret sharing |

## Project structure

```
src/
├── app/
│   ├── api/
│   │   └── components/
│   │       └── route.ts          # Server-side 21st.dev proxy
│   ├── globals.css               # Tailwind + dark theme tokens
│   ├── layout.tsx                # Root layout, dark mode, metadata
│   └── page.tsx                  # Main wiki page (all sections)
├── components/
│   └── LiveComponents.tsx        # Live 21st.dev search UI
├── lib/
│   └── skillData.ts              # 30 combos, 20-row matrix, 23 skills, 3 cores
└── ...
.env.local                        # Gitignored — real API key
.env.local.example                # Committed — placeholder template
.gitattributes                    # git-crypt filter rules
SETUP_SECRETS.md                  # git-crypt workflow guide
AGENTS.md                         # Operating instructions for AI agents
worklog.md                        # Build log (append-only)
```

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your-feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

**Before contributing, read [`AGENTS.md`](./AGENTS.md)** — it documents the operating principles (working code only, assumptions stated, depth before speed, end with 3 suggestions) that govern this project.

### Data updates

The skills registry install counts in `src/lib/skillData.ts` were captured from skills.sh on 2026-07-02. To refresh:

```bash
# Re-fetch the leaderboard
curl -s https://skills.sh | grep -oE '[0-9.]+[KM]?' | head -50
# Update the SKILLS array in src/lib/skillData.ts
```

## License

MIT — see [LICENSE](./LICENSE).

---

## Acknowledgments

- **SilentDepth v4 protocol** — operating principles adopted from [`system_silentdepth_v4.md`](https://github.com/marktantongco/opencode-accomplishments/blob/main/profiles/system_silentdepth_v4.md)
- **skills.sh** — the open agent-skills directory maintained by Vercel Labs
- **21st.dev** — the React component registry powering the Live search
- **GreenSock** — GSAP, the industry-standard animation engine
- **Framer Motion** — declarative React animation
- **shadcn/ui** — accessible component primitives

---

Built in Manila 🇵🇭 · Deployed globally · [Live demo](https://skill-stack-field-guide.vercel.app)
