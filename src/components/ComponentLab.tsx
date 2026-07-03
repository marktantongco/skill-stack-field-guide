"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Code2, Terminal, Copy, Check, Package, Eye } from "lucide-react";
import PinList, { type PinListItem } from "@/components/ui/pin-list";
import { Lock, Bell, CreditCard, User, Mail, Bookmark, Star, Settings } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Sample data for the live pin-list demo                              */
/* ------------------------------------------------------------------ */

const SAMPLE_ITEMS: PinListItem[] = [
  { id: 1, name: "Account security", info: "2FA, password, sessions", icon: Lock, pinned: true, metadata: "2FA" },
  { id: 2, name: "Notifications", info: "Email, push, SMS", icon: Bell, pinned: true, metadata: "3" },
  { id: 3, name: "Payment methods", info: "Cards, banks, wallets", icon: CreditCard },
  { id: 4, name: "Profile", info: "Name, photo, bio", icon: User },
  { id: 5, name: "Email preferences", info: "Marketing, product, security", icon: Mail },
  { id: 6, name: "Bookmarks", info: "48 saved", icon: Bookmark },
];

/* ------------------------------------------------------------------ */
/* Code snippet of the pin-list (for the Code tab)                    */
/* ------------------------------------------------------------------ */

const PIN_LIST_CODE = `import * as React from "react";
import { Pin, Search } from "lucide-react";
import { motion, LayoutGroup, AnimatePresence } from "motion/react";

export interface PinListItem {
  id: string | number;
  name: string;
  info?: string;
  icon?: React.ElementType;
  pinned?: boolean;
}

export default function PinList({ items, enableSearch }) {
  const [list, setList] = React.useState(items);
  const [query, setQuery] = React.useState("");

  const toggle = (id) =>
    setList(prev => prev.flatMap(u =>
      u.id !== id ? [u] : [{ ...u, pinned: !u.pinned }]
    ).sort((a, b) => Number(b.pinned) - Number(a.pinned)));

  const filtered = query
    ? list.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    : list;

  const pinned = filtered.filter(u => u.pinned);
  const unpinned = filtered.filter(u => !u.pinned);

  return (
    <motion.div className="w-full space-y-6">
      {enableSearch && (
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search…"
          className="h-11 w-full rounded-xl border pl-4 text-sm"
        />
      )}
      <LayoutGroup>
        {pinned.length > 0 && (
          <section>
            <p className="mb-2 px-1 text-xs font-semibold uppercase">
              Pinned · {pinned.length}
            </p>
            {pinned.map(item => (
              <motion.div
                key={item.id}
                layoutId={\`item-\${item.id}\`}
                onClick={() => toggle(item.id)}
                transition={{ stiffness: 320, damping: 22, type: "spring" }}
                className="flex min-h-[56px] cursor-pointer items-center
                           justify-between rounded-2xl bg-neutral-100 p-2.5
                           dark:bg-neutral-800/60"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && <item.icon className="size-4" />}
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-xs text-neutral-500">{item.info}</div>
                  </div>
                </div>
                <Pin className="size-4 fill-emerald-500 text-emerald-500" />
              </motion.div>
            ))}
          </section>
        )}
        {/* unpinned section follows same pattern */}
      </LayoutGroup>
    </motion.div>
  );
}`;

const INSTALL_CMD = "21st add @marktantongco/pin-list";

/* ------------------------------------------------------------------ */
/* Mobile frame wrapper                                               */
/* ------------------------------------------------------------------ */

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[375px]">
      {/* frame */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-[8px] border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50">
        {/* status bar */}
        <div className="flex items-center justify-between bg-zinc-950 px-6 pb-1 pt-3 text-[10px] font-medium text-zinc-400">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-zinc-500" />
            <span className="h-2.5 w-4 rounded-sm bg-zinc-500" />
            <span className="h-2.5 w-5 rounded-sm bg-zinc-300" />
          </span>
        </div>
        {/* content */}
        <div className="bg-white dark:bg-zinc-950" style={{ minHeight: "520px" }}>
          {children}
        </div>
        {/* home indicator */}
        <div className="flex justify-center bg-zinc-950 py-2">
          <div className="h-1 w-32 rounded-full bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Copy button                                                        */
/* ------------------------------------------------------------------ */

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{copied ? "Copied" : label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component Lab                                                 */
/* ------------------------------------------------------------------ */

export default function ComponentLab() {
  const [tab, setTab] = useState<"preview" | "code" | "install">("preview");
  const [items, setItems] = useState(SAMPLE_ITEMS);

  const tabs = useMemo(
    () => [
      { id: "preview" as const, label: "Preview", icon: Eye },
      { id: "code" as const, label: "Code", icon: Code2 },
      { id: "install" as const, label: "Install", icon: Terminal },
    ],
    [],
  );

  return (
    <section className="border-y border-white/5 bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="mx-auto max-w-6xl px-5 py-20">
        {/* header */}
        <div className="mb-10 flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/70">09 — component lab</div>
            <h2 id="lab" className="scroll-mt-24 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              The Lab
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Live components, rendered in a real mobile frame. Not screenshots — not mockups.
              Interactive. Tap, search, drag, pin. This is the work, shipping.
            </p>
          </div>
        </div>

        {/* component title */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">Pin List</h3>
            <p className="text-sm text-zinc-500">Mobile-first animated pin-list · 56px touch targets · a11y · spring physics</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> v1.0.0 · @marktantongco
          </span>
        </div>

        {/* tabs */}
        <div className="mb-6 flex gap-2 border-b border-white/10 pb-px">
          {tabs.map((t) => {
            const active = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative -mb-px flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition ${
                  active ? "text-emerald-300" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
                {active && (
                  <motion.div
                    layoutId="lab-tab-indicator"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-emerald-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* tab content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* left: live preview (always rendered, hidden on code/install tabs for focus) */}
          <AnimatePresence mode="wait">
            {tab === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
                className="lg:col-span-2"
              >
                <div className="grid gap-8 lg:grid-cols-2">
                  <MobileFrame>
                    <div className="p-4">
                      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Settings</h2>
                      <PinList
                        items={items}
                        onItemsChange={setItems}
                        enableSearch
                        enableQuickUnpin
                        labels={{
                          pinned: "Pinned",
                          unpinned: "All items",
                          searchPlaceholder: "Search settings…",
                        }}
                      />
                    </div>
                  </MobileFrame>
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <h4 className="mb-3 text-sm font-semibold text-white">Try it</h4>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        <li className="flex gap-2"><span className="text-emerald-400">→</span> Tap any row to pin/unpin</li>
                        <li className="flex gap-2"><span className="text-emerald-400">→</span> Type in search to filter live</li>
                        <li className="flex gap-2"><span className="text-emerald-400">→</span> Right-click a pinned item to quick-unpin</li>
                        <li className="flex gap-2"><span className="text-emerald-400">→</span> Keyboard: Tab to focus, Enter to toggle</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <h4 className="mb-3 text-sm font-semibold text-white">Built with</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {["motion/react", "lucide-react", "Tailwind 4", "TypeScript"].map((s) => (
                          <span key={s} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-400">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
                      <h4 className="mb-2 text-sm font-semibold text-emerald-300">Brand alignment</h4>
                      <p className="text-xs leading-relaxed text-zinc-400">
                        56px touch targets (mobile-first). 150ms micro feedback on pin.
                        Spring physics that never block user intent. WCAG AA contrast.
                        Clear, competent, empathetic — never smug.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
                className="lg:col-span-2"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                    <span className="font-mono text-xs text-zinc-500">pin-list.tsx</span>
                    <CopyBtn text={PIN_LIST_CODE} label="Copy code" />
                  </div>
                  <pre className="max-h-[32rem] overflow-y-auto p-4 text-xs leading-relaxed">
                    <code className="font-mono text-zinc-300">{PIN_LIST_CODE}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {tab === "install" && (
              <motion.div
                key="install"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
                className="lg:col-span-2"
              >
                <div className="mx-auto max-w-2xl space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Install via 21st.dev CLI</div>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                      <code className="break-all font-mono text-sm text-emerald-300">$ {INSTALL_CMD}</code>
                      <CopyBtn text={INSTALL_CMD} label="Copy" />
                    </div>
                    <p className="mt-3 text-xs text-zinc-500">
                      Requires <code className="font-mono">@21st-dev/cli</code> installed.
                      Auth via <code className="font-mono">TWENTYFIRST_TOKEN</code> env var (see <code className="font-mono">.env.local.example</code>).
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Or via shadcn CLI</div>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                      <code className="break-all font-mono text-sm text-emerald-300">npx shadcn add https://21st.dev/r/marktantongco/pin-list</code>
                      <CopyBtn text="npx shadcn add https://21st.dev/r/marktantongco/pin-list" label="Copy" />
                    </div>
                    <p className="mt-3 text-xs text-zinc-500">
                      No API key in the URL. The shadcn CLI reads <code className="font-mono">TWENTYFIRST_TOKEN</code> from env.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-6">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400/80">Publish status</div>
                    <p className="text-sm text-zinc-300">
                      Component is built, lint-clean, render-tested, and ready in
                      <code className="mx-1 font-mono text-emerald-300">registry/pin-list/</code>.
                      Publish blocked by 21st.dev free-tier daily quota (resets daily).
                      Run the publish command after quota resets:
                    </p>
                    <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950/60 p-3">
                      <code className="break-all font-mono text-xs text-zinc-400">
                        21st publish registry/pin-list/pin-list-standalone.tsx --name "Pin List" --slug pin-list --public
                      </code>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* footer note */}
        <div className="mt-10 flex items-center gap-2 text-xs text-zinc-600">
          <Smartphone className="h-3.5 w-3.5" />
          Rendered live in a 375px mobile frame. Not a screenshot.
        </div>
      </div>
    </section>
  );
}
