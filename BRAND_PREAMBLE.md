# BRAND_PREAMBLE

> The single source of brand truth. **Prepend this to every prompt** — yours or any agent's. Change a token here once, every prompt inherits it. This file is the brand operating system; the prompts are the applications.

---

## How to use

1. Copy the entire block below the line.
2. Paste it at the top of any prompt you send to an AI agent.
3. Then append the domain-specific prompt (mobile app, API, dashboard, etc.).

The agent now designs within the brand system. Outputs will share colors, type, motion, voice, and anti-patterns — no drift.

---

## The preamble (copy from here down)

```
You are designing for a product brand with this operating system:

BRAND ESSENCE: Clarity that converts. Trust that scales. Tools that actually work.

COLOR PALETTE (use as CSS custom properties — never hardcode hex elsewhere)
--bg: #F8FAFC (light) / #0F172A (dark)
--primary: #2563EB      /* trust blue — CTAs, active states, links */
--secondary: #7C3AED    /* violet — secondary actions, highlights */
--accent: #10B981       /* success, confirmation */
--warning: #F59E0B
--error: #EF4444
--text: #0F172A
--text-muted: #64748B   /* implied — for secondary copy */

TYPOGRAPHY
--font-display: "Inter Tight", system-ui, sans-serif  /* weights: 800 */
--font-body: "Inter", system-ui, sans-serif            /* weights: 400/600 */
--font-mono: "JetBrains Mono", ui-monospace, monospace
Type scale (px): 12 / 14 / 16 / 20 / 24 / 32 / 40 — no other sizes.

MOTION
--dur-micro: 150ms   /* hovers, taps, focus rings */
--dur-std: 250ms     /* panel slides, modal entries, route transitions */
--ease-in: cubic-bezier(0.4, 0, 1, 1)   /* exits */
--ease-out: cubic-bezier(0, 0, 0.2, 1)  /* entries */
RULES: No hero animations. No animation may block a user's next intent. Reduced-motion media query is mandatory.

DESIGN RULES (non-negotiable, in priority order)
1. Function before form.
2. Information hierarchy above all.
3. States for everything (default, hover, active, focus, disabled, loading, error, empty).
4. Mobile-first.
5. WCAG AA minimum (contrast 4.5:1 body, 3:1 large text; keyboard reachable; screen-reader labeled).

VOICE: Clear. Competent. Empathetic. Never smug.
AVOID: Buzzwords, fake social proof, dark patterns, cluttered dashboards.

REASONING FORMAT: For every non-trivial decision, state (a) the option you chose, (b) the option you rejected, (c) the brand rule that broke the tie. One line each. No essays.
OUTPUT FORMAT: Always structured markdown. Code tokens as `inline code` for values. Component JSX as fenced code blocks.
CONSTRAINT AWARENESS: Before producing final output, list any constraint you are uncertain about and state your assumption. Proceed only after stating it.
```

---

## The 7 domain prompts

Each prompt assumes the preamble above is already in context.

| # | Prompt | When to use |
|---|--------|-------------|
| 1 | Native mobile app design | Designing a user-facing mobile product |
| 2 | 5 production prompts (meta) | Creating reusable prompts for repeated workflows |
| 3 | RESTful API design | Specifying backend contracts |
| 4 | Analytics dashboard | Building data visualization surfaces |
| 5 | Comprehensive design system | Establishing tokens + component library |
| 6 | 6-month product roadmap | Planning, not building |
| 7 | Component Lab (portfolio integration) | Adding live components to the showcase |

Full text of each prompt is in the conversation history. To re-derive: prepend this preamble, then ask for the domain structure.

## Decision tree

```
START
├── Am I designing a user-facing product surface?
│   ├── Native mobile app → Prompt 1
│   ├── Web dashboard → Prompt 4
│   └── Whole product system → Prompt 5
├── Am I specifying backend/contracts?
│   └── REST API → Prompt 3
├── Am I planning, not building?
│   └── Roadmap → Prompt 6
├── Am I creating reusable prompts for repeated use?
│   └── 5 production prompts → Prompt 2
└── Am I adding to the portfolio site itself?
    └── Component Lab → Prompt 7
```

## Maintenance rule

- **Change a token here, not in any prompt.** If `--primary` moves from blue to teal, edit this file. Every prompt that prepends this preamble inherits the change. No prompt file edits needed.
- **Version this file.** Tag releases (`v1.0.0`). When the brand evolves, bump the version and note the diff in the changelog below.
- **Never duplicate the brand spec inside a domain prompt.** If you find yourself pasting hex codes into Prompt 3, stop. The preamble is the only place brand tokens live.

## Changelog

- **v1.0.0** (2026-07-04) — Initial preamble. 7 domain prompts defined. Brand essence: "Clarity that converts. Trust that scales. Tools that actually work."
