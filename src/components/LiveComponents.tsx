"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, Package, Tag, User, Loader2, X, AlertCircle, Sparkles } from "lucide-react";

interface ComponentResult {
  name: string;
  slug: string;
  description: string | null;
  install_ref: string;
  url: string;
  preview_url: string | null;
  author: string | null;
  tags: string[];
  updated_at: string;
}

const SUGGESTIONS = ["button", "hero", "card", "navbar", "modal", "input", "tabs", "accordion", "tooltip", "sidebar"];

export default function LiveComponents() {
  const [q, setQ] = useState("button");
  const [submitted, setSubmitted] = useState("button");
  const [results, setResults] = useState<ComponentResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<ComponentResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`/api/components?q=${encodeURIComponent(trimmed)}&scope=public&limit=12`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setResults(json.results ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // kick off the initial search on mount
  useState(() => { run("button"); });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(q);
    run(q);
  };

  return (
    <section className="border-y border-white/5 bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        {/* header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/70">08 — live from 21st.dev</div>
            <h2 id="live" className="scroll-mt-24 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Live Component Registry</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Real-time search of the 21st.dev public component registry via the official
              <code className="mx-1 font-mono text-emerald-300">/api/v1/components/search</code>
              endpoint. Proxied server-side — your API key never reaches the browser.
            </p>
          </div>
        </div>

        {/* search form */}
        <form onSubmit={onSubmit} className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search components — button, hero, navbar, modal…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-emerald-500/50"
              aria-label="Search 21st.dev components"
            />
            {q && (
              <button
                type="button"
                onClick={() => { setQ(""); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                aria-label="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {/* suggestion chips */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setQ(s); setSubmitted(s); run(s); }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                submitted === s
                  ? "border-emerald-400 bg-emerald-400 text-emerald-950"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/30"
              }`}
            >{s}</button>
          ))}
        </div>

        {/* status row */}
        <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
          <span>
            {loading ? "Querying 21st.dev…" :
             error ? <span className="text-rose-400">{error}</span> :
             results ? `${results.length} result${results.length === 1 ? "" : "s"} for “${submitted}”` :
             "Ready"}
          </span>
          <span className="font-mono">GET /api/v1/components/search</span>
        </div>

        {/* results grid */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
              ))}
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/[0.08] p-5"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
              <div className="text-sm text-rose-100">
                <div className="font-semibold">Search failed</div>
                <div className="mt-1 text-rose-200/80">{error}</div>
                <div className="mt-2 text-xs text-rose-300/60">
                  The 21st.dev API may be rate-limiting, or API_KEY_21ST may be invalid.
                </div>
              </div>
            </motion.div>
          )}

          {!loading && !error && results && results.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center"
            >
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
              <div className="text-zinc-300">No components matched “{submitted}”.</div>
              <div className="mt-1 text-sm text-zinc-500">Try a broader term like “button” or “card”.</div>
            </motion.div>
          )}

          {!loading && !error && results && results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {results.map((r, i) => (
                <motion.button
                  key={r.slug + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => setActive(r)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:border-emerald-500/40"
                >
                  {/* preview image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                    {r.preview_url ? (
                      <img
                        src={r.preview_url}
                        alt={r.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-zinc-600">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute right-2 top-2 rounded-md bg-zinc-950/80 px-2 py-0.5 font-mono text-[10px] text-emerald-300 backdrop-blur">
                      {r.registry ?? "ui"}
                    </div>
                  </div>
                  {/* meta */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-white">{r.name}</h3>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition group-hover:text-emerald-300" />
                    </div>
                    {r.author && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                        <User className="h-3 w-3" /> {r.author}
                      </div>
                    )}
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                      {r.description ?? "No description provided."}
                    </p>
                    {r.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {r.tags.slice(0, 3).map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                            <Tag className="h-2.5 w-2.5" /> {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* detail drawer */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 z-[70] grid place-items-end bg-zinc-950/80 backdrop-blur-sm sm:place-items-center"
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", damping: 26, stiffness: 240 }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-900 p-6 sm:max-w-2xl sm:rounded-3xl"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{active.name}</h3>
                    {active.author && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-zinc-400">
                        <User className="h-3.5 w-3.5" /> {active.author}
                      </div>
                    )}
                  </div>
                  <button onClick={() => setActive(null)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-400 hover:text-white" aria-label="Close">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {active.preview_url && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
                    <img src={active.preview_url} alt={active.name} className="w-full" />
                  </div>
                )}

                {active.description && (
                  <p className="mb-4 text-sm leading-relaxed text-zinc-300">{active.description}</p>
                )}

                {active.tags?.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {active.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-400">
                        <Tag className="h-3 w-3" /> {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Install command</div>
                  <code className="block break-all font-mono text-xs text-emerald-300">
                    npx @21st-dev/registry add {active.install_ref}
                  </code>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={active.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30"
                  >
                    <ExternalLink className="h-4 w-4" /> View on 21st.dev
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
