# Worklog — Skill Stack Knowledge-Base Project

---
Task ID: 1
Agent: main (Super Z)
Task: Fetch system_silentdepth_v4.md, adopt principles, research skills.sh, compile 30-skill stack + synergy matrix + skills table, build interactive mobile-first wiki knowledge-base.

Work Log:
- Fetched `system_silentdepth_v4.md` from GitHub (62 lines). Adopted Silent Protocol + Depth-Seeking + Response Framework as session conventions. Wrote `/home/z/my-project/AGENTS.md`.
- Fetched skills.sh homepage + docs. Confirmed it is the open agent-skills directory maintained by Vercel (source: github.com/vercel-labs/skills). Install pattern: `npx skills add <owner/repo> [--skill <name>]`. Leaderboard ranks by anonymous install telemetry.
- Verified all 8 user-listed skill repos against skills.sh. Captured real install counts.
- CRITICAL FINDING: `21st-dev/registry` repo contains skill `21st-registry` (124 installs) — NOT `21st-dev-components`. The user's `--skill 21st-dev-components` flag will fail. Flagged for correction in deliverable.
- Security note: User pasted 21st.dev API key in plaintext. Flagged for rotation.

Stage Summary:
- Skills.sh verified real; leaderboard data captured.
- Install commands confirmed for: ui-ux-pro-max (245.3K), stitch-loop (46.1K), stitch-design (25.3K), gsap-core (30.5K), framer-motion-animator (7.3K), motion-design (3.7K), supanova-premium-aesthetic (152), 21st-registry (124).
- Next: compile 30-combination stack + synergy matrix + skills table, then build Next.js wiki.

---
Task ID: 2
Agent: main (Super Z)
Task: Build the interactive mobile-first wiki knowledge-base (Next.js + Framer Motion).

Work Log:
- Initialized fullstack env (Next.js 16, TS, Tailwind 4, shadcn/ui, framer-motion already in deps).
- Created `/src/lib/skillData.ts` with: 30 combinations (3 directions × 10), 20-row synergy matrix, 23-skill verified registry, 3 foundational cores × 5 top synergies, 12 install commands.
- Wrote `/src/app/page.tsx` (~580 lines): Hero (parallax orbs, gradient title, stat strip), StickyNav (mobile collapsible), Foundations, Combinations (filter A/B/C/All), SynergyMatrix (sort by synergy/risk, desktop table + mobile cards), DeepDive (grouped accordion), Registry (search + sort, desktop table + mobile cards), Cores (top-5 per core), Install (copy-to-clipboard, security warning), Footer. Scroll progress bar. Dark theme enforced.
- Updated layout.tsx metadata + dark class on <html>.
- Lint: clean (0 errors).
- Agent-browser verification: page loads (200), no console errors, 30 article cards, 2 tables, 7 H2 sections. Filter test: B=10, A=10, All=30. Sort-by-Risk: first row = "Critical" (correct). Screenshots captured (mobile 390×844, desktop 1440×900). Pixel sampling confirms gradient hero text + content rendered.

Stage Summary:
- Deliverable live at localhost:3000, verified interactive end-to-end.
- Key correction surfaced: `21st-dev/registry` skill is `21st-registry`, NOT `21st-dev-components` — flagged in Foundations, Registry, and Install sections.
- Security warning surfaced: user's pasted API key flagged for rotation in Install section.
- AGENTS.md written adopting SilentDepth v4 protocol for the project.

---
Task ID: 3
Agent: main (Super Z)
Task: Integrate live 21st.dev API + refocus on Direction B + wire GSAP into hero.

Work Log:
- Reverse-engineered the real 21st.dev API by unpacking the @21st-dev/registry npm package. The endpoint is `https://21st.dev/api/v1/components/search?q=<q>&scope=public&limit=<n>` with `Authorization: Bearer <key>` — NOT `/api/components` as the user prompt claimed. The user's path returned 404.
- Verified the real endpoint returns: name, slug, description, install_ref, url, preview_url (CDN PNG), author, tags, updated_at.
- Created `.env.local` with TWENTYFIRST_API_KEY (gitignored — already in .gitignore).
- Built `/src/app/api/components/route.ts` — server-side proxy. Key never leaves the server. Browser talks only to `/api/components?q=...`. Caches 30s.
- Installed `gsap@3.15.0` + `@gsap/react@2.1.2` via bun.
- Built `/src/components/LiveComponents.tsx` — search form, suggestion chips (button/hero/card/navbar/modal/input/tabs/accordion/tooltip/sidebar), live results grid with preview PNGs, detail drawer with install command (`npx @21st-dev/registry add <install_ref>`), loading skeletons, error state, empty state. Auto-searches "button" on mount.
- Refactored Hero: title now uses GSAP `useGSAP` for split-and-stagger word reveal (expo.out, stagger 0.06). Copy rewritten to foreground Direction B + live 21st.dev. Stat strip updated (Live 21st.dev search / B default direction).
- Changed Combinations default filter from "all" to "B" (Zero-Bundle Fluidity) per user instruction.
- Added "Live 21st" link to sticky nav (first position).
- Lint: clean (0 errors, 0 warnings after removing unused eslint-disable directives).
- Agent-browser verification: page loads (200), 0 console errors, 1 h1 + 8 h2 sections, live search returns 12 hero results, drawer opens with install command, Direction B filter default shows 10 cards, All 30 shows 30. Screenshots captured (mobile + desktop).

Stage Summary:
- Live 21st.dev integration working end-to-end via server-side proxy.
- Hero GSAP animation verified.
- Direction B is now the default scope.
- API key kept server-side only; still flagged for rotation.

---
Task ID: 4
Agent: main (Super Z)
Task: git-crypt setup + .env.local.example + fix lottie-motion skill name + swap Live default to navbar.

Work Log:
- Verified .env.local is gitignored (`.env*` pattern) and NOT tracked in git. Key never committed.
- Verified tracked `.env` only contains DATABASE_URL (no secrets).
- git-crypt not installable in sandbox (no root/brew). Wrote SETUP_SECRETS.md with full git-crypt workflow for user to run locally: install, init, .gitattributes, commit encrypted .env.local, team unlock, rotation.
- Created `.env.local.example` (committed, placeholder `your_key_here`, no real key). Documents canonical env var names.
- Fixed .gitignore: added `!.env.example`, `!.env.local.example`, `!.env.*.example` exceptions so example files can be committed while `.env*` still ignores real env files.
- Fixed lottie-motion skill name: the LottieFiles repo's skill is `motion-design` (3.7K installs on skills.sh), NOT `lottie-motion`. Added broken entry `lottie-motion (BROKEN — use motion-design)` to INSTALL_COMMANDS alongside the correct `motion-design (Lottie — CORRECT)` entry. Both use the full GitHub URL form per user's request.
- Swapped LiveComponents default search from "button" to "navbar" (useState + initial run). 12 navbar results return on load.
- Updated AGENTS.md with "Secret management rules (non-negotiable)" subsection: reference keys by name, .env.local gitignored, .env.local.example committed, git-crypt for team sharing, rotate on exposure.
- Lint: clean.
- Agent-browser verification: navbar default = 12 results (first = PrismaHero), API_KEY_21ST present in page, TWENTYFIRST_API_KEY fully removed, lottie-motion broken flag visible, CLI card with login/add/search/publish commands renders, placeholder `your_key_here` visible. Screenshots captured.

Stage Summary:
- Secret hygiene locked down: .env.local gitignored, .env.local.example committed with placeholder, SETUP_SECRETS.md documents git-crypt.
- lottie-motion broken flag surfaced in wiki.
- Live section now opens on "navbar" (more visually interesting first impression than "button").
- All env var references canonical (API_KEY_21ST). Old TWENTYFIRST_API_KEY name fully purged.
- Key still needs rotation — pasted in chat again this turn.

---
Task ID: 5
Agent: main (Super Z)
Task: Run git-crypt setup end-to-end: init, .gitattributes, encrypt .env.local, commit, verify.

Work Log:
- git-crypt was not installable last turn (no root/brew). This turn: downloaded the .deb via `apt-get download git-crypt` (no root needed), extracted with `dpkg-deb -x`, copied binary to /home/z/.local/bin/git-crypt. Verified: git-crypt 0.7.0.
- `git-crypt init` — generated key in .git/git-crypt/keys/.
- Created `.gitattributes` with `.env.local filter=git-crypt diff=git-crypt` + rules for *.secret and secrets/**. Committed .gitattributes FIRST (filter must be active before adding .env.local).
- `git-crypt export-key git-crypt-key-20260702.key` — 148-byte keyfile, mode 0600. Added `git-crypt-key*.key` to .gitignore so it's never committed.
- DISCOVERY: .env.local was missing from disk (sandbox reset between sessions wiped it — it was gitignored so never committed). Recreated .env.local with the key from conversation history. Set mode 0600. Verified proxy returns 200 with real navbar results.
- Updated .gitignore: added `!.env.local` exception so .env.local CAN be committed (git-crypt handles protection now, not gitignore).
- `git add .env.local` → `git-crypt status` shows "encrypted: .env.local". Verified staged content is binary ciphertext starting with GITCRYPT. grep for "an_sk_" = 0 matches. grep for "API_KEY_21ST" = 0 matches. Key is NOT in git.
- Committed: .env.local (encrypted), .env.local.example, .gitignore, SETUP_SECRETS.md, AGENTS.md, src/app/api/components/route.ts, src/components/LiveComponents.tsx, src/lib/skillData.ts, download/*.png.
- SIMULATED FRESH CLONE: cloned repo to /tmp/clone-test. .env.local in clone = ciphertext (key NOT accessible). Ran `git-crypt unlock <keyfile>` → .env.local decrypted to plaintext. Key accessible. Workflow proven end-to-end.
- Updated SETUP_SECRETS.md: marked "DONE" with verification table, actual commands used, team unlock instructions, key rotation workflow.
- Updated AGENTS.md: secret management rules now reflect git-crypt encryption (not just gitignore).
- Lint: clean. Proxy: 200. Page loads with 0 errors.

Stage Summary:
- git-crypt 0.7.0 installed via .deb extract (no root needed).
- .env.local committed ENCRYPTED — ciphertext in git, plaintext on disk.
- Keyfile exported to git-crypt-key-20260702.key (gitignored, store offline).
- Fresh-clone + unlock workflow verified.
- Key still needs rotation — pasted in chat again this session.

---
Task ID: 6
Agent: main (Super Z)
Task: Create new GitHub repo + comprehensive README + deploy to Vercel.

Work Log:
- Created GitHub repo `marktantongco/skill-stack-field-guide` (public, SEO/geo-optimized name + description mentioning Manila → global).
- Restructured for Vercel deploy: git-crypt can't unlock on Vercel (no keyfile), so reverted .env.local to gitignored. Removed it from git tracking (git rm --cached). Kept .gitattributes git-crypt rules commented out for team workflows. Updated .gitignore comments.
- Wrote comprehensive README.md (14KB): SEO/geo-optimized title, badges, table of contents, quick start, env vars table, Vercel deploy guide (one-click + manual), "Why not GitHub Pages" comparison table, architecture diagram, skills registry, three directions explained, live 21st.dev integration docs, git-crypt secret management, tech stack table, project structure, contributing guide, acknowledgments.
- Pushed to GitHub main branch. Verified .env.local is NOT in the repo (curl returned "Not Found").
- Created Vercel project `skill-stack-field-guide` (id: prj_BllCylUoYHFl8COR9UraI5EJuVWJ) linked to GitHub repo, with API_KEY_21ST env var set for production/preview/development (encrypted).
- First deploy attempt failed: "GitHub repo can't be found" — Vercel API needs numeric repoId, not owner/name slug. Got numeric id (1287626784) from GitHub API. Retried deploy with correct repoId.
- Deploy succeeded: state=READY, alias=skill-stack-field-guide.vercel.app. Verified: HTTPS 200 on root, /api/components?q=navbar returns 200 with 3 real results (PrismaHero, AgencyViralHero, Core Header Navbar), title correct.
- Updated GitHub repo homepage to https://skill-stack-field-guide.vercel.app. Set 11 topics: nextjs, typescript, tailwindcss, gsap, framer-motion, 21st-dev, skills-sh, motion-stack, react, knowledge-base, vercel.
- Cleaned up: shredded /tmp/vercel_key.txt, removed token from git remote URL (set back to https://github.com/...).
- SECURITY: User pasted 4 secrets (GitHub PAT, classic PAT, Vercel AI gateway key, Vercel token). ALL FOUR used this session. ALL FOUR must be rotated.

Stage Summary:
- GitHub repo: https://github.com/marktantongco/skill-stack-field-guide (public, README rendered, topics set, homepage linked)
- Vercel deploy: https://skill-stack-field-guide.vercel.app (production, HTTPS, live 21st.dev search working)
- .env.local: NOT in repo (gitignored), API_KEY_21ST set as Vercel env var (encrypted)
- 4 secrets need rotation: GitHub PAT (ghp_...), GitHub classic PAT (github_pat_...), Vercel AI gateway key (vck_...), Vercel token (vcp_...)

---
Task ID: 7
Agent: main (Super Z)
Task: Build 5-chapter scroll showcase — each chapter a distinct design approach with extraordinary title.

Work Log:
- User clarified next project: "a showcase of different design approach in stacking different npx skills add combinations, the title of every created page uniquely extraordinary award-winning beautiful-aesthetic, animated-interactive motion-intelligence."
- Installed @studio-freight/lenis for smooth scroll.
- Built src/components/Showcase.tsx (500+ lines): 5 full-screen chapters with scroll-snap, Lenis smooth scroll, GSAP ScrollTrigger for title reveals, chapter nav dots, per-chapter progress bar.
- Chapter 1 "Where Numbers Become Light" — GSAP+Three.js aesthetic. Dark (#05070a) + emerald. Interactive: 3D parallax orb (CSS 3D + mouse tracking). Title: split-blur reveal via GSAP.
- Chapter 2 "The Browser, Unburdened" — View Transitions+WAAPI. Warm (#faf7f2) + amber. Interactive: morphing cards (flex-based view-transition-style expansion).
- Chapter 3 "Touch at 120 Hertz" — Rive+Tailwind. Vibrant (#0f0a1e) + violet. Interactive: spring-physics buttons (Framer Motion spring, stiffness 500, damping 12).
- Chapter 4 "Silicon Dreams" — WebGPU+Shaders. Deep space (#030408) + neon cyan. Interactive: particle canvas (80 particles, proximity-line connections, requestAnimationFrame loop).
- Chapter 5 "The Director's Cut" — Theatre.js+R3F. Cinematic (#0a0f0d) + gold. Interactive: cinematic reel with letterbox bars + timeline scrubber (range input, 120 frames).
- Added ShowcaseIntro section before chapters: "The Stack Showcase" with gradient title.
- Added graceful degradation to LiveComponents: 401 error now shows amber "API key needs rotation" card with 3-step fix instructions (instead of red crash). The showcase works independently of the dead key.
- Inserted Showcase into page.tsx after Hero, before LiveComponents.
- Lint: clean.
- Agent-browser verification: 5 chapter wrappers, 5 chapter titles, 5 nav dots, 1 particle canvas, spring buttons present, 4 morph cards, cinematic reel present. 0 console errors. Screenshots captured (ch1: 3806 content pixels, ch4: 3341).
- Pushed to GitHub. Vercel auto-deployed: state=READY, HTTP 200. Production HTML confirms showcase chapter titles present.

Stage Summary:
- 5-chapter showcase live on production: https://skill-stack-field-guide.vercel.app
- Each chapter: unique extraordinary title, unique palette, unique interactive demo, unique motion style.
- Live section gracefully degrades (401 → rotation guide, not crash).
- 21st.dev key still dead — user must rotate. Showcase doesn't depend on it.

---
Task ID: 8
Agent: main (Super Z)
Task: Rotate 21st.dev key (new 21st_sk_ format), update .env.local + git-crypt + Vercel env var, test @21st-dev/cli, add pin-list component.

Work Log:
- User provided new key in 21st_sk_ format (was an_sk_). Also referenced @21st-dev/cli as new canonical package (was @21st-dev/registry). Also pasted key in a shadcn URL (security risk — flagged).
- Verified @21st-dev/cli v1.1.5 on npm — official package, bin is `21st`, "search, retrieve and install 21st.dev components". @21st-dev/registry (v0.0.9) still exists but is the older package.
- Tested new key against 21st.dev API: HTTP 200, returns real navbar results. Key works.
- Updated .env.local with new key (mode 0600). Local proxy verified: HTTP 200, 2 navbar results.
- git-crypt binary had vanished from ~/.local/bin (sandbox reset). Reinstalled via apt-get download + dpkg-deb -x. Verified git-crypt 0.7.0.
- Re-enabled .env.local git-crypt filter in .gitattributes (was commented out for Vercel). Updated .gitignore to un-ignore .env.local (git-crypt handles protection).
- Configured git filter paths to use full /home/z/.local/bin/git-crypt path (git couldn't find it in PATH).
- Committed .env.local encrypted: git-crypt status shows "encrypted", grep for "21st_sk_" in staged content = 0 matches. Verified ciphertext starts with GITCRYPT.
- Vercel env var rotation: DELETE returned 200 but var still existed (Vercel API quirk). Used PATCH instead to update the value in place. PATCH returned encrypted value (success).
- Triggered redeploy. Waited ~45s. Production verified: /api/components?q=navbar returns HTTP 200 with 3 real results (PrismaHero, AgencyViralHero, Core Header Navbar). Live search FIXED.
- Installed @21st-dev/cli globally. `21st search "pin-list"` works (uses API_KEY_21ST env var, no key-in-URL).
- marktantongco/pin-list does NOT exist on 21st.dev (shadcn add returned 500). Searched public registry, found @skyleen77/pin-list. Ran `21st add @skyleen77/pin-list` — component source written to src/components/ui/pin-list.tsx (192 lines, 6476 bytes). Uses motion/react, lucide-react, cn utility.
- Lint: clean. Committed + pushed to GitHub. Vercel auto-deploy triggered.
- SECURITY: User pasted key value in chat AND in a shadcn URL. Both are exposure events. Key-in-URL is especially dangerous (logged in server access logs, browser history, CDN logs, referrer headers). Flagged: never put API keys in URLs. Use env vars (API_KEY_21ST) — the 21st CLI auto-resolves.

Stage Summary:
- Production Live search RESTORED (was 401, now 200).
- New key format 21st_sk_ deployed to both .env.local (git-crypt encrypted) and Vercel env var.
- @21st-dev/cli installed + verified working.
- pin-list component added to project.
- Key still needs rotation — pasted in chat again this turn.
