"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, RotateCcw, Save, Eye, EyeOff,
  DollarSign, Users, ShoppingCart, Zap, Table, BarChart3,
} from "lucide-react";
import { useConfigStore, type KpiId, type TimeRange } from "@/lib/config-store";
import { useToasts, ToastViewport } from "@/components/ui/toast";

/* ------------------------------------------------------------------ */
/* Toggle switch (brand-styled)                                       */
/* ------------------------------------------------------------------ */

function Toggle({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        {description && <div className="text-xs text-zinc-500">{description}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-emerald-500" : "bg-zinc-700"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm ${
            checked ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* KPI toggle row                                                     */
/* ------------------------------------------------------------------ */

const KPI_META: Record<KpiId, { label: string; icon: React.ElementType }> = {
  rev: { label: "Revenue", icon: DollarSign },
  users: { label: "Active users", icon: Users },
  orders: { label: "Orders", icon: ShoppingCart },
  conv: { label: "Conversion", icon: Zap },
};

/* ------------------------------------------------------------------ */
/* Main Settings Lab                                                  */
/* ------------------------------------------------------------------ */

export default function SettingsLab() {
  const {
    visibleKpis, defaultRange, refreshInterval,
    dashboardTitle, showTable, showBarChart,
    toggleKpi, setDefaultRange, setRefreshInterval,
    setDashboardTitle, toggleTable, toggleBarChart, reset,
  } = useConfigStore();

  const { toasts, toast, dismiss } = useToasts();
  const [titleDraft, setTitleDraft] = React.useState(dashboardTitle);

  // debounce title save
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (titleDraft !== dashboardTitle) {
        setDashboardTitle(titleDraft);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [titleDraft, dashboardTitle, setDashboardTitle]);

  const onSave = (msg: string) => {
    toast({ title: "Settings saved", description: msg, variant: "success", duration: 2500 });
  };

  const ranges: TimeRange[] = ["7D", "30D", "90D", "YTD"];

  return (
    <section className="border-y border-white/5 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="mx-auto max-w-4xl px-5 py-20">
        {/* header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/70">11 — settings lab</div>
            <h2 id="settings" className="scroll-mt-24 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              The Controls
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Configure the Dashboard above. Toggle KPIs, set defaults, control refresh.
              Changes persist to localStorage — refresh the page, your settings survive.
              This is the third factory: it <strong className="text-white">consumes</strong> the Dashboard.
            </p>
          </div>
          <button
            onClick={() => {
              reset();
              setTitleDraft("The Dashboard");
              toast({ title: "Settings reset", description: "All defaults restored.", variant: "warning", duration: 2500 });
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 transition hover:text-white hover:border-rose-500/40"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        {/* settings panels */}
        <div className="space-y-4">
          {/* panel 1: dashboard title */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-4 text-sm font-semibold text-white">Dashboard title</h3>
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={() => onSave(`Title updated to "${titleDraft}"`)}
              placeholder="The Dashboard"
              className="h-10 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-sm text-white outline-none transition focus:border-emerald-500/50"
              aria-label="Dashboard title"
            />
            <p className="mt-2 text-xs text-zinc-500">Auto-saves 600ms after you stop typing.</p>
          </div>

          {/* panel 2: visible KPIs */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-2 text-sm font-semibold text-white">Visible KPIs</h3>
            <p className="mb-4 text-xs text-zinc-500">Toggle which metrics appear on the Dashboard. At least one must stay on.</p>
            <div className="divide-y divide-white/5">
              {(Object.keys(KPI_META) as KpiId[]).map((id) => {
                const meta = KPI_META[id];
                const Icon = meta.icon;
                const isVisible = visibleKpis.has(id);
                const canToggle = visibleKpis.size > 1 || !isVisible;
                return (
                  <div key={id} className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-lg bg-white/5 text-zinc-300">
                        <Icon className="size-4" />
                      </div>
                      <span className="text-sm font-medium text-white">{meta.label}</span>
                    </div>
                    <button
                      role="switch"
                      aria-checked={isVisible}
                      aria-label={`Toggle ${meta.label}`}
                      disabled={!canToggle}
                      onClick={() => {
                        toggleKpi(id);
                        onSave(`${meta.label} ${isVisible ? "hidden" : "shown"}`);
                      }}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-30 ${
                        isVisible ? "bg-emerald-500" : "bg-zinc-700"
                      }`}
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm ${
                          isVisible ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* panel 3: default time range */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-2 text-sm font-semibold text-white">Default time range</h3>
            <p className="mb-4 text-xs text-zinc-500">Which range the Dashboard loads with on first visit.</p>
            <div className="flex gap-2">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setDefaultRange(r);
                    onSave(`Default range: ${r}`);
                  }}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition ${
                    defaultRange === r
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* panel 4: refresh interval */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Real-time refresh interval</h3>
              <span className="font-mono text-sm text-emerald-300">
                {refreshInterval === 0 ? "Off" : `${refreshInterval}s`}
              </span>
            </div>
            <p className="mb-4 text-xs text-zinc-500">How often the Dashboard fires "data updated" toasts. 0 = disabled.</p>
            <input
              type="range"
              min={0}
              max={30}
              step={3}
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              onMouseUp={() => onSave(`Refresh: ${refreshInterval}s`)}
              onTouchEnd={() => onSave(`Refresh: ${refreshInterval}s`)}
              className="w-full accent-emerald-500"
              aria-label="Refresh interval in seconds"
            />
            <div className="mt-1 flex justify-between text-xs text-zinc-600">
              <span>Off</span>
              <span>15s</span>
              <span>30s</span>
            </div>
          </div>

          {/* panel 5: surface toggles */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="mb-2 text-sm font-semibold text-white">Dashboard surfaces</h3>
            <p className="mb-2 text-xs text-zinc-500">Show or hide sections of the Dashboard.</p>
            <div className="divide-y divide-white/5">
              <Toggle
                checked={showTable}
                onChange={() => {
                  toggleTable();
                  onSave(`Data table ${showTable ? "hidden" : "shown"}`);
                }}
                label="Data table"
                description="Recent invoices with status badges"
              />
              <Toggle
                checked={showBarChart}
                onChange={() => {
                  toggleBarChart();
                  onSave(`Bar chart ${showBarChart ? "hidden" : "shown"}`);
                }}
                label="Bar chart"
                description="Orders by day of week"
              />
            </div>
          </div>

          {/* system note */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Save className="h-4 w-4" /> Three layers, one system
            </h4>
            <p className="text-xs leading-relaxed text-zinc-400">
              This is the third factory. It <strong className="text-white">consumes</strong> the Dashboard
              (writes config to a shared Zustand store) and the Component Lab (Toast fires on every save).
              The portfolio is now a 3-layer system: <strong className="text-white">Components → Dashboard → Controls</strong>.
              Each layer proves the previous one was built right — because it can be composed, configured, and extended.
            </p>
          </div>
        </div>
      </div>

      {/* Toast viewport — renders toasts from SettingsLab interactions */}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </section>
  );
}
