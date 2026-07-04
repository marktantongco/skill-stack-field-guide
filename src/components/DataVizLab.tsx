"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Zap,
  ArrowUpRight, ArrowDownRight, Sparkles,
} from "lucide-react";
import PinList, { type PinListItem } from "@/components/ui/pin-list";
import CommandPalette, { type CommandItem } from "@/components/ui/command-palette";
import ToastViewport, { useToasts } from "@/components/ui/toast";
import { Lock, Star, ShoppingCart as Cart, Users as UsersIcon, DollarSign as Dollar } from "lucide-react";

/* ================================================================== */
/* Mock data                                                           */
/* ================================================================== */

const TIME_RANGES = ["7D", "30D", "90D", "YTD"] as const;
type TimeRange = typeof TIME_RANGES[number];

interface KPIMetric {
  id: string;
  label: string;
  value: number;
  format: (n: number) => string;
  delta: number; // percentage
  icon: React.ElementType;
  data: { day: string; v: number }[];
}

function genSeries(base: number, vol: number, days: number): { day: string; v: number }[] {
  const out: { day: string; v: number }[] = [];
  let v = base;
  for (let i = 0; i < days; i++) {
    v += (Math.random() - 0.45) * vol;
    v = Math.max(0, v);
    out.push({ day: `D${i + 1}`, v: Math.round(v) });
  }
  return out;
}

const KPIS: Record<TimeRange, KPIMetric[]> = {
  "7D": [
    { id: "rev", label: "Revenue", value: 18420, format: (n) => `$${n.toLocaleString()}`, delta: 12.4, icon: DollarSign, data: genSeries(2500, 200, 7) },
    { id: "users", label: "Active users", value: 1284, format: (n) => n.toLocaleString(), delta: 8.1, icon: Users, data: genSeries(180, 15, 7) },
    { id: "orders", label: "Orders", value: 342, format: (n) => n.toLocaleString(), delta: -2.3, icon: ShoppingCart, data: genSeries(48, 6, 7) },
    { id: "conv", label: "Conversion", value: 4.2, format: (n) => `${n}%`, delta: 0.8, icon: Zap, data: genSeries(3.8, 0.3, 7) },
  ],
  "30D": [
    { id: "rev", label: "Revenue", value: 78420, format: (n) => `$${n.toLocaleString()}`, delta: 18.2, icon: DollarSign, data: genSeries(2500, 250, 30) },
    { id: "users", label: "Active users", value: 5284, format: (n) => n.toLocaleString(), delta: 22.7, icon: Users, data: genSeries(180, 20, 30) },
    { id: "orders", label: "Orders", value: 1442, format: (n) => n.toLocaleString(), delta: 5.1, icon: ShoppingCart, data: genSeries(48, 8, 30) },
    { id: "conv", label: "Conversion", value: 4.8, format: (n) => `${n}%`, delta: 1.2, icon: Zap, data: genSeries(3.8, 0.4, 30) },
  ],
  "90D": [
    { id: "rev", label: "Revenue", value: 218420, format: (n) => `$${n.toLocaleString()}`, delta: 34.6, icon: DollarSign, data: genSeries(2500, 300, 90) },
    { id: "users", label: "Active users", value: 14820, format: (n) => n.toLocaleString(), delta: 41.2, icon: Users, data: genSeries(180, 25, 90) },
    { id: "orders", label: "Orders", value: 4242, format: (n) => n.toLocaleString(), delta: 12.8, icon: ShoppingCart, data: genSeries(48, 10, 90) },
    { id: "conv", label: "Conversion", value: 5.1, format: (n) => `${n}%`, delta: 1.8, icon: Zap, data: genSeries(3.8, 0.5, 90) },
  ],
  "YTD": [
    { id: "rev", label: "Revenue", value: 684420, format: (n) => `$${n.toLocaleString()}`, delta: 92.4, icon: DollarSign, data: genSeries(2500, 400, 180) },
    { id: "users", label: "Active users", value: 38284, format: (n) => n.toLocaleString(), delta: 128.5, icon: Users, data: genSeries(180, 35, 180) },
    { id: "orders", label: "Orders", value: 12442, format: (n) => n.toLocaleString(), delta: 64.3, icon: ShoppingCart, data: genSeries(48, 15, 180) },
    { id: "conv", label: "Conversion", value: 5.8, format: (n) => `${n}%`, delta: 2.4, icon: Zap, data: genSeries(3.8, 0.6, 180) },
  ],
};

const BAR_DATA = [
  { name: "Mon", v: 2400 }, { name: "Tue", v: 1398 }, { name: "Wed", v: 3800 },
  { name: "Thu", v: 3908 }, { name: "Fri", v: 4800 }, { name: "Sat", v: 3800 },
  { name: "Sun", v: 4300 },
];

const TABLE_ROWS = [
  { id: "INV-001", customer: "Acme Corp", amount: "$4,200", status: "Paid", date: "Jul 1" },
  { id: "INV-002", customer: "Globex Inc", amount: "$1,800", status: "Pending", date: "Jul 1" },
  { id: "INV-003", customer: "Initech", amount: "$12,400", status: "Paid", date: "Jun 30" },
  { id: "INV-004", customer: "Umbrella Ltd", amount: "$3,200", status: "Overdue", date: "Jun 29" },
  { id: "INV-005", customer: "Hooli", amount: "$8,900", status: "Paid", date: "Jun 28" },
  { id: "INV-006", customer: "Soylent Co", amount: "$2,100", status: "Pending", date: "Jun 27" },
];

/* ================================================================== */
/* KPI card                                                            */
/* ================================================================== */

function KPICard({ kpi, pinned, onTogglePin }: { kpi: KPIMetric; pinned: boolean; onTogglePin: () => void }) {
  const isPositive = kpi.delta >= 0;
  const Icon = kpi.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition ${
        pinned
          ? "border-emerald-500/40 bg-emerald-500/[0.05]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-white/5 text-zinc-300">
            <Icon className="size-4" />
          </div>
          <span className="text-xs font-medium text-zinc-400">{kpi.label}</span>
        </div>
        <button
          onClick={onTogglePin}
          className="grid size-6 place-items-center rounded text-zinc-500 transition hover:text-emerald-300"
          aria-label={`${pinned ? "Unpin" : "Pin"} ${kpi.label}`}
          aria-pressed={pinned}
        >
          <Star className={`size-3.5 ${pinned ? "fill-emerald-400 text-emerald-400" : ""}`} />
        </button>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight text-white">
        {kpi.format(kpi.value)}
      </div>
      <div className="mt-1 flex items-center gap-1 text-xs">
        {isPositive ? (
          <ArrowUpRight className="size-3 text-emerald-400" />
        ) : (
          <ArrowDownRight className="size-3 text-rose-400" />
        )}
        <span className={isPositive ? "text-emerald-400" : "text-rose-400"}>
          {isPositive ? "+" : ""}{kpi.delta}%
        </span>
        <span className="text-zinc-500">vs prior</span>
      </div>
      {/* sparkline */}
      <div className="mt-3 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={kpi.data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={isPositive ? "#10B981" : "#EF4444"}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* Main Data Viz Lab                                                   */
/* ================================================================== */

export default function DataVizLab() {
  const [range, setRange] = React.useState<TimeRange>("30D");
  const [pinnedIds, setPinnedIds] = React.useState<Set<string>>(new Set(["rev"]));
  const [activeMetric, setActiveMetric] = React.useState<string>("rev");
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const { toasts, toast, dismiss } = useToasts();

  const kpis = KPIS[range];
  const activeKpi = kpis.find((k) => k.id === activeMetric) ?? kpis[0];

  // Pin list items (derived from KPIs)
  const pinItems: PinListItem[] = kpis.map((k) => ({
    id: k.id,
    name: k.label,
    info: k.format(k.value),
    icon: k.icon,
    pinned: pinnedIds.has(k.id),
    metadata: `${k.delta >= 0 ? "+" : ""}${k.delta}%`,
  }));

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Command palette items — switch metric + range
  const commandItems: CommandItem[] = [
    ...kpis.map((k) => ({
      id: `metric-${k.id}`,
      label: `View ${k.label}`,
      icon: k.icon,
      group: "Metrics",
      keywords: k.label.toLowerCase(),
      onSelect: () => {
        setActiveMetric(k.id);
        toast({ title: `${k.label} selected`, description: k.format(k.value), variant: "info", duration: 3000 });
      },
    })),
    ...TIME_RANGES.map((r) => ({
      id: `range-${r}`,
      label: `Range: ${r}`,
      icon: Sparkles,
      group: "Time range",
      keywords: r.toLowerCase(),
      onSelect: () => {
        setRange(r);
        toast({ title: `Range changed to ${r}`, variant: "success", duration: 2500 });
      },
    })),
  ];

  // Simulate real-time data update every 12s
  React.useEffect(() => {
    const interval = setInterval(() => {
      const kpi = kpis[Math.floor(Math.random() * kpis.length)];
      toast({
        title: `${kpi.label} updated`,
        description: `New value: ${kpi.format(kpi.value)}`,
        variant: "success",
        duration: 4000,
      });
    }, 12000);
    return () => clearInterval(interval);
  }, [range, kpis, toast]);

  // Cmd+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const statusTone: Record<string, string> = {
    Paid: "text-emerald-400 bg-emerald-500/10",
    Pending: "text-amber-400 bg-amber-500/10",
    Overdue: "text-rose-400 bg-rose-500/10",
  };

  return (
    <section className="border-y border-white/5 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-5 py-20">
        {/* header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/70">10 — data viz lab</div>
            <h2 id="data-viz" className="scroll-mt-24 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              The Dashboard
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              A live analytics surface that <strong className="text-white">consumes</strong> the Component Lab —
              Toast fires on data updates, Command Palette switches metrics (⌘K), Pin List favorites KPIs.
              This is the system, not the list.
            </p>
          </div>
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 transition hover:text-white sm:inline-flex"
          >
            ⌘K <span className="text-zinc-600">switch metric</span>
          </button>
        </div>

        {/* time range selector */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {TIME_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  range === r ? "text-emerald-950" : "text-zinc-400 hover:text-white"
                }`}
              >
                {range === r && (
                  <motion.div
                    layoutId="range-pill"
                    className="absolute inset-0 rounded-lg bg-emerald-400"
                  />
                )}
                <span className="relative z-10">{r}</span>
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-zinc-500">Updated 12s ago</span>
        </div>

        {/* KPI row */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis
            .slice()
            .sort((a, b) => Number(pinnedIds.has(b.id)) - Number(pinnedIds.has(a.id)))
            .map((kpi) => (
              <KPICard
                key={kpi.id}
                kpi={kpi}
                pinned={pinnedIds.has(kpi.id)}
                onTogglePin={() => togglePin(kpi.id)}
              />
            ))}
        </div>

        {/* charts + pin list */}
        <div className="mb-8 grid gap-4 lg:grid-cols-3">
          {/* line chart (active metric) — spans 2 */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{activeKpi.label} trend</h3>
                <p className="text-xs text-zinc-500">{range} · {activeKpi.format(activeKpi.value)}</p>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeKpi.data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0F172A", border: "1px solid #334155",
                      borderRadius: 8, fontSize: 12, color: "#F8FAFC",
                    }}
                  />
                  <Line type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* pin list (favorite metrics) */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Favorite metrics</h3>
            <p className="mb-4 text-xs text-zinc-500">Click to pin/unpin. Pinned metrics sort to top.</p>
            <PinList
              items={pinItems}
              onTogglePin={(id) => togglePin(String(id))}
              labels={{ pinned: "Pinned", unpinned: "All metrics" }}
            />
          </div>
        </div>

        {/* bar chart + table */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* bar chart */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">Orders by day</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BAR_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0F172A", border: "1px solid #334155",
                      borderRadius: 8, fontSize: 12, color: "#F8FAFC",
                    }}
                    cursor={{ fill: "rgba(124,58,237,0.1)" }}
                  />
                  <Bar dataKey="v" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* data table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">Recent invoices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-zinc-500">
                    <th className="pb-2 font-medium">Invoice</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 text-right font-medium">Amount</th>
                    <th className="pb-2 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row) => (
                    <tr key={row.id} className="border-b border-white/5 last:border-0">
                      <td className="py-2.5 font-mono text-xs text-zinc-300">{row.id}</td>
                      <td className="py-2.5 text-zinc-200">{row.customer}</td>
                      <td className="py-2.5 text-right font-mono text-zinc-300">{row.amount}</td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${statusTone[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* system note */}
        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <Sparkles className="h-4 w-4" /> This is the system
          </h4>
          <p className="text-xs leading-relaxed text-zinc-400">
            This dashboard <strong className="text-white">consumes</strong> three components from the Lab:
            Toast (fires on data updates every 12s), Command Palette (⌘K to switch metrics + ranges),
            Pin List (favorite KPIs sort to top). The portfolio is no longer a list of components —
            it's a system where each component earns its keep by serving a real surface.
          </p>
        </div>
      </div>

      {/* Command palette overlay */}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={commandItems}
        placeholder="Switch metric or time range…"
      />

      {/* Toast viewport */}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </section>
  );
}
