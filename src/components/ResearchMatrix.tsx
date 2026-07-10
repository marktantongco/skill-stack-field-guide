"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitBranch, Boxes, Search, Terminal, Layers,
  Copy, Check, ArrowRight,
} from "lucide-react";
import {
  COMBOS, MATRIX, SKILLS, INSTALL_COMMANDS,
  type Direction,
} from "@/lib/skillData";

/* ------------------------------------------------------------------ */
/* Act 4: Research Matrix — compresses 7 sections into 1 tabbed view   */
/* Tabs: Combos (30) | Synergy Matrix (20) | Registry (23) | Install   */
/* ------------------------------------------------------------------ */

type Tab = "combos" | "matrix" | "registry" | "install";

const TABS: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
  { id: "combos", label: "30 Combos", icon: GitBranch, count: 30 },
  { id: "matrix", label: "Synergy Matrix", icon: Boxes, count: MATRIX.length },
  { id: "registry", label: "Skills Registry", icon: Search, count: SKILLS.length },
  { id: "install", label: "Install", icon: Terminal, count: INSTALL_COMMANDS.length },
];

const DIR_LABELS: Record<Direction, string> = {
  A: "Silk & GPU",
  B: "Zero-Bundle",
  C: "Spatial",
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-zinc-400 transition hover:text-emerald-300"
      aria-label="Copy"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function CombosTab() {
  const [filter, setFilter] = useState<"all" | Direction>("all");
  const filtered = filter === "all" ? COMBOS : COMBOS.filter((c) => c.dir === filter);
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["all", "A", "B", "C"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filter === d ? "border-emerald-400 bg-emerald-400 text-emerald-950" : "border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {d === "all" ? "All 30" : `${d} · ${DIR_LABELS[d]}`}
          </button>
        ))}
      </div>
      <div className="max-h-96 overflow-y-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-950/95 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Stack</th>
              <th className="px-3 py-2 text-center">Synergy</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-mono text-xs text-zinc-500">{c.id}</td>
                <td className="px-3 py-2 text-white">{c.name}</td>
                <td className="px-3 py-2 text-xs text-zinc-400">{c.stack.join(" + ")}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`font-mono text-xs font-bold ${c.synergy >= 9 ? "text-emerald-400" : c.synergy >= 7 ? "text-amber-400" : "text-rose-400"}`}>
                    {c.synergy}/10
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MatrixTab() {
  const sorted = useMemo(() => [...MATRIX].sort((a, b) => b.synergy - a.synergy), []);
  return (
    <div className="max-h-96 overflow-y-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-zinc-950/95 text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-3 py-2 text-left">Stack</th>
            <th className="px-3 py-2 text-center">Synergy</th>
            <th className="px-3 py-2 text-center">Risk</th>
            <th className="px-3 py-2 text-left">Best For</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <tr key={m.stack} className="border-t border-white/5 hover:bg-white/[0.02]">
              <td className="px-3 py-2 text-white">{m.stack}</td>
              <td className="px-3 py-2 text-center">
                <span className={`font-mono text-xs font-bold ${m.synergy >= 9 ? "text-emerald-400" : m.synergy >= 7 ? "text-amber-400" : "text-rose-400"}`}>
                  {m.synergy}/10
                </span>
              </td>
              <td className="px-3 py-2 text-center text-xs text-zinc-400">{m.risk}</td>
              <td className="px-3 py-2 text-xs text-zinc-400">{m.bestFor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RegistryTab() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return SKILLS;
    const query = q.toLowerCase();
    return SKILLS.filter((s) =>
      s.skill.toLowerCase().includes(query) ||
      s.useCase.toLowerCase().includes(query) ||
      s.community.toLowerCase().includes(query)
    );
  }, [q]);
  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 23 skills…"
          className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none focus:border-emerald-500/50"
        />
      </div>
      <div className="max-h-80 overflow-y-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-950/95 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2 text-left">Skill</th>
              <th className="px-3 py-2 text-right">Installs</th>
              <th className="px-3 py-2 text-center">Impact</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.skill} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-3 py-2">
                  <div className="text-white">{s.skill}</div>
                  <div className="text-xs text-zinc-500">{s.useCase}</div>
                </td>
                <td className="px-3 py-2 text-right font-mono text-xs text-zinc-300">{s.popularity}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`text-xs font-medium ${
                    s.impact === "Critical" ? "text-emerald-400" :
                    s.impact === "High" ? "text-teal-400" :
                    s.impact === "Medium" ? "text-amber-400" : "text-zinc-400"
                  }`}>{s.impact}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InstallTab() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {INSTALL_COMMANDS.map((c) => (
        <div key={c.label} className={`rounded-xl border p-3 ${c.verified ? "border-white/10 bg-white/[0.03]" : "border-rose-500/30 bg-rose-500/[0.06]"}`}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-white">{c.label}</span>
            <CopyBtn text={c.cmd} />
          </div>
          <code className="block break-all font-mono text-xs text-zinc-400">{c.cmd}</code>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Research Matrix                                                */
/* ------------------------------------------------------------------ */

export default function ResearchMatrix() {
  const [tab, setTab] = useState<Tab>("combos");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* tabs */}
      <div className="mb-6 flex gap-1 border-b border-white/10 pb-px">
        {TABS.map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition ${
                active ? "text-emerald-300" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
              <span className="font-mono text-xs text-zinc-500">({t.count})</span>
              {active && (
                <motion.div layoutId="research-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "combos" && <CombosTab />}
          {tab === "matrix" && <MatrixTab />}
          {tab === "registry" && <RegistryTab />}
          {tab === "install" && <InstallTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
