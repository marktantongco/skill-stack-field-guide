import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/* Shared store — the connective tissue between Dashboard + Settings   */
/* FULL-STACK: hydrates from /api/config on mount, persists to         */
/* /api/config (PUT) on every change. localStorage is the fallback     */
/* cache for offline + instant load.                                   */
/* ------------------------------------------------------------------ */

export type KpiId = "rev" | "users" | "orders" | "conv";
export type TimeRange = "7D" | "30D" | "90D" | "YTD";

export interface DashboardConfig {
  visibleKpis: Set<KpiId>;
  defaultRange: TimeRange;
  refreshInterval: number;
  dashboardTitle: string;
  showTable: boolean;
  showBarChart: boolean;
}

interface ConfigStore extends DashboardConfig {
  hydrated: boolean;
  toggleKpi: (id: KpiId) => void;
  setDefaultRange: (r: TimeRange) => void;
  setRefreshInterval: (s: number) => void;
  setDashboardTitle: (t: string) => void;
  toggleTable: () => void;
  toggleBarChart: () => void;
  reset: () => void;
  hydrateFromBackend: () => Promise<void>;
}

const DEFAULTS: DashboardConfig = {
  visibleKpis: new Set(["rev", "users", "orders", "conv"]),
  defaultRange: "30D",
  refreshInterval: 12,
  dashboardTitle: "The Dashboard",
  showTable: true,
  showBarChart: true,
};

// Debounced PUT to backend
let putTimer: ReturnType<typeof setTimeout> | null = null;
function persistToBackend(state: DashboardConfig) {
  if (typeof window === "undefined") return;
  if (putTimer) clearTimeout(putTimer);
  putTimer = setTimeout(() => {
    fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dashboardTitle: state.dashboardTitle,
        defaultRange: state.defaultRange,
        refreshInterval: state.refreshInterval,
        showTable: state.showTable,
        showBarChart: state.showBarChart,
        visibleKpis: Array.from(state.visibleKpis),
      }),
    }).catch(() => { /* silent — localStorage is the fallback */ });
  }, 800);
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      hydrated: false,

      toggleKpi: (id) =>
        set((s) => {
          const next = new Set(s.visibleKpis);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          const newState = { visibleKpis: next };
          persistToBackend({ ...s, ...newState });
          return newState;
        }),
      setDefaultRange: (r) => {
        set({ defaultRange: r });
        persistToBackend({ ...get() });
      },
      setRefreshInterval: (s) => {
        set({ refreshInterval: s });
        persistToBackend({ ...get() });
      },
      setDashboardTitle: (t) => {
        set({ dashboardTitle: t });
        persistToBackend({ ...get() });
      },
      toggleTable: () => {
        set((s) => ({ showTable: !s.showTable }));
        persistToBackend({ ...get() });
      },
      toggleBarChart: () => {
        set((s) => ({ showBarChart: !s.showBarChart }));
        persistToBackend({ ...get() });
      },
      reset: () => {
        set({ ...DEFAULTS, visibleKpis: new Set(DEFAULTS.visibleKpis) });
        persistToBackend({ ...DEFAULTS, visibleKpis: new Set(DEFAULTS.visibleKpis) });
      },

      // Hydrate from backend on mount — overwrites localStorage if backend has data
      hydrateFromBackend: async () => {
        try {
          const res = await fetch("/api/config");
          const d = await res.json();
          if (d?.config) {
            const c = d.config;
            set({
              dashboardTitle: c.dashboardTitle ?? DEFAULTS.dashboardTitle,
              defaultRange: (c.defaultRange as TimeRange) ?? DEFAULTS.defaultRange,
              refreshInterval: c.refreshInterval ?? DEFAULTS.refreshInterval,
              showTable: c.showTable ?? DEFAULTS.showTable,
              showBarChart: c.showBarChart ?? DEFAULTS.showBarChart,
              visibleKpis: new Set((c.visibleKpis as KpiId[]) ?? Array.from(DEFAULTS.visibleKpis)),
              hydrated: true,
            });
          } else {
            set({ hydrated: true });
          }
        } catch {
          set({ hydrated: true }); // fallback to localStorage
        }
      },
    }),
    {
      name: "dashboard-config",
      storage: {
        getItem: (name) => {
          const raw = typeof window !== "undefined" ? localStorage.getItem(name) : null;
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          if (parsed?.state?.visibleKpis && Array.isArray(parsed.state.visibleKpis)) {
            parsed.state.visibleKpis = new Set(parsed.state.visibleKpis);
          }
          return parsed;
        },
        setItem: (name, value) => {
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
