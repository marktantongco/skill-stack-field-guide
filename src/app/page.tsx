"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Zap, Layers, GitBranch, Boxes, Sparkles, AlertTriangle, CheckCircle2,
  XCircle, Copy, Check, ChevronDown, Search, Cpu, Smartphone, Globe, Terminal,
  ArrowRight, Flame, ShieldAlert, TrendingUp,
} from "lucide-react";
import {
  COMBOS, MATRIX, SKILLS, CORES, INSTALL_COMMANDS, DIRECTIONS,
  type Direction, type Combo,
} from "@/lib/skillData";
import LiveComponents from "@/components/LiveComponents";
import Showcase from "@/components/Showcase";
import ComponentLab from "@/components/ComponentLab";
import DataVizLab from "@/components/DataVizLab";
import SettingsLab from "@/components/SettingsLab";
import { useConfigStore } from "@/lib/config-store";

gsap.registerPlugin(useGSAP);

/* ------------------------------------------------------------------ */
/* Small shared primitives                                             */
/* ------------------------------------------------------------------ */

function SynergyBadge({ value }: { value: number }) {
  const tone =
    value >= 9 ? "from-emerald-500/20 to-emerald-400/10 text-emerald-300 border-emerald-500/40"
    : value >= 7 ? "from-amber-500/20 to-amber-400/10 text-amber-300 border-amber-500/40"
    : value >= 5 ? "from-orange-500/20 to-orange-400/10 text-orange-300 border-orange-500/40"
    : "from-rose-500/20 to-rose-400/10 text-rose-300 border-rose-500/40";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border bg-gradient-to-br px-2.5 py-0.5 text-xs font-mono font-semibold ${tone}`}>
      <Flame className="h-3 w-3" /> {value}/10
    </span>
  );
}

function SectionLabel({ id, icon: Icon, title, kicker }: {
  id: string; icon: React.ElementType; title: string; kicker: string;
}) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/70">{kicker}</div>
        <h2 id={id} className="scroll-mt-24 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
      aria-label={`Copy ${label ?? "command"}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // GSAP: split-and-stagger the title characters. Imperative — never touches React state.
  useGSAP(() => {
    const title = titleRef.current;
    if (!title) return;
    const text = title.textContent ?? "";
    const parts = text.split(" ").map((w, i) => ({ w, i }));
    title.innerHTML = "";
    parts.forEach((p) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.style.overflow = "hidden";
      span.style.verticalAlign = "top";
      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.textContent = p.w + "\u00A0";
      span.appendChild(inner);
      title.appendChild(span);
    });
    gsap.from(title.children, {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.06,
      delay: 0.15,
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden">
      {/* ambient orbs */}
      <motion.div style={{ y: y1 }} className="pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-emerald-500/20 blur-[120px]" />
      <motion.div style={{ y: y2 }} className="pointer-events-none absolute -right-24 top-40 h-[26rem] w-[26rem] rounded-full bg-amber-500/15 blur-[120px]" />
      <motion.div style={{ y: y1 }} className="pointer-events-none absolute left-1/2 top-[55%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-teal-500/15 blur-[120px]" />

      {/* grid backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <motion.div style={{ opacity }} className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-300"
        >
          <Sparkles className="h-3.5 w-3.5" /> Direction B · Zero-Bundle Fluidity · live 21st.dev
        </motion.div>

        <h1
          ref={titleRef}
          className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          The Zero-Bundle Field Guide
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg"
        >
          Mobile-first, fluid by default. This edition focuses on <strong className="text-white">Direction B</strong> —
          CSS View Transitions, WAAPI, Tailwind, Popmotion — and ships a <strong className="text-white">live 21st.dev
          registry search</strong> powered by the official API. Thirty combinations and a twenty-row synergy matrix
          remain on tap when you need to branch out.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <a href="#live" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300">
            Search live components <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#combinations" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30">
            <GitBranch className="h-4 w-4" /> 30 stacks
          </a>
        </motion.div>

        {/* stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { v: "30", l: "stack combinations" },
            { v: "20", l: "synergy-matrix rows" },
            { v: "Live", l: "21st.dev search" },
            { v: "B", l: "default direction" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
              <div className="text-2xl font-bold text-white sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs text-zinc-400">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky nav                                                          */
/* ------------------------------------------------------------------ */

function StickyNav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#lab", label: "Lab" },
    { href: "#data-viz", label: "Dashboard" },
    { href: "#settings", label: "Controls" },
    { href: "#live", label: "Live 21st" },
    { href: "#foundations", label: "Foundations" },
    { href: "#combinations", label: "30 Combos" },
    { href: "#matrix", label: "Synergy Matrix" },
    { href: "#deepdive", label: "Deep-Dive" },
    { href: "#registry", label: "Registry" },
    { href: "#cores", label: "Top-5 Cores" },
    { href: "#install", label: "Install" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950">
            <Zap className="h-4 w-4" />
          </span>
          stack.guide
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <button onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white md:hidden" aria-label="Menu">
          <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="grid grid-cols-2 gap-1 px-4 py-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5">
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Foundations                                                         */
/* ------------------------------------------------------------------ */

function Foundations() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionLabel id="foundations" icon={Layers} title="Three Foundational Cores" kicker="01 — where the stack begins" />
      <p className="mb-10 max-w-3xl text-zinc-400">
        Every combination on this page composes around at least one foundational core — a skill that either
        enforces quality, generates designs, or supplies the component vocabulary. Get these three right first;
        everything else is a multiplier on top.
      </p>
      <div className="grid gap-5 md:grid-cols-3">
        {CORES.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.1}>
            <div className="group h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 transition hover:border-emerald-500/40">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs text-emerald-400">CORE #{i + 1}</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-400">{c.install.split(" ").slice(-1)[0]}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{c.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{c.role}</p>
              <div className="mt-4 rounded-lg border border-white/10 bg-zinc-950/50 p-3">
                <code className="block break-all font-mono text-[11px] text-emerald-300">{c.install}</code>
              </div>
              {c.id === "21st-registry" && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Skill name is <strong>21st-registry</strong>, not <code className="font-mono">21st-dev-components</code>. The flag in your prompt will fail.</span>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 30 Combinations                                                     */
/* ------------------------------------------------------------------ */

const accentMap: Record<Direction, { ring: string; chip: string; dot: string }> = {
  A: { ring: "hover:border-emerald-500/50", chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", dot: "bg-emerald-400" },
  B: { ring: "hover:border-amber-500/50", chip: "border-amber-500/30 bg-amber-500/10 text-amber-300", dot: "bg-amber-400" },
  C: { ring: "hover:border-teal-500/50", chip: "border-teal-500/30 bg-teal-500/10 text-teal-300", dot: "bg-teal-400" },
};

function ComboCard({ c, index }: { c: Combo; index: number }) {
  const a = accentMap[c.dir];
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition ${a.ring}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${a.dot}`} />
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">#{c.id} · {DIRECTIONS[c.dir].title}</span>
        </div>
        <SynergyBadge value={c.synergy} />
      </div>
      <h3 className="text-lg font-semibold text-white">{c.name}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {c.stack.map((s) => (
          <span key={s} className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${a.chip}`}>{s}</span>
        ))}
      </div>
      <div className="mt-4 space-y-3 text-sm">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400/80"><Cpu className="h-3 w-3" /> Logic</div>
          <p className="leading-relaxed text-zinc-300">{c.logic}</p>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400/80"><AlertTriangle className="h-3 w-3" /> Constraint</div>
          <p className="leading-relaxed text-zinc-400">{c.constraint}</p>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-400/80"><CheckCircle2 className="h-3 w-3" /> Mitigation</div>
          <p className="leading-relaxed text-zinc-400">{c.mitigation}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3 text-[11px] text-zinc-500">
        <Smartphone className="h-3.5 w-3.5" /> Mobile: <span className="text-zinc-300">{c.mobile}</span>
      </div>
    </motion.article>
  );
}

function Combinations() {
  const [filter, setFilter] = useState<"all" | Direction>("B");
  const filtered = useMemo(() => filter === "all" ? COMBOS : COMBOS.filter((c) => c.dir === filter), [filter]);
  const tabs: { id: "all" | Direction; label: string }[] = [
    { id: "all", label: "All 30" },
    { id: "A", label: "A · Silk & GPU" },
    { id: "B", label: "B · Zero-Bundle" },
    { id: "C", label: "C · Spatial" },
  ];
  return (
    <section className="border-y border-white/5 bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionLabel id="combinations" icon={GitBranch} title="30 Skill-Stack Combinations" kicker="02 — three wildly different directions" />
        <div className="mb-8 flex flex-col gap-4">
          <p className="max-w-3xl text-zinc-400">
            Three deliberate directions, ten combinations each. <strong className="text-white">A</strong> chases
            silk-smooth premium agency motion. <strong className="text-white">B</strong> bets on zero-bundle native
            browser primitives. <strong className="text-white">C</strong> goes spatial and immersive. Filter below.
          </p>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = filter === t.id;
              return (
                <button
                  key={t.id} onClick={() => setFilter(t.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    active ? "border-emerald-400 bg-emerald-400 text-emerald-950" : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/30"
                  }`}
                >{t.label}</button>
              );
            })}
          </div>
        </div>

        {/* direction banners when filtered */}
        {filter !== "all" && (
          <Reveal>
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className={`h-3 w-3 rounded-full ${accentMap[filter].dot}`} />
              <div>
                <div className="font-semibold text-white">{DIRECTIONS[filter].title}</div>
                <div className="text-sm text-zinc-400">{DIRECTIONS[filter].tagline}</div>
              </div>
            </div>
          </Reveal>
        )}

        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => <ComboCard key={c.id} c={c} index={i} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Synergy Matrix                                                      */
/* ------------------------------------------------------------------ */

const riskTone: Record<string, string> = {
  "Low": "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  "Medium-Low": "text-teal-300 bg-teal-500/10 border-teal-500/30",
  "Medium": "text-amber-300 bg-amber-500/10 border-amber-500/30",
  "High": "text-orange-300 bg-orange-500/10 border-orange-500/30",
  "Critical": "text-rose-300 bg-rose-500/10 border-rose-500/30",
};

function SynergyMatrix() {
  const [sortBy, setSortBy] = useState<"synergy" | "risk" | "default">("default");
  const rows = useMemo(() => {
    if (sortBy === "synergy") return [...MATRIX].sort((a, b) => b.synergy - a.synergy);
    if (sortBy === "risk") {
      const order = ["Critical", "High", "Medium", "Medium-Low", "Low"];
      return [...MATRIX].sort((a, b) => order.indexOf(a.risk) - order.indexOf(b.risk));
    }
    return MATRIX;
  }, [sortBy]);
  const riskOrder = ["Critical", "High", "Medium", "Medium-Low", "Low"];

  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionLabel id="matrix" icon={Boxes} title="The Synergy Matrix" kicker="03 — compatibility at a glance" />
      <p className="mb-6 max-w-3xl text-zinc-400">
        Twenty deduped motion-stack pairings, ranked by synergy, error-risk, mobile performance, and best-for use case.
        Sort to surface either the safest bets or the highest-leverage combinations.
      </p>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">Sort:</span>
        {([
          { id: "default", label: "Default" },
          { id: "synergy", label: "Synergy ↓" },
          { id: "risk", label: "Risk (high → low)" },
        ] as const).map((s) => (
          <button key={s.id} onClick={() => setSortBy(s.id)}
            className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
              sortBy === s.id ? "border-emerald-400 bg-emerald-400 text-emerald-950" : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/30"
            }`}>{s.label}</button>
        ))}
      </div>

      {/* desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-left text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Stack</th>
              <th className="px-4 py-3 font-medium">Synergy</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Mobile</th>
              <th className="px-4 py-3 font-medium">Best For</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.stack} className="border-t border-white/5 transition hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{r.stack}</div>
                  <div className="mt-0.5 text-xs text-zinc-500">{r.note}</div>
                </td>
                <td className="px-4 py-3"><SynergyBadge value={r.synergy} /></td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${riskTone[r.risk]}`}>{r.risk}</span>
                </td>
                <td className="px-4 py-3 text-zinc-300">{r.mobile}</td>
                <td className="px-4 py-3 text-zinc-400">{r.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="space-y-3 lg:hidden">
        {rows.map((r, i) => (
          <Reveal key={r.stack} delay={(i % 4) * 0.05}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-white">{r.stack}</div>
                <SynergyBadge value={r.synergy} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className={`inline-block rounded-md border px-2 py-0.5 font-medium ${riskTone[r.risk]}`}>{r.risk}</span>
                <span className="inline-flex items-center gap-1 text-zinc-400"><Smartphone className="h-3 w-3" /> {r.mobile}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{r.bestFor}</p>
              <p className="mt-1 text-xs text-zinc-500">{r.note}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* risk legend */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <span>Risk scale:</span>
        {riskOrder.map((r) => (
          <span key={r} className={`inline-block rounded-md border px-2 py-0.5 font-medium ${riskTone[r]}`}>{r}</span>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Deep-Dive (20-stack article, accordion)                             */
/* ------------------------------------------------------------------ */

function DeepDive() {
  const groups = [
    {
      title: "Golden Couples", tone: "emerald",
      items: MATRIX.filter((m) => m.synergy >= 9),
    },
    {
      title: "Solid Performers", tone: "teal",
      items: MATRIX.filter((m) => m.synergy >= 7 && m.synergy < 9),
    },
    {
      title: "Toxic Mixes & Clunky Pairs", tone: "rose",
      items: MATRIX.filter((m) => m.synergy < 7),
    },
  ];
  const toneClass: Record<string, string> = {
    emerald: "border-emerald-500/30 bg-emerald-500/[0.06]",
    teal: "border-teal-500/30 bg-teal-500/[0.06]",
    rose: "border-rose-500/30 bg-rose-500/[0.06]",
  };
  return (
    <section className="border-y border-white/5 bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionLabel id="deepdive" icon={Layers} title="Motion-Stack Deep-Dive" kicker="04 — the merged 20-row field guide" />
        <p className="mb-8 max-w-3xl text-zinc-400">
          Two source articles merged and de-duplicated into twenty unique stacks, grouped by synergy tier.
          Each row carries the constraint and the fix — never just the marketing line.
        </p>
        <div className="space-y-6">
          {groups.map((g) => (
            <Reveal key={g.title}>
              <div className={`rounded-2xl border p-5 ${toneClass[g.tone]}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{g.title}</h3>
                  <span className="font-mono text-xs text-zinc-400">{g.items.length} stacks</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {g.items.map((m) => (
                    <div key={m.stack} className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-white">{m.stack}</div>
                        <SynergyBadge value={m.synergy} />
                      </div>
                      <p className="mt-2 text-sm text-zinc-300">{m.note}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className={`inline-block rounded-md border px-2 py-0.5 font-medium ${riskTone[m.risk]}`}>{m.risk}</span>
                        <span>· {m.mobile}</span>
                      </div>
                      <div className="mt-2 text-xs text-zinc-400"><span className="text-zinc-500">Best for:</span> {m.bestFor}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* core principles */}
        <Reveal>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Core Principles</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Do: animate transform & opacity</div>
                <p className="text-sm text-zinc-400">Handled by the GPU compositor layer — locked 60fps even on mid-range mobile.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-300"><XCircle className="h-4 w-4" /> Don't: animate width, height, top, left, margin</div>
                <p className="text-sm text-zinc-400">Triggers layout recalculation → layout thrashing → frame drops.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-300"><AlertTriangle className="h-4 w-4" /> Pick ONE main engine</div>
                <p className="text-sm text-zinc-400">Multiple libraries = bloated bundle + memory leaks. GSAP plugins (SplitText, MorphSVG, ScrollTrigger) are now all free.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-300"><TrendingUp className="h-4 w-4" /> React + GSAP: use @gsap/react</div>
                <p className="text-sm text-zinc-400">useGSAP cleans up timelines & ScrollTriggers on unmount. Never vanilla useEffect.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Skills Registry                                                     */
/* ------------------------------------------------------------------ */

function Registry() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"popularity" | "impact" | "name">("popularity");
  const filtered = useMemo(() => {
    const impactOrder = ["Critical", "High", "Medium", "Emerging", "Low"];
    let out = SKILLS.filter((s) =>
      s.skill.toLowerCase().includes(q.toLowerCase()) ||
      s.useCase.toLowerCase().includes(q.toLowerCase()) ||
      s.community.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === "popularity") {
      const parse = (v: string) => parseFloat(v) * (v.includes("M") ? 1000 : 1);
      out = [...out].sort((a, b) => parse(b.popularity) - parse(a.popularity));
    } else if (sort === "impact") {
      out = [...out].sort((a, b) => impactOrder.indexOf(a.impact) - impactOrder.indexOf(b.impact));
    } else {
      out = [...out].sort((a, b) => a.skill.localeCompare(b.skill));
    }
    return out;
  }, [q, sort]);

  const impactTone: Record<string, string> = {
    Critical: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    High: "text-teal-300 bg-teal-500/10 border-teal-500/30",
    Medium: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    Emerging: "text-orange-300 bg-orange-500/10 border-orange-500/30",
    Low: "text-zinc-300 bg-white/5 border-white/10",
  };
  const platformIcon = (p: string) => p === "Mobile" ? <Smartphone className="h-3 w-3" /> : p === "Web" ? <Globe className="h-3 w-3" /> : p === "Both" ? <Boxes className="h-3 w-3" /> : <Layers className="h-3 w-3" />;

  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionLabel id="registry" icon={Boxes} title="Verified Skills Registry" kicker="05 — install counts from skills.sh" />
      <p className="mb-6 max-w-3xl text-zinc-400">
        Every skill cross-checked against the live skills.sh leaderboard (captured 2026-07-02). Install counts are
        real telemetry, not estimates. Sort by popularity, impact, or name; filter by free-text search.
      </p>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search skills, use-cases, community…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-2">
          {([
            { id: "popularity", label: "Popular" },
            { id: "impact", label: "Impact" },
            { id: "name", label: "A–Z" },
          ] as const).map((s) => (
            <button key={s.id} onClick={() => setSort(s.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                sort === s.id ? "border-emerald-400 bg-emerald-400 text-emerald-950" : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/30"
              }`}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
        <div className="max-h-[36rem] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-zinc-950/95 text-left text-xs uppercase tracking-wider text-zinc-400 backdrop-blur">
              <tr>
                <th className="px-4 py-3 font-medium">Skill</th>
                <th className="px-4 py-3 font-medium">Install</th>
                <th className="px-4 py-3 font-medium">Installs</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Community</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Impact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.skill} className="border-t border-white/5 align-top transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{s.skill}</div>
                    {s.note && <div className="mt-1 max-w-xs text-xs text-amber-300/80">{s.note}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <code className="block max-w-xs break-all font-mono text-[11px] text-emerald-300/90">{s.install}</code>
                  </td>
                  <td className="px-4 py-3 font-mono text-zinc-300">{s.popularity}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-zinc-300">{platformIcon(s.platform)} {s.platform}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{s.community}</td>
                  <td className="px-4 py-3 text-zinc-400">{s.year}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${impactTone[s.impact]}`}>{s.impact}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((s, i) => (
          <Reveal key={s.skill} delay={(i % 4) * 0.04}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-white">{s.skill}</div>
                <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${impactTone[s.impact]}`}>{s.impact}</span>
              </div>
              <code className="mt-2 block break-all font-mono text-[11px] text-emerald-300/90">{s.install}</code>
              <p className="mt-2 text-sm text-zinc-400">{s.useCase}</p>
              {s.note && <p className="mt-1 text-xs text-amber-300/80">{s.note}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1">{platformIcon(s.platform)} {s.platform}</span>
                <span>· {s.community}</span>
                <span>· {s.year}</span>
                <span>· <span className="font-mono text-zinc-300">{s.popularity}</span> installs</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Top-5 Synergies per Core                                            */
/* ------------------------------------------------------------------ */

function Cores() {
  return (
    <section className="border-y border-white/5 bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionLabel id="cores" icon={Sparkles} title="Top-5 Synergies per Core" kicker="06 — highest-rated pairings" />
        <p className="mb-10 max-w-3xl text-zinc-400">
          For each foundational core, the five highest-rated pairings — with the why and the risk. Use these as
          your default starting points when composing a stack around that core.
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          {CORES.map((c, ci) => (
            <Reveal key={c.id} delay={ci * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4">
                  <div className="font-mono text-xs uppercase tracking-wider text-emerald-400">Core #{ci + 1}</div>
                  <h3 className="mt-1 text-xl font-semibold text-white">{c.name}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{c.role}</p>
                </div>
                <div className="space-y-3">
                  {c.top5.map((t, i) => (
                    <motion.div
                      key={t.pair}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-xl border border-white/10 bg-zinc-950/40 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium text-white">{t.pair}</div>
                        <SynergyBadge value={t.rating} />
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{t.why}</p>
                      <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-300/80">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" /> {t.risk}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Install Commands                                                    */
/* ------------------------------------------------------------------ */

function Install() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <SectionLabel id="install" icon={Terminal} title="Install Commands" kicker="07 — copy, paste, ship" />
      <p className="mb-8 max-w-3xl text-zinc-400">
        Every skills.sh command verified. The broken <code className="font-mono text-rose-300">--skill 21st-dev-components</code>
        flag is shown for reference — use <code className="font-mono text-emerald-300">21st-registry</code> instead.
        The 21st.dev CLI block below uses the canonical env var names from <code className="font-mono text-emerald-300">src/config.ts</code>.
      </p>

      {/* 21st.dev CLI canonical setup */}
      <Reveal>
        <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-300" />
            <h3 className="text-lg font-semibold text-white">21st.dev CLI — canonical setup</h3>
          </div>
          <p className="mb-4 text-sm text-zinc-300">
            Per <code className="font-mono text-emerald-300">@21st-dev/registry</code> source
            (<code className="font-mono text-xs">src/config.ts</code>), the CLI checks two env vars in order.
            Use <code className="font-mono text-emerald-300">API_KEY_21ST</code> — the same file powers both the
            CLI and this wiki's server-side proxy.
          </p>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80">.env.local</div>
                <CopyButton text={`# 21st.dev credentials (canonical env var names)\nAPI_KEY_21ST=your_key_here\n# Optional overrides:\n# API_URL_21ST=https://21st.dev/api/v1\n# APP_URL_21ST=https://21st.dev`} label="Copy" />
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300"><code>{`# 21st.dev credentials (canonical env var names)
API_KEY_21ST=your_key_here
# Optional overrides:
# API_URL_21ST=https://21st.dev/api/v1
# APP_URL_21ST=https://21st.dev`}</code></pre>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Login (interactive)</div>
                <code className="block break-all font-mono text-xs text-emerald-300">npx @21st-dev/registry login</code>
                <p className="mt-2 text-xs text-zinc-500">Stores key in <code className="font-mono">~/.an/credentials</code> (mode 0600).</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Install a component</div>
                <code className="block break-all font-mono text-xs text-emerald-300">npx @21st-dev/registry add @author/slug</code>
                <p className="mt-2 text-xs text-zinc-500">Pulls source into your codebase.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Search (CLI)</div>
                <code className="block break-all font-mono text-xs text-emerald-300">npx @21st-dev/registry search "button"</code>
                <p className="mt-2 text-xs text-zinc-500">Same API the wiki's Live section uses.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Publish your own</div>
                <code className="block break-all font-mono text-xs text-emerald-300">npx @21st-dev/registry publish</code>
                <p className="mt-2 text-xs text-zinc-500">Push a component to your registry.</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Get your API key</div>
              <code className="block break-all font-mono text-xs text-emerald-300">https://21st.dev/studio/&lt;your-handle&gt;/api-keys</code>
              <p className="mt-2 text-xs text-zinc-500">Docs: <code className="font-mono">https://21st.dev/studio/&lt;your-handle&gt;/docs/cli</code></p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/[0.08] p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
          <div className="text-sm text-rose-100">
            <strong>Security:</strong> You pasted the rotated API key in plaintext again. This new key is now also
            compromised — rotate it once more after this session and store it in a secrets manager, not in chat.
            The key currently configured in <code className="font-mono">.env.local</code> works, but treat it as burned.
          </div>
        </div>
      </Reveal>

      <div className="grid gap-3 sm:grid-cols-2">
        {INSTALL_COMMANDS.map((c, i) => (
          <Reveal key={c.label} delay={(i % 2) * 0.05}>
            <div className={`rounded-xl border p-4 ${c.verified ? "border-white/10 bg-white/[0.03]" : "border-rose-500/30 bg-rose-500/[0.06]"}`}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  {c.verified ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-rose-400" />}
                  {c.label}
                </div>
                <CopyButton text={c.cmd} />
              </div>
              <code className="block break-all font-mono text-xs text-zinc-300">{c.cmd}</code>
              {!c.verified && <p className="mt-2 text-xs text-rose-300">Skill name does not exist in this repo. Use 21st-registry.</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer + page assembly                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950">
                <Zap className="h-4 w-4" />
              </span>
              stack.guide
            </div>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              An interactive motion-stack knowledge-base. Built mobile-first with Next.js + Framer Motion.
              Data verified against skills.sh on 2026-07-02.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
            <a href="https://skills.sh" target="_blank" rel="noreferrer" className="hover:text-emerald-300">skills.sh ↗</a>
            <a href="https://github.com/vercel-labs/skills" target="_blank" rel="noreferrer" className="hover:text-emerald-300">CLI source ↗</a>
            <a href="https://21st.dev" target="_blank" rel="noreferrer" className="hover:text-emerald-300">21st.dev ↗</a>
            <a href="https://greensock.com" target="_blank" rel="noreferrer" className="hover:text-emerald-300">GreenSock ↗</a>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-6 text-xs text-zinc-600">
          Operating under SilentDepth v4 protocol — working code only, assumptions stated, depth before speed.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  // scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  // set dark theme on body
  useEffect(() => { document.documentElement.classList.add("dark"); }, []);
  // FULL-STACK: hydrate dashboard config from backend on mount
  const hydrateFromBackend = useConfigStore((s) => s.hydrateFromBackend);
  useEffect(() => { hydrateFromBackend(); }, [hydrateFromBackend]);

  return (
    <div id="top" className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <motion.div style={{ scaleX }} className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400" />
      <StickyNav />
      <main className="flex-1">
        <Hero />
        <Showcase />
        <ComponentLab />
        <DataVizLab />
        <SettingsLab />
        <LiveComponents />
        <Foundations />
        <Combinations />
        <SynergyMatrix />
        <DeepDive />
        <Registry />
        <Cores />
        <Install />
      </main>
      <Footer />
    </div>
  );
}
