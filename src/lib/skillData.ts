// Skill Stack Knowledge-Base — canonical data
// All install counts verified against skills.sh leaderboard (captured 2026-07-02).

export type Direction = "A" | "B" | "C";

export interface Combo {
  id: number;
  dir: Direction;
  name: string;
  stack: string[];
  logic: string;
  constraint: string;
  mitigation: string;
  synergy: number; // /10
  mobile: "High" | "Moderate" | "Low" | "GPU-bound" | "Native-only";
}

export const DIRECTIONS: Record<Direction, { title: string; tagline: string; accent: string }> = {
  A: {
    title: "Silk & GPU",
    tagline: "Premium agency / portfolio. GSAP + Three.js + Rive + isolated Framer Motion.",
    accent: "emerald",
  },
  B: {
    title: "Zero-Bundle Fluidity",
    tagline: "Performance SaaS. CSS View Transitions + WAAPI + Tailwind + Popmotion.",
    accent: "amber",
  },
  C: {
    title: "Spatial Storytelling",
    tagline: "Immersive 3D wiki. Theatre.js + R3F + WebGPU + glTF.",
    accent: "teal",
  },
};

export const COMBOS: Combo[] = [
  // ---- Direction A: Silk & GPU ----
  { id: 1, dir: "A", name: "The Legendary Pair", stack: ["GSAP", "Three.js"], logic: "GSAP is a numerical interpolator; Three.js expects raw numbers in a render loop. GSAP mutates mesh.position.x imperatively, Three renders to WebGL — zero layout thrash.", constraint: "Letting GSAP trigger React setState to update Three.js — re-render storms.", mitigation: "Mutate Three.js props directly via GSAP; never round-trip through React state.", synergy: 10, mobile: "GPU-bound" },
  { id: 2, dir: "A", name: "Declarative 3D UI", stack: ["Three.js", "Framer Motion (via R3F)"], logic: "framer-motion-3d + React Three Fiber: <motion.mesh animate={{scale: active?1.5:1}}/> — declarative state-driven 3D UI.", constraint: "Vanilla Three.js + Framer Motion without R3F is awkward, high-friction.", mitigation: "Only use Framer Motion for state-driven UI transitions; keep complex 3D logic in useFrame.", synergy: 8, mobile: "Moderate" },
  { id: 3, dir: "A", name: "120Hz Micro-Tactions", stack: ["Rive", "Tailwind", "Custom JS"], logic: "Animation lives as a binary .riv state machine; JS just flips triggers. Near-zero CPU, files <1/10 of equivalent Lottie JSON.", constraint: "Designer-dependent — logic changes require the Rive editor, not code.", mitigation: "Co-locate designer + dev; version .riv files in git LFS.", synergy: 9, mobile: "High" },
  { id: 4, dir: "A", name: "Cinematic Scrollytelling", stack: ["Theatre.js", "React Three Fiber"], logic: "Theatre injects a studio timeline over your dev server; scrub cameras/lights visually, export production JSON.", constraint: "Heavy bundle; dev GUI must be stripped before prod.", mitigation: "Dynamic-import Theatre only in dev; tree-shake the studio in build.", synergy: 9, mobile: "Moderate" },
  { id: 5, dir: "A", name: "Buttery Scroll", stack: ["GSAP ScrollTrigger", "Lenis"], logic: "Lenis handles smooth wheel inertia; ScrollTrigger reads Lenis's scroll position to drive timelines. Frame-perfect sync.", constraint: "Double rAF loops (Lenis + ScrollTrigger) can double-render on Safari.", mitigation: "Use ScrollTrigger.scrollerProxy + Lenis.on('scroll', ScrollTrigger.update) — single source of truth.", synergy: 9, mobile: "High" },
  { id: 6, dir: "A", name: "Kinetic Type over UI", stack: ["GSAP SplitText", "Framer Motion (isolated)"], logic: "GSAP owns the SVG/text nodes; Framer Motion owns the surrounding UI layout. They never touch the same DOM node.", constraint: "If both target the same element → inline-style collision, jitter, snap-back.", mitigation: "Hard partition: GSAP on .kinetic-text, Framer on .ui-shell. Lint rule enforces.", synergy: 7, mobile: "High" },
  { id: 7, dir: "A", name: "Compressed 3D", stack: ["Three.js", "glTF", "DRACO"], logic: "DRACO-mesh-compressed glTF loads 10× smaller; Three.js GLTFLoader + DRACOLoader decodes on the fly.", constraint: "Decode is CPU-bound — first paint stalls on low-end mobile.", mitigation: "Show progressive placeholder; decode in Web Worker via OffscreenCanvas.", synergy: 8, mobile: "GPU-bound" },
  { id: 8, dir: "A", name: "State-Machine Onboarding", stack: ["Rive", "React State Machine"], logic: "Rive exposes state inputs (isHovered, step); React updates inputs, Rive interpolates internally at 120Hz.", constraint: "Limited branching logic — complex flows need many states.", mitigation: "Keep Rive to ≤12 states; branch in React, swap .riv files per branch.", synergy: 8, mobile: "High" },
  { id: 9, dir: "A", name: "Shape Morphing", stack: ["GSAP", "MorphSVG"], logic: "MorphSVG interpolates between SVG paths with matching point counts; GSAP timelines the morph.", constraint: "Mismatched point counts produce ugly intermediate shapes.", mitigation: "Pre-process paths to equal points; use MorphSVG's shapeIndex:'auto'.", synergy: 8, mobile: "High" },
  { id: 10, dir: "A", name: "Minimal 3D Footprint", stack: ["OGL", "GSAP"], logic: "OGL is a 6kb Three.js alternative; GSAP drives the uniform values. Sub-30kb total 3D payload.", constraint: "Smaller API surface — advanced features missing.", mitigation: "Fallback to Three.js only when OGL API gaps block a feature.", synergy: 7, mobile: "High" },

  // ---- Direction B: Zero-Bundle Fluidity ----
  { id: 11, dir: "B", name: "Native SPA Transitions", stack: ["CSS View Transitions", "Tailwind"], logic: "Browser snapshots old DOM, morphs to new on route change — zero JS, hardware-composited.", constraint: "Browser support gaps (Firefox <2024); less granular than JS timelines.", mitigation: "@supports (view-transition-name) guard + progressive enhancement.", synergy: 9, mobile: "High" },
  { id: 12, dir: "B", name: "Native C++ Timeline", stack: ["WAAPI", "CSS Custom Properties"], logic: "element.animate() runs on the browser's native compositor — same perf as CSS, but with JS play/pause/seek/reverse.", constraint: "No spring physics out of the box; easing must be cubic-bezier.", mitigation: "Pair with Popmotion for spring; WAAPI for the actual render.", synergy: 8, mobile: "High" },
  { id: 13, dir: "B", name: "Framework-Agnostic Physics", stack: ["Popmotion", "Vanilla JS"], logic: "Popmotion is the pure-math core behind Framer Motion — springs, decay, pointers — no Virtual DOM weight.", constraint: "No React bindings; you wire it yourself.", mitigation: "Wrap in a 30-line usePopMotion hook; or use Motion One (Popmotion's DOM wrapper).", synergy: 7, mobile: "High" },
  { id: 14, dir: "B", name: "Tactile Drag Physics", stack: ["React Spring", "HTML Canvas"], logic: "Spring physics (mass/tension/friction) respond to swipe velocity — no jarring cuts when interrupted mid-gesture.", constraint: "Cascading springs across many elements → unpredictable settling.", mitigation: "Cap concurrent springs; use useSprings with a single config object.", synergy: 8, mobile: "High" },
  { id: 15, dir: "B", name: "Staggered Micro-Interactions", stack: ["Anime.js v4", "CSS Variables"], logic: "Anime.js v4 targets CSS vars natively; stagger() sequences UI reveals without React state churn.", constraint: "No native scroll-timeline engine — manual event rigging for parallax.", mitigation: "Add GSAP ScrollTrigger ONLY for scroll; Anime for everything else.", synergy: 7, mobile: "High" },
  { id: 16, dir: "B", name: "App Layout Routing", stack: ["Tailwind", "Framer Motion (UI only)"], logic: "Framer Motion's AnimatePresence handles route exits; Tailwind handles the visual system.", constraint: "Bundle ~30kb for Framer Motion — not truly zero.", mitigation: "Import motion/m only (tree-shake AnimatePresence if unused).", synergy: 8, mobile: "High" },
  { id: 17, dir: "B", name: "Native Scroll Animations", stack: ["CSS @scroll-timeline", "position: sticky"], logic: "Browser-native scroll-linked animations — animation-timeline: scroll() — zero JS.", constraint: "Chrome/Safari only as of 2025; Firefox behind flag.", mitigation: "@supports guard + IntersectionObserver fallback.", synergy: 8, mobile: "High" },
  { id: 18, dir: "B", name: "Card-to-Modal Morph", stack: ["View Transitions", "Shared Element"], logic: "view-transition-name on card and modal; browser morphs between them on state change.", constraint: "Only one element can have a given name per snapshot — collisions break the morph.", mitigation: "Dynamically assign names; clear them after transitionend.", synergy: 9, mobile: "High" },
  { id: 19, dir: "B", name: "Reveal-on-Scroll, Zero Deps", stack: ["WAAPI", "IntersectionObserver"], logic: "IO fires once → element.animate() plays reveal. ~400 bytes of JS, native compositor perf.", constraint: "No stagger built-in — you sequence manually.", mitigation: "Tiny helper: io callback delays .animate() by index*50ms.", synergy: 8, mobile: "High" },
  { id: 20, dir: "B", name: "Utility-First Velocity", stack: ["Hype React", "Tailwind"], logic: "Declarative string variants replace motion hooks; Tailwind handles layout.", constraint: "No canvas/WebGL/procedural pipeline — shallow ceiling.", mitigation: "Use for marketing pages; graduate to GSAP when you hit the ceiling.", synergy: 6, mobile: "High" },

  // ---- Direction C: Spatial Storytelling ----
  { id: 21, dir: "C", name: "Raw GPU Compute", stack: ["WebGPU Shaders (WGSL)", "Vanilla Canvas"], logic: "WGSL compiles on the GPU; compute shaders push millions of particles at 120fps on mid-range mobile.", constraint: "Steep learning curve — matrix math, vector pipelines, low-level code.", mitigation: "Start from a known-good WGSL template; iterate one uniform at a time.", synergy: 10, mobile: "GPU-bound" },
  { id: 22, dir: "C", name: "Rapid 3D Interactive", stack: ["Spline", "React (Spline Runtime)"], logic: "Designer builds scene + hover/click states in Spline web app; dev embeds via @splinetool/react-spline.", constraint: "Custom optimization limited vs. vanilla Three.js; heavy geometry drops frames on old mobile.", mitigation: "Cap polygon count in Spline; lazy-load the runtime below the fold.", synergy: 8, mobile: "Moderate" },
  { id: 23, dir: "C", name: "Spatial VR/AR Pipeline", stack: ["Blender", "glTF", "WebXR"], logic: "Blender models → glTF (DRACO) → WebXR session. Browser-native VR/AR without app stores.", constraint: "WebXR device fragmentation; Quest browser ≠ Safari visionOS.", mitigation: "Feature-detect navigator.xr; provide 6DoF fallback to 3DoF to mouse-orbit.", synergy: 8, mobile: "Native-only" },
  { id: 24, dir: "C", name: "2D Physics Playground", stack: ["PixiJS", "Matter.js"], logic: "Matter.js computes rigid-body collisions/gravity/friction; PixiJS renders sprites via WebGL.", constraint: "2D-only; doesn't scale to UI dashboard controls.", mitigation: "Reserve for marketing/games; use DOM for product UI.", synergy: 8, mobile: "High" },
  { id: 25, dir: "C", name: "Vector Explainer, Low Memory", stack: ["Lottie-Light", "Skia/Canvas"], logic: "dotLottie binary + canvas runtime bypasses DOM inflation that bloats memory on mobile webviews.", constraint: "Limited interactive inputs vs. Rive; multi-variable state is brittle.", mitigation: "Treat Lottie as playback-only; trigger state via play/stop segments.", synergy: 7, mobile: "High" },
  { id: 26, dir: "C", name: "iOS Native Spatial", stack: ["SwiftUI Motion", "Metal"], logic: "SwiftUI declarative transitions + Metal shaders for pixel warps/fluid distortions. Scales to visionOS.", constraint: "Apple-only; no web target.", mitigation: "Mirror web counterpart with Three.js + postprocessing for cross-platform.", synergy: 9, mobile: "Native-only" },
  { id: 27, dir: "C", name: "Cinema-Grade Spatial", stack: ["Cinema4D / Blender", "glTF", "WebXR"], logic: "Cinema-grade modeling → optimized glTF → WebXR. Spatial computing ready, browser-delivered.", constraint: "Asset pipelines are slow; large files hurt mobile load.", mitigation: "Progressive mesh LODs; KTX2 textures; load on XR session start.", synergy: 8, mobile: "GPU-bound" },
  { id: 28, dir: "C", name: "Cinematic Post-FX", stack: ["Three.js", "Postprocessing (bloom/DOF)"], logic: "EffectComposer chains bloom/DOF/chromatic-aberration passes over the WebGL render target.", constraint: "Each pass = extra GPU draw call; mobile thermal throttling.", mitigation: "Adaptive quality: drop passes when frame-time > 16ms.", synergy: 8, mobile: "GPU-bound" },
  { id: 29, dir: "C", name: "Declarative 3D UI Suite", stack: ["React Three Fiber", "Drei", "Framer Motion 3D"], logic: "R3F = Three as JSX; Drei = helpers; Framer Motion 3D = motion on meshes. Full declarative 3D UI.", constraint: "Bundle 100kb+; reconciler overhead on rapid state churn.", mitigation: "useFrame for per-frame logic; instancing for repeated geometry.", synergy: 9, mobile: "Moderate" },
  { id: 30, dir: "C", name: "The Full Toolkit", stack: ["GSAP", "Three.js (imperative)", "Lenis"], logic: "GSAP drives Three uniforms imperatively; Lenis owns scroll; Three renders. The industry-standard creative stack.", constraint: "Steep learning curve; bundle 200kb+; mobile perf needs discipline.", mitigation: "Code-split; adaptive DPR; pause render loop off-screen.", synergy: 10, mobile: "GPU-bound" },
];

// ---------------- Synergy Matrix (motion-stack pairings) ----------------
export interface MatrixRow {
  stack: string;
  synergy: number; // /10
  risk: "Low" | "Medium-Low" | "Medium" | "High" | "Critical";
  mobile: string;
  bestFor: string;
  note: string;
}

export const MATRIX: MatrixRow[] = [
  { stack: "GSAP + Three.js", synergy: 10, risk: "Low", mobile: "High (GPU-bound)", bestFor: "Immersive 3D storytelling, custom WebGL", note: "Industry standard. Imperative numerical feed to render loop." },
  { stack: "Three.js + Framer Motion (R3F)", synergy: 8, risk: "Medium-Low", mobile: "Moderate-High", bestFor: "3D UI components, micro-interactions in React", note: "Only via framer-motion-3d + R3F. Vanilla Three + FM is awkward." },
  { stack: "GSAP + Remotion", synergy: 4, risk: "High", mobile: "N/A (render-time)", bestFor: "Video automation w/ procedural timelines", note: "Frame-locked vs time-locked. Kill GSAP ticker, feed Remotion frame manually." },
  { stack: "GSAP + Framer Motion", synergy: 2, risk: "Critical", mobile: "Poor (jitter)", bestFor: "AVOID — redundant DOM mutation engines", note: "Declarative vs imperative collide on same node. Partition by element." },
  { stack: "Rive + Tailwind + Custom JS", synergy: 9, risk: "Low", mobile: "High (120Hz)", bestFor: "App UI micro-interactions, game-like UI", note: ".riv binary state machine; near-zero CPU." },
  { stack: "Theatre.js + Three.js / R3F", synergy: 9, risk: "Medium", mobile: "Moderate", bestFor: "Cinematic scrollytelling, browser intros", note: "Visual timeline studio in dev; export JSON for prod." },
  { stack: "WebGPU + Shaders (WGSL) + Vanilla JS", synergy: 10, risk: "Medium", mobile: "GPU-bound", bestFor: "Generative graphics, fluid sims, millions of particles", note: "Raw hardware speed. Steep math curve." },
  { stack: "Anime.js v4 + CSS Variables", synergy: 7, risk: "Low", mobile: "High", bestFor: "Kinetic typography, dashboards, SVG morphs", note: "Lightweight, modular. No native scroll engine." },
  { stack: "CSS View Transitions + Tailwind", synergy: 9, risk: "Low", mobile: "High", bestFor: "SPA routing, card-to-modal morphs", note: "Zero bundle. Native compositor." },
  { stack: "Spline + React", synergy: 8, risk: "Medium", mobile: "Moderate", bestFor: "SaaS product demos, 3D landing pages", note: "Fastest design→deploy for 3D. Limited optimization." },
  { stack: "React Spring + HTML Canvas", synergy: 8, risk: "Medium", mobile: "High", bestFor: "Drag-and-drop, sliders, pull-to-refresh", note: "Physics responds to swipe velocity. Cascading springs = unpredictable." },
  { stack: "Lottie-Light + Skia/Canvas", synergy: 7, risk: "Low", mobile: "High", bestFor: "Illustrated walkthroughs, splash screens", note: "Canvas path slashes DOM memory. Less interactive than Rive." },
  { stack: "PixiJS + Matter.js", synergy: 8, risk: "Low", mobile: "High", bestFor: "2D canvas games, physics marketing pages", note: "Matter.js collisions + PixiJS WebGL sprites." },
  { stack: "Hype React + Tailwind", synergy: 6, risk: "Low", mobile: "High", bestFor: "Rapid prototyping, e-commerce interactions", note: "High dev velocity. Shallow ceiling — no canvas/WebGL." },
  { stack: "Popmotion + Vanilla JS", synergy: 7, risk: "Low", mobile: "High", bestFor: "Custom input tracking, dials, scroll physics", note: "Pure math, framework-agnostic. No React bindings." },
  { stack: "Figma Motion + CSS/React", synergy: 7, risk: "Medium", mobile: "High", bestFor: "Rapid UI prototyping, design systems", note: "Native Figma timeline → CSS/JSON/React primitives." },
  { stack: "SwiftUI Motion + Metal", synergy: 9, risk: "Low", mobile: "Native-only", bestFor: "Premium iOS/visionOS apps, spatial widgets", note: "Apple ecosystem only. Metal shaders for pixel warps." },
  { stack: "C4D/Blender + glTF + WebXR", synergy: 8, risk: "Medium", mobile: "GPU-bound", bestFor: "VR/AR try-ons, spatial architectural layouts", note: "Spatial compute pipeline. Device fragmentation risk." },
  { stack: "WAAPI + CSS Custom Properties", synergy: 8, risk: "Low", mobile: "High", bestFor: "Performance-critical SaaS, enterprise (no 3rd-party libs)", note: "Zero bytes. Native C++ compositor + JS timeline control." },
  { stack: "GSAP + Lenis (ScrollTrigger)", synergy: 9, risk: "Low", mobile: "High", bestFor: "Scroll-driven narrative sites", note: "Lenis inertia + ScrollTrigger timelines. Single rAF source." },
];

// ---------------- Skills Registry ----------------
export interface SkillRow {
  skill: string;
  install: string;
  popularity: string; // installs
  useCase: string;
  platform: "Web" | "Mobile" | "Both" | "Meta";
  community: string;
  year: string;
  impact: "Critical" | "High" | "Medium" | "Emerging" | "Low";
  note?: string;
}

export const SKILLS: SkillRow[] = [
  { skill: "find-skills", install: "npx skills add vercel-labs/skills --skill find-skills", popularity: "2.3M", useCase: "Skill discovery meta-tool", platform: "Meta", community: "Vercel Labs (official)", year: "2025", impact: "Critical", note: "#1 on leaderboard. Discovers skills by intent." },
  { skill: "frontend-design", install: "npx skills add anthropics/skills --skill frontend-design", popularity: "614.7K", useCase: "Frontend design guidance", platform: "Web", community: "Anthropic (official)", year: "2025", impact: "High" },
  { skill: "vercel-react-best-practices", install: "npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices", popularity: "518.5K", useCase: "React/Next.js patterns", platform: "Web", community: "Vercel (official)", year: "2025", impact: "High" },
  { skill: "agent-browser", install: "npx skills add vercel-labs/agent-browser --skill agent-browser", popularity: "503.7K", useCase: "Headless browser automation", platform: "Web", community: "Vercel (official)", year: "2025", impact: "High" },
  { skill: "remotion-best-practices", install: "npx skills add remotion-dev/skills --skill remotion-best-practices", popularity: "403.1K", useCase: "Programmatic video", platform: "Web", community: "Remotion (official)", year: "2025", impact: "High" },
  { skill: "web-design-guidelines", install: "npx skills add vercel-labs/agent-skills --skill web-design-guidelines", popularity: "431.0K", useCase: "Design rules enforcement", platform: "Web", community: "Vercel (official)", year: "2025", impact: "High" },
  { skill: "tdd", install: "npx skills add mattpocock/skills --skill tdd", popularity: "338.4K", useCase: "Test-driven development", platform: "Meta", community: "Matt Pocock", year: "2025", impact: "High" },
  { skill: "sleek-design-mobile-apps", install: "npx skills add sleekdotdesign/agent-skills --skill sleek-design-mobile-apps", popularity: "310.0K", useCase: "Mobile app design systems", platform: "Mobile", community: "Sleek Design", year: "2025", impact: "High" },
  { skill: "skill-creator", install: "npx skills add anthropics/skills --skill skill-creator", popularity: "296.9K", useCase: "Author new skills", platform: "Meta", community: "Anthropic (official)", year: "2025", impact: "High" },
  { skill: "ui-ux-pro-max", install: "npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max", popularity: "245.3K", useCase: "Design-system + contrast + a11y enforcement", platform: "Both", community: "nextlevelbuilder", year: "2025", impact: "High", note: "Foundational Core #1. 19 skills in repo." },
  { skill: "gsap-core", install: "npx skills add greensock/gsap-skills --skill gsap-core", popularity: "30.5K", useCase: "GSAP animation primitives", platform: "Both", community: "GreenSock (official)", year: "2025", impact: "Critical" },
  { skill: "gsap-scrolltrigger", install: "npx skills add greensock/gsap-skills --skill gsap-scrolltrigger", popularity: "29.1K", useCase: "Scroll-driven timelines", platform: "Both", community: "GreenSock (official)", year: "2025", impact: "Critical" },
  { skill: "gsap-performance", install: "npx skills add greensock/gsap-skills --skill gsap-performance", popularity: "28.1K", useCase: "GSAP perf optimization", platform: "Both", community: "GreenSock (official)", year: "2025", impact: "High" },
  { skill: "gsap-react", install: "npx skills add greensock/gsap-skills --skill gsap-react", popularity: "26.5K", useCase: "@gsap/react useGSAP hook", platform: "Web", community: "GreenSock (official)", year: "2025", impact: "High" },
  { skill: "react:components", install: "npx skills add google-labs-code/stitch-skills --skill react:components", popularity: "50.4K", useCase: "React component generation", platform: "Web", community: "Google Labs", year: "2025", impact: "High" },
  { skill: "design-md", install: "npx skills add google-labs-code/stitch-skills --skill design-md", popularity: "52.1K", useCase: "Design-markdown spec authoring", platform: "Both", community: "Google Labs", year: "2025", impact: "High" },
  { skill: "stitch-loop", install: "npx skills add google-labs-code/stitch-skills --skill stitch-loop", popularity: "46.1K", useCase: "Design iteration loop", platform: "Both", community: "Google Labs", year: "2025", impact: "High" },
  { skill: "stitch-design", install: "npx skills add google-labs-code/stitch-skills --skill stitch-design", popularity: "25.3K", useCase: "Design generation from prompt", platform: "Both", community: "Google Labs", year: "2025", impact: "High", note: "Foundational Core #2." },
  { skill: "framer-motion-animator", install: "npx skills add patricio0312rev/skills --skill framer-motion-animator", popularity: "7.3K", useCase: "Framer Motion animation patterns", platform: "Both", community: "patricio0312rev (community)", year: "2025", impact: "Medium" },
  { skill: "motion-design", install: "npx skills add LottieFiles/motion-design-skill --skill motion-design", popularity: "3.7K", useCase: "Lottie vector motion", platform: "Both", community: "LottieFiles (official)", year: "2025", impact: "Medium" },
  { skill: "21st-dev-builder-v2", install: "npx skills add trin-zenityx/21st-dev-builder-v2 --skill 21st-dev-builder-v2", popularity: "327", useCase: "21st.dev component builder", platform: "Web", community: "trin-zenityx (fork)", year: "2025", impact: "Low" },
  { skill: "21st-registry", install: "npx skills add 21st-dev/registry --skill 21st-registry", popularity: "124", useCase: "21st.dev component registry install", platform: "Web", community: "21st.dev (official)", year: "2025", impact: "Emerging", note: "⚠️ The skill name is '21st-registry', NOT '21st-dev-components'. Your prompt's --skill flag will fail. Foundational Core #3." },
  { skill: "supanova-premium-aesthetic", install: "npx skills add uxjoseph/supanova-design-skill --skill supanova-premium-aesthetic", popularity: "152", useCase: "Premium aesthetic design engine", platform: "Both", community: "uxjoseph (new)", year: "2025", impact: "Emerging" },
];

// ---------------- Foundational Cores: Top 5 Synergies each ----------------
export interface CoreSynergy {
  pair: string;
  rating: number; // /10
  why: string;
  risk: string;
}

export interface Core {
  id: string;
  name: string;
  install: string;
  role: string;
  top5: CoreSynergy[];
}

export const CORES: Core[] = [
  {
    id: "ui-ux-pro-max",
    name: "ui-ux-pro-max",
    install: "npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max",
    role: "Design-system, contrast, and accessibility enforcement layer. Acts as a quality gate on every visual decision.",
    top5: [
      { pair: "ui-ux-pro-max + framer-motion-animator", rating: 9, why: "Spring physics respect WCAG contrast during movement; the design-system gate rejects motion that drops contrast below AA.", risk: "Spring overshoot can momentarily clip text out of safe contrast zones — mitigate with prefers-reduced-motion fallback." },
      { pair: "ui-ux-pro-max + gsap-scrolltrigger", rating: 9, why: "Scroll narratives stay accessible: the gate enforces focus traps, pause-on-hover, and reduced-motion alternatives for every ScrollTrigger scene.", risk: "Heavy scroll scenes can still cause vestibular discomfort — always provide a static fallback." },
      { pair: "ui-ux-pro-max + stitch-design", rating: 8, why: "Generated designs auto-pass the design-system gate before reaching code; bad tokens get rejected at generation time.", risk: "If stitch-design's token vocabulary drifts from your design system, generations silently fail the gate — keep tokens in sync." },
      { pair: "ui-ux-pro-max + 21st-registry", rating: 8, why: "Every installed component is vetted against your brand system on import — no rogue shadows or off-palette colors ship.", risk: "21st components assume their own design tokens; remap before the gate runs or it rejects everything." },
      { pair: "ui-ux-pro-max + CSS View Transitions", rating: 8, why: "Zero-bundle layout morphs still pass contrast checks; the gate inspects both start and end states of every transition.", risk: "Mid-transition interpolated frames can briefly break contrast — the gate flags these as warnings, not errors." },
    ],
  },
  {
    id: "stitch-design",
    name: "stitch-design",
    install: "npx skills add google-labs-code/stitch-skills --skill stitch-design",
    role: "Google Labs design generation — prompt → production-ready design markdown + component spec.",
    top5: [
      { pair: "stitch-design + react:components", rating: 10, why: "Same repo, native pairing. stitch-design emits design-md; react:components compiles it to React. Zero translation loss.", risk: "Tightly coupled — upgrading one without the other breaks the pipeline. Pin versions together." },
      { pair: "stitch-design + shadcn-ui", rating: 9, why: "Generated designs map 1:1 to shadcn primitives; the skill outputs the exact component + variant names shadcn expects.", risk: "Custom shadcn theme variants won't be picked up unless you register them in stitch's design-md." },
      { pair: "stitch-design + ui-ux-pro-max", rating: 8, why: "Quality gate on generated output — bad contrast, weak hierarchy, or off-system tokens get rejected before code.", risk: "Over-strict gates can reject valid exploratory designs — tune the gate per project phase." },
      { pair: "stitch-design + gsap-core", rating: 7, why: "Generated components ship with motion hooks pre-wired; gsap-core provides the primitives.", risk: "Generated motion is generic — you'll hand-tune 80% of timelines for production polish." },
      { pair: "stitch-design + remotion", rating: 7, why: "Design → video pipeline: stitch generates the visual spec, remotion renders it to MP4.", risk: "Frame-locked Remotion conflicts with any real-time motion stitch embeds — strip live animation before render." },
    ],
  },
  {
    id: "21st-registry",
    name: "21st-registry",
    install: "npx skills add 21st-dev/registry --skill 21st-registry",
    role: "21st.dev component registry install. Pulls production React components by ID. (Note: skill name is '21st-registry', not '21st-dev-components'.)",
    top5: [
      { pair: "21st-registry + ui-ux-pro-max", rating: 8, why: "Every imported component passes the design-system gate on install — no off-brand components leak in.", risk: "21st components bundle their own tokens; remap before gate or mass-rejection." },
      { pair: "21st-registry + react:components", rating: 8, why: "Generate-then-install loop: react:components writes the component, 21st-registry publishes and re-installs across projects.", risk: "Round-trip can introduce drift — diff the generated vs installed versions." },
      { pair: "21st-registry + Tailwind CSS", rating: 8, why: "Installed components are Tailwind-native; styling stays consistent with your existing utility setup.", risk: "21st components may use Tailwind v3 syntax — port to v4 if needed." },
      { pair: "21st-registry + framer-motion-animator", rating: 7, why: "Add motion to installed components without ejecting them; the animator skill patches motion props onto registry components.", risk: "Patches break on component updates — pin registry versions." },
      { pair: "21st-registry + stitch-design", rating: 7, why: "Design → registry install loop: stitch generates a design, you publish it to your 21st registry fork, then install across your portfolio.", risk: "Private registry forks need auth — set TWENTYFIRST_API_KEY in .env.local." },
    ],
  },
];

// ---------------- Install commands (copy-to-clipboard) ----------------
export const INSTALL_COMMANDS: { label: string; cmd: string; verified: boolean }[] = [
  { label: "ui-ux-pro-max", cmd: "npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max", verified: true },
  { label: "21st-dev-components (BROKEN — use 21st-registry)", cmd: "npx skills add 21st-dev/registry --skill 21st-dev-components", verified: false },
  { label: "21st-registry (CORRECT)", cmd: "npx skills add 21st-dev/registry --skill 21st-registry", verified: true },
  { label: "21st-dev-builder-v2", cmd: "npx skills add trin-zenityx/21st-dev-builder-v2 --skill 21st-dev-builder-v2", verified: true },
  { label: "stitch-loop", cmd: "npx skills add google-labs-code/stitch-skills --skill stitch-loop", verified: true },
  { label: "stitch-design", cmd: "npx skills add google-labs-code/stitch-skills --skill stitch-design", verified: true },
  { label: "react:components", cmd: "npx skills add google-labs-code/stitch-skills --skill react:components", verified: true },
  { label: "gsap-core", cmd: "npx skills add greensock/gsap-skills --skill gsap-core", verified: true },
  { label: "gsap-scrolltrigger", cmd: "npx skills add greensock/gsap-skills --skill gsap-scrolltrigger", verified: true },
  { label: "framer-motion-animator", cmd: "npx skills add patricio0312rev/skills --skill framer-motion-animator", verified: true },
  { label: "motion-design (Lottie)", cmd: "npx skills add LottieFiles/motion-design-skill --skill motion-design", verified: true },
  { label: "supanova-premium-aesthetic", cmd: "npx skills add uxjoseph/supanova-design-skill --skill supanova-premium-aesthetic", verified: true },
];
