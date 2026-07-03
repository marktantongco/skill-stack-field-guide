"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { ArrowDown, Cpu, Sparkles, Zap, Film, Globe, Box } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ================================================================== */
/* Chapter data — each is a distinct design approach + skill stack    */
/* ================================================================== */

interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  stack: string[];
  synergy: number;
  install: string;
  aesthetic: string;
  palette: { bg: string; fg: string; accent: string; glow: string };
}

const CHAPTERS: Chapter[] = [
  {
    id: "numbers-become-light",
    number: "01",
    title: "Where Numbers\nBecome Light",
    subtitle: "GSAP feeds raw numbers to Three.js. The render loop never touches the DOM. This is the industry standard for immersive 3D — cinematic, GPU-bound, limitless.",
    stack: ["GSAP", "Three.js", "ScrollTrigger"],
    synergy: 10,
    install: "npx skills add greensock/gsap-skills --skill gsap-core",
    aesthetic: "Dark · Volumetric · Cinematic",
    palette: { bg: "#05070a", fg: "#e6f4ea", accent: "#34d399", glow: "rgba(52,211,153,0.25)" },
  },
  {
    id: "browser-unburdened",
    number: "02",
    title: "The Browser,\nUnburdened",
    subtitle: "CSS View Transitions snapshot the old DOM and morph it into the new — zero JavaScript, hardware-composited. WAAPI adds native timeline control. The lightest stack that still feels alive.",
    stack: ["View Transitions", "WAAPI", "Tailwind 4"],
    synergy: 9,
    install: "npx skills add vercel-labs/agent-skills --skill web-design-guidelines",
    aesthetic: "Warm · Airy · Native",
    palette: { bg: "#faf7f2", fg: "#1c1917", accent: "#d97706", glow: "rgba(217,119,6,0.15)" },
  },
  {
    id: "touch-120hz",
    number: "03",
    title: "Touch at\n120 Hertz",
    subtitle: "Rive packs an entire state machine into a binary file smaller than a Lottie JSON. The runtime interpolates at 120Hz. Your code just flips a trigger. Near-zero CPU, game-like tactility.",
    stack: ["Rive", "Tailwind", "Custom JS"],
    synergy: 9,
    install: "npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max",
    aesthetic: "Vibrant · Springy · Tactile",
    palette: { bg: "#0f0a1e", fg: "#f5f0ff", accent: "#c084fc", glow: "rgba(192,132,252,0.3)" },
  },
  {
    id: "silicon-dreams",
    number: "04",
    title: "Silicon\nDreams",
    subtitle: "WGSL shaders compile directly on the GPU. Millions of particles at locked 120fps on mid-range mobile. No library, no abstraction — just raw hardware speaking its native tongue.",
    stack: ["WebGPU", "WGSL Shaders", "Vanilla Canvas"],
    synergy: 10,
    install: "npx skills add anthropics/skills --skill frontend-design",
    aesthetic: "Generative · Neon · Futurist",
    palette: { bg: "#030408", fg: "#cffafe", accent: "#22d3ee", glow: "rgba(34,211,238,0.25)" },
  },
  {
    id: "directors-cut",
    number: "05",
    title: "The Director's\nCut",
    subtitle: "Theatre.js injects a studio timeline over your dev server. Scrub cameras, keyframe lights, direct the scene visually. Hit save — it exports clean production JSON. Cinema, in the browser.",
    stack: ["Theatre.js", "React Three Fiber", "Lenis"],
    synergy: 9,
    install: "npx skills add google-labs-code/stitch-skills --skill stitch-design",
    aesthetic: "Cinematic · Letterboxed · Theatrical",
    palette: { bg: "#0a0f0d", fg: "#fef3c7", accent: "#fbbf24", glow: "rgba(251,191,36,0.2)" },
  },
];

/* ================================================================== */
/* Smooth scroll provider (Lenis)                                     */
/* ================================================================== */

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);
}

/* ================================================================== */
/* Chapter navigation dots (right side, vertical)                    */
/* ================================================================== */

function ChapterNav({ active, onJump }: { active: number; onJump: (i: number) => void }) {
  return (
    <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
      {CHAPTERS.map((c, i) => (
        <button
          key={c.id}
          onClick={() => onJump(i)}
          className="group flex items-center gap-2"
          aria-label={`Jump to chapter ${c.number}`}
        >
          <span className={`font-mono text-[10px] transition ${active === i ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} style={{ color: c.palette.accent }}>
            {c.number}
          </span>
          <span
            className={`h-2 w-2 rounded-full transition-all ${active === i ? "scale-150" : "scale-100"}`}
            style={{ background: active === i ? c.palette.accent : "rgba(255,255,255,0.2)" }}
          />
        </button>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Progress bar (top, per-chapter color)                             */
/* ================================================================== */

function ShowcaseProgress({ progress, chapter }: { progress: number; chapter: Chapter }) {
  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
      <div
        className="h-full origin-left transition-colors duration-500"
        style={{ width: `${progress * 100}%`, background: chapter.palette.accent }}
      />
    </div>
  );
}

/* ================================================================== */
/* Interactive demo: particle canvas (Chapter 4 — Silicon Dreams)    */
/* ================================================================== */

function ParticleCanvas({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
    }));
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", resize);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      });
      // connect nearby particles
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [color]);
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

/* ================================================================== */
/* Chapter 1 demo: 3D parallax orb (CSS 3D + mouse)                  */
/* ================================================================== */

function Orb3D({ accent, glow }: { accent: string; glow: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.transform = `perspective(800px) rotateY(${dx * 25}deg) rotateX(${-dy * 25}deg) translateZ(20px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div className="relative grid h-48 w-48 place-items-center sm:h-64 sm:w-64">
      <div
        ref={ref}
        className="relative h-full w-full rounded-full transition-transform duration-200 ease-out"
        style={{ background: `radial-gradient(circle at 35% 30%, ${accent}, ${glow} 60%, transparent 80%)`, boxShadow: `0 0 80px ${glow}, inset 0 0 60px rgba(0,0,0,0.5)` }}
      >
        <div className="absolute left-[30%] top-[25%] h-8 w-8 rounded-full bg-white/40 blur-xl" />
      </div>
    </div>
  );
}

/* ================================================================== */
/* Chapter 2 demo: morphing cards (view-transition-style)           */
/* ================================================================== */

function MorphCards({ accent }: { accent: string }) {
  const [expanded, setExpanded] = useState(0);
  return (
    <div className="flex h-48 w-full max-w-md gap-2 sm:h-56">
      {[0, 1, 2, 3].map((i) => (
        <button
          key={i}
          onClick={() => setExpanded(i)}
          className="flex-1 rounded-2xl border-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            flex: expanded === i ? 3 : 1,
            borderColor: expanded === i ? accent : "rgba(0,0,0,0.1)",
            background: expanded === i ? accent : "rgba(0,0,0,0.03)",
          }}
          aria-label={`Card ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ================================================================== */
/* Chapter 3 demo: spring tactile buttons                           */
/* ================================================================== */

function SpringButtons({ accent }: { accent: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-wrap gap-3">
      {["BOUNCE", "SPRING", "120Hz", "TACTILE"].map((label, i) => (
        <motion.button
          key={label}
          onClick={() => setActive(i)}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 500, damping: 12 }}
          className="rounded-full px-5 py-2.5 font-mono text-xs font-bold"
          style={{
            background: active === i ? accent : "rgba(255,255,255,0.05)",
            color: active === i ? "#0f0a1e" : "#f5f0ff",
            border: `1px solid ${active === i ? accent : "rgba(255,255,255,0.1)"}`,
          }}
        >
          {label}
        </motion.button>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Chapter 5 demo: cinematic letterbox + timeline scrub              */
/* ================================================================== */

function CinematicReel({ accent }: { accent: string }) {
  const [frame, setFrame] = useState(0);
  return (
    <div className="w-full max-w-md">
      <div className="relative aspect-video overflow-hidden rounded-lg" style={{ border: `2px solid ${accent}` }}>
        <div className="absolute inset-0 grid place-items-center" style={{ background: `linear-gradient(135deg, ${accent}22, transparent)` }}>
          <span className="font-mono text-3xl font-bold" style={{ color: accent }}>FRAME {String(frame).padStart(3, "0")}</span>
        </div>
        <div className="absolute top-0 h-3 w-full bg-black" />
        <div className="absolute bottom-0 h-3 w-full bg-black" />
      </div>
      <input
        type="range" min={0} max={120} value={frame}
        onChange={(e) => setFrame(Number(e.target.value))}
        className="mt-4 w-full"
        style={{ accentColor: accent }}
        aria-label="Timeline scrubber"
      />
    </div>
  );
}

/* ================================================================== */
/* Individual chapter                                                */
/* ================================================================== */

function ChapterView({ chapter, index, isDark }: { chapter: Chapter; index: number; isDark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  useGSAP(() => {
    const title = ref.current?.querySelector(".chapter-title");
    if (!title) return;
    gsap.fromTo(title,
      { opacity: 0, y: 80, filter: "blur(20px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 60%", end: "top 20%", scrub: false },
      }
    );
  }, { scope: ref });

  const dark = isDark;

  return (
    <section
      ref={ref}
      id={chapter.id}
      className="relative flex min-h-screen snap-start flex-col items-center justify-center overflow-hidden px-6 py-20"
      style={{ background: chapter.palette.bg, color: chapter.palette.fg }}
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{ background: chapter.palette.glow }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        {/* chapter number + aesthetic */}
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-sm tracking-[0.3em] opacity-50">CHAPTER {chapter.number}</span>
          <span className="h-px w-8" style={{ background: chapter.palette.accent }} />
          <span className="font-mono text-xs uppercase tracking-wider opacity-60">{chapter.aesthetic}</span>
        </div>

        {/* extraordinary title */}
        <h2
          className="chapter-title whitespace-pre-line text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
          style={{ fontFeatureSettings: '"ss01"' }}
        >
          {chapter.title}
        </h2>

        {/* subtitle */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed opacity-70 sm:text-lg">
          {chapter.subtitle}
        </p>

        {/* stack chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {chapter.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border px-3 py-1 font-mono text-xs"
              style={{ borderColor: `${chapter.palette.accent}40`, background: `${chapter.palette.accent}10`, color: chapter.palette.accent }}
            >
              {s}
            </span>
          ))}
          <span
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-xs font-bold"
            style={{ borderColor: chapter.palette.accent, color: chapter.palette.fg }}
          >
            <Sparkles className="h-3 w-3" style={{ color: chapter.palette.accent }} /> {chapter.synergy}/10
          </span>
        </div>

        {/* interactive demo — unique per chapter */}
        <div className="mt-12 flex min-h-[14rem] items-center justify-center">
          {index === 0 && <Orb3D accent={chapter.palette.accent} glow={chapter.palette.glow} />}
          {index === 1 && <MorphCards accent={chapter.palette.accent} />}
          {index === 2 && <SpringButtons accent={chapter.palette.accent} />}
          {index === 3 && (
            <div className="h-48 w-full max-w-md sm:h-56">
              <ParticleCanvas color={chapter.palette.accent} />
            </div>
          )}
          {index === 4 && <CinematicReel accent={chapter.palette.accent} />}
        </div>

        {/* install command */}
        <div
          className="mt-10 rounded-xl border px-4 py-2 font-mono text-xs opacity-60"
          style={{ borderColor: `${chapter.palette.accent}30`, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
        >
          <span className="opacity-50">$ </span>{chapter.install}
        </div>
      </motion.div>

      {/* scroll hint — only on first chapter */}
      {index === 0 && (
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-40"
        >
          <ArrowDown className="h-6 w-6" style={{ color: chapter.palette.accent }} />
        </motion.div>
      )}
    </section>
  );
}

/* ================================================================== */
/* Showcase intro (before chapter 1)                                */
/* ================================================================== */

function ShowcaseIntro() {
  return (
    <section className="relative flex min-h-screen snap-start flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-zinc-400">
          <Zap className="h-3.5 w-3.5 text-emerald-400" /> Five approaches · Five worlds
        </div>
        <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          The Stack
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-amber-300 to-cyan-300 bg-clip-text text-transparent">
            Showcase
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Five skill-stack combinations, each rendered as its own aesthetic universe.
          Scroll to enter each world. Every chapter demonstrates a distinct approach to
          motion, interaction, and design intelligence.
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
          className="mt-12 text-zinc-500"
        >
          <ArrowDown className="mx-auto h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* Main showcase component                                           */
/* ================================================================== */

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useLenis();

  // track active chapter + progress
  useEffect(() => {
    const sections = containerRef.current?.querySelectorAll("section[data-chapter]");
    if (!sections) return;
    const triggers: ScrollTrigger[] = [];
    sections.forEach((sec, i) => {
      const st = ScrollTrigger.create({
        trigger: sec,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => { if (self.isActive) setActive(i); },
      });
      triggers.push(st);
    });
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(window.scrollY / total);
    };
    window.addEventListener("scroll", onScroll);
    return () => { triggers.forEach((t) => t.kill()); window.removeEventListener("scroll", onScroll); };
  }, []);

  const jumpTo = (i: number) => {
    const sec = containerRef.current?.querySelectorAll("section[data-chapter]")[i];
    sec?.scrollIntoView({ behavior: "smooth" });
  };

  const activeChapter = CHAPTERS[active] || CHAPTERS[0];
  const isDark = ["#05070a", "#0f0a1e", "#030408", "#0a0f0d"].includes(activeChapter.palette.bg);

  return (
    <div ref={containerRef} className="relative">
      <ShowcaseProgress progress={progress} chapter={activeChapter} />
      <ChapterNav active={active} onJump={jumpTo} />
      <div className="snap-y snap-mandatory">
        <ShowcaseIntro />
        {CHAPTERS.map((c, i) => (
          <div key={c.id} data-chapter={c.id}>
            <ChapterView chapter={c} index={i} isDark={isDark} />
          </div>
        ))}
      </div>
    </div>
  );
}
