import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/* Shared store — the connective tissue between Dashboard + Settings   */
/* ------------------------------------------------------------------ */

export type KpiId = "rev" | "users" | "orders" | "conv";
export type TimeRange = "7D" | "30D" | "90D" | "YTD";

export interface DashboardConfig {
  // which KPIs are visible on the dashboard
  visibleKpis: Set<KpiId>;
  // default time range when dashboard loads
  defaultRange: TimeRange;
  // refresh interval for real-time toast updates (seconds, 0 = off)
  refreshInterval: number;
  // dashboard title (user-customizable)
  dashboardTitle: string;
  // show/hide the data table
  showTable: boolean;
  // show/hide the bar chart
  showBarChart: boolean;
}

interface ConfigStore extends DashboardConfig {
  toggleKpi: (id: KpiId) => void;
  setDefaultRange: (r: TimeRange) => void;
  setRefreshInterval: (s: number) => void;
  setDashboardTitle: (t: string) => void;
  toggleTable: () => void;
  toggleBarChart: () => void;
  reset: () => void;
}

const DEFAULTS: DashboardConfig = {
  visibleKpis: new Set(["rev", "users", "orders", "conv"]),
  defaultRange: "30D",
  refreshInterval: 12,
  dashboardTitle: "The Dashboard",
  showTable: true,
  showBarChart: true,
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      toggleKpi: (id) =>
        set((s) => {
          const next = new Set(s.visibleKpis);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { visibleKpis: next };
        }),
      setDefaultRange: (r) => set({ defaultRange: r }),
      setRefreshInterval: (s) => set({ refreshInterval: s }),
      setDashboardTitle: (t) => set({ dashboardTitle: t }),
      toggleTable: () => set((s) => ({ showTable: !s.showTable })),
      toggleBarChart: () => set((s) => ({ showBarChart: !s.showBarChart })),
      reset: () => set({ ...DEFAULTS, visibleKpis: new Set(DEFAULTS.visibleKpis) }),
    }),
    {
      name: "dashboard-config",
      // Set serialization — persist as array, hydrate as Set
      storage: {
        getItem: (name) => {
          const raw = typeof window !== "undefined" ? localStorage.getItem(name) : null;
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          // rehydrate Set from array
          if (parsed?.state?.visibleKpis && Array.isArray(parsed.state.visibleKpis)) {
            parsed.state.visibleKpis = new Set(parsed.state.visibleKpis);
          }
          return parsed;
        },
        setItem: (name, value) => {
          // serialize Set as array
          const serializable = {
            ...value,
            state: {
              ...value.state,
              visibleKpis: Array.from(value.state.visibleKpis),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
