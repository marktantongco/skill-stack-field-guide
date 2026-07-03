"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, Code2, Terminal, Copy, Check, Package, Eye,
  Lock, Bell, CreditCard, User, Mail, Bookmark,
  Search, Settings, Moon, Sun, Download, LogOut, Plus, FileText,
  Command as CommandIcon, Zap,
} from "lucide-react";
import PinList, { type PinListItem } from "@/components/ui/pin-list";
import CommandPalette, { type CommandItem } from "@/components/ui/command-palette";

/* ================================================================== */
/* Component registry — each entry is a lab component                 */
/* ================================================================== */

interface LabComponent {
  id: string;
  name: string;
  tagline: string;
  version: string;
  preview: React.ReactNode;
  tryIts: string[];
  builtWith: string[];
  brandAlignment: string;
  code: string;
  installCmd: string;
}

/* ------------------------------------------------------------------ */
/* Pin List data                                                      */
/* ------------------------------------------------------------------ */

const PIN_ITEMS: PinListItem[] = [
  { id: 1, name: "Account security", info: "2FA, password, sessions", icon: Lock, pinned: true, metadata: "2FA" },
  { id: 2, name: "Notifications", info: "Email, push, SMS", icon: Bell, pinned: true, metadata: "3" },
  { id: 3, name: "Payment methods", info: "Cards, banks, wallets", icon: CreditCard },
  { id: 4, name: "Profile", info: "Name, photo, bio", icon: User },
  { id: 5, name: "Email preferences", info: "Marketing, product, security", icon: Mail },
  { id: 6, name: "Bookmarks", info: "48 saved", icon: Bookmark },
];

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
        <input type="search" value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search…" />
      )}
      <LayoutGroup>
        {pinned.length > 0 && (
          <section>
            <p>Pinned · {pinned.length}</p>
            {pinned.map(item => (
              <motion.div key={item.id}
                layoutId={\`item-\${item.id}\`}
                onClick={() => toggle(item.id)}
                transition={{ stiffness: 320, damping: 22, type: "spring" }}
                className="flex min-h-[56px] cursor-pointer items-center
                           justify-between rounded-2xl bg-neutral-100 p-2.5">
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
      </LayoutGroup>
    </motion.div>
  );
}`;

/* ------------------------------------------------------------------ */
/* Command Palette data                                               */
/* ------------------------------------------------------------------ */

const COMMAND_ITEMS: CommandItem[] = [
  { id: "cmd-1", label: "Create new invoice", icon: Plus, group: "Actions", keywords: "new add create invoice", shortcut: ["⌘", "N"], onSelect: () => {} },
  { id: "cmd-2", label: "Search transactions", icon: Search, group: "Actions", keywords: "find filter transactions", shortcut: ["⌘", "F"], onSelect: () => {} },
  { id: "cmd-3", label: "Export to CSV", icon: Download, group: "Actions", keywords: "export download csv", onSelect: () => {} },
  { id: "cmd-4", label: "Toggle theme", icon: Sun, group: "Preferences", keywords: "dark light theme mode", shortcut: ["⌘", "D"], onSelect: () => {} },
  { id: "cmd-5", label: "Settings", icon: Settings, group: "Preferences", keywords: "settings preferences config", onSelect: () => {} },
  { id: "cmd-6", label: "View documentation", icon: FileText, group: "Help", keywords: "docs help guide", onSelect: () => {} },
  { id: "cmd-7", label: "Sign out", icon: LogOut, group: "Account", keywords: "logout signout exit", onSelect: () => {} },
];

const COMMAND_PALETTE_CODE = `import * as React from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ElementType;
  group: string;
  keywords?: string;
  shortcut?: string[];
  onSelect?: () => void;
}

export default function CommandPalette({ open, onOpenChange, items }) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQuery(""); setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Fuzzy match: case-insensitive substring, weighted by position
  const fuzzy = (q, t) => {
    if (!q) return 1;
    const idx = t.toLowerCase().indexOf(q.toLowerCase());
    return idx === -1 ? 0 : 1 - idx / (t.length + 1);
  };

  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    return items.map(item => ({
      item, score: Math.max(
        fuzzy(query, item.label),
        fuzzy(query, item.keywords || ""),
        fuzzy(query, item.group),
      ),
    })).filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.item);
  }, [items, query]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[active];
      if (item && !item.disabled) {
        item.onSelect?.();
        onOpenChange(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center
                     bg-zinc-950/60 backdrop-blur-sm pt-[15vh] px-4"
          onClick={() => onOpenChange(false)}
          role="dialog" aria-modal="true" aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            onClick={e => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="w-full max-w-xl overflow-hidden rounded-2xl
                       border border-neutral-200 bg-white shadow-2xl
                       dark:border-neutral-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3 border-b px-4">
              <Search className="size-4 text-neutral-400" />
              <input ref={inputRef} type="text" value={query}
                onChange={e => { setQuery(e.target.value); setActive(0); }}
                placeholder="Search commands…"
                aria-autocomplete="list"
                className="h-12 flex-1 bg-transparent text-sm outline-none" />
            </div>
            <div role="listbox" className="max-h-[320px] overflow-y-auto p-2">
              {filtered.map((item, idx) => (
                <div key={item.id} role="option" aria-selected={idx === active}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => { item.onSelect?.(); onOpenChange(false); }}
                  className={"flex min-h-[44px] cursor-pointer items-center " +
                    (idx === active ? "bg-neutral-100 dark:bg-neutral-800" : "")}>
                  {item.icon && <item.icon className="size-4" />}
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.shortcut?.map(k => <kbd key={k}>{k}</kbd>)}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}`;

/* ------------------------------------------------------------------ */
/* Command palette demo wrapper (trigger button + palette)            */
/* ------------------------------------------------------------------ */

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
      >
        <Search className="size-4" />
        Search commands
        <kbd className="ml-2 inline-flex h-5 items-center gap-0.5 rounded border border-neutral-300 bg-neutral-100 px-1.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
          ⌘K
        </kbd>
      </button>
      <p className="text-center text-xs text-neutral-400">
        Click the button or press <kbd className="rounded border border-neutral-300 px-1 font-mono dark:border-neutral-700">⌘K</kbd> / <kbd className="rounded border border-neutral-300 px-1 font-mono dark:border-neutral-700">Ctrl+K</kbd>
      </p>
      <CommandPalette open={open} onOpenChange={setOpen} items={COMMAND_ITEMS} />
    </div>
  );
}

/* ================================================================== */
/* Lab components registry                                            */
/* ================================================================== */

const LAB_COMPONENTS: LabComponent[] = [
  {
    id: "pin-list",
    name: "Pin List",
    tagline: "Mobile-first animated pin-list · 56px touch targets · a11y · spring physics",
    version: "v1.0.0",
    preview: <PinListDemoWrapper />,
    tryIts: [
      "Tap any row to pin/unpin",
      "Type in search to filter live",
      "Right-click a pinned item to quick-unpin",
      "Keyboard: Tab to focus, Enter to toggle",
    ],
    builtWith: ["motion/react", "lucide-react", "Tailwind 4", "TypeScript"],
    brandAlignment:
      "56px touch targets (mobile-first). 150ms micro feedback on pin. Spring physics that never block user intent. WCAG AA contrast. Clear, competent, empathetic — never smug.",
    code: PIN_LIST_CODE,
    installCmd: "21st add @marktantongco/pin-list",
  },
  {
    id: "command-palette",
    name: "Command Palette",
    tagline: "Cmd+K fuzzy search · arrow-key nav · focus trap · grouped results · 44px targets",
    version: "v1.0.0",
    preview: <CommandPaletteDemo />,
    tryIts: [
      "Press ⌘K or Ctrl+K to open",
      "Type 'invoice' or 'theme' to fuzzy-search",
      "Arrow keys to navigate, Enter to select",
      "Esc to close — focus returns to trigger",
    ],
    builtWith: ["motion/react", "lucide-react", "Tailwind 4", "TypeScript"],
    brandAlignment:
      "Keyboard-first (function before form). 150ms overlay fade, 200ms panel scale — no animation blocks intent. Focus trap + aria-activedescendant for screen readers. WCAG AA. Tools that actually work.",
    code: COMMAND_PALETTE_CODE,
    installCmd: "21st add @marktantongco/command-palette",
  },
];

/* ------------------------------------------------------------------ */
/* Pin list demo wrapper (stateful)                                   */
/* ------------------------------------------------------------------ */

function PinListDemoWrapper() {
  const [items, setItems] = useState(PIN_ITEMS);
  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Settings</h2>
      <PinList
        items={items}
        onItemsChange={setItems}
        enableSearch
        enableQuickUnpin
        labels={{ pinned: "Pinned", unpinned: "All items", searchPlaceholder: "Search settings…" }}
      />
    </div>
  );
}

/* ================================================================== */
/* Shared UI primitives                                               */
/* ================================================================== */

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[375px]">
      <div className="relative overflow-hidden rounded-[2.5rem] border-[8px] border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between bg-zinc-950 px-6 pb-1 pt-3 text-[10px] font-medium text-zinc-400">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-zinc-500" />
            <span className="h-2.5 w-4 rounded-sm bg-zinc-500" />
            <span className="h-2.5 w-5 rounded-sm bg-zinc-300" />
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-950" style={{ minHeight: "520px" }}>
          {children}
        </div>
        <div className="flex justify-center bg-zinc-950 py-2">
          <div className="h-1 w-32 rounded-full bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
      aria-label={`Copy ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{copied ? "Copied" : label}</span>
    </button>
  );
}

/* ================================================================== */
/* Main Component Lab                                                 */
/* ================================================================== */

export default function ComponentLab() {
  const [tab, setTab] = useState<"preview" | "code" | "install">("preview");
  const [activeComp, setActiveComp] = useState(0);
  const comp = LAB_COMPONENTS[activeComp];

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
              Live components, rendered in real frames. Not screenshots — interactive. Each built to the brand system:
              mobile-first, accessible, motion that never blocks intent.
            </p>
          </div>
        </div>

        {/* component selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {LAB_COMPONENTS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setActiveComp(i); setTab("preview"); }}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                activeComp === i
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/30"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              {c.name}
            </button>
          ))}
        </div>

        {/* component title */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{comp.name}</h3>
            <p className="text-sm text-zinc-500">{comp.tagline}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {comp.version} · @marktantongco
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
                  <motion.div layoutId="lab-tab-indicator" className="absolute inset-x-0 -bottom-px h-0.5 bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* tab content */}
        <AnimatePresence mode="wait">
          {tab === "preview" && (
            <motion.div
              key={`preview-${comp.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            >
              <div className="grid gap-8 lg:grid-cols-2">
                {/* preview — mobile frame for pin-list, centered for command-palette */}
                <div className={comp.id === "pin-list" ? "" : "flex items-center justify-center"}>
                  {comp.id === "pin-list" ? (
                    <MobileFrame>{comp.preview}</MobileFrame>
                  ) : (
                    comp.preview
                  )}
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h4 className="mb-3 text-sm font-semibold text-white">Try it</h4>
                    <ul className="space-y-2 text-sm text-zinc-400">
                      {comp.tryIts.map((t, i) => (
                        <li key={i} className="flex gap-2"><span className="text-emerald-400">→</span> {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h4 className="mb-3 text-sm font-semibold text-white">Built with</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.builtWith.map((s) => (
                        <span key={s} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-400">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
                    <h4 className="mb-2 text-sm font-semibold text-emerald-300">Brand alignment</h4>
                    <p className="text-xs leading-relaxed text-zinc-400">{comp.brandAlignment}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "code" && (
            <motion.div
              key={`code-${comp.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <span className="font-mono text-xs text-zinc-500">{comp.id}.tsx</span>
                  <CopyBtn text={comp.code} label="Copy code" />
                </div>
                <pre className="max-h-[32rem] overflow-y-auto p-4 text-xs leading-relaxed">
                  <code className="font-mono text-zinc-300">{comp.code}</code>
                </pre>
              </div>
            </motion.div>
          )}

          {tab === "install" && (
            <motion.div
              key={`install-${comp.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            >
              <div className="mx-auto max-w-2xl space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Install via 21st.dev CLI</div>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                    <code className="break-all font-mono text-sm text-emerald-300">$ {comp.installCmd}</code>
                    <CopyBtn text={comp.installCmd} label="Copy" />
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">
                    Requires <code className="font-mono">@21st-dev/cli</code>. Auth via <code className="font-mono">TWENTYFIRST_TOKEN</code> env var.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Or via shadcn CLI</div>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-950/60 p-4">
                    <code className="break-all font-mono text-sm text-emerald-300">npx shadcn add https://21st.dev/r/marktantongco/{comp.id}</code>
                    <CopyBtn text={`npx shadcn add https://21st.dev/r/marktantongco/${comp.id}`} label="Copy" />
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400/80">Publish status</div>
                  <p className="text-sm text-zinc-300">
                    Component is built, lint-clean, render-tested, and ready in <code className="font-mono text-emerald-300">registry/{comp.id}/</code>.
                    Publish blocked by 21st.dev free-tier daily quota (resets daily).
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-2 text-xs text-zinc-600">
          <Smartphone className="h-3.5 w-3.5" />
          Rendered live. Not a screenshot.
        </div>
      </div>
    </section>
  );
}
