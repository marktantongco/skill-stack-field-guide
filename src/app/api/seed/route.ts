import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/seed — populates the database with KPI mock data.
 * Idempotent: upserts (creates or updates) each metric.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function genSeries(base: number, vol: number, days: number) {
  const out: { day: string; v: number }[] = [];
  let v = base;
  for (let i = 0; i < days; i++) {
    v += (Math.random() - 0.45) * vol;
    v = Math.max(0, v);
    out.push({ day: `D${i + 1}`, v: Math.round(v) });
  }
  return out;
}

const KPIS = [
  { kpiId: "rev", label: "Revenue", icon: "DollarSign" },
  { kpiId: "users", label: "Active users", icon: "Users" },
  { kpiId: "orders", label: "Orders", icon: "ShoppingCart" },
  { kpiId: "conv", label: "Conversion", icon: "Zap" },
];

const RANGES: Record<string, { base: number; vol: number; days: number; delta: number; value: number }[]> = {
  "7D": [
    { base: 2500, vol: 200, days: 7, delta: 12.4, value: 18420 },
    { base: 180, vol: 15, days: 7, delta: 8.1, value: 1284 },
    { base: 48, vol: 6, days: 7, delta: -2.3, value: 342 },
    { base: 3.8, vol: 0.3, days: 7, delta: 0.8, value: 4.2 },
  ],
  "30D": [
    { base: 2500, vol: 250, days: 30, delta: 18.2, value: 78420 },
    { base: 180, vol: 20, days: 30, delta: 22.7, value: 5284 },
    { base: 48, vol: 8, days: 30, delta: 5.1, value: 1442 },
    { base: 3.8, vol: 0.4, days: 30, delta: 1.2, value: 4.8 },
  ],
  "90D": [
    { base: 2500, vol: 300, days: 90, delta: 34.6, value: 218420 },
    { base: 180, vol: 25, days: 90, delta: 41.2, value: 14820 },
    { base: 48, vol: 10, days: 90, delta: 12.8, value: 4242 },
    { base: 3.8, vol: 0.5, days: 90, delta: 1.8, value: 5.1 },
  ],
  "YTD": [
    { base: 2500, vol: 400, days: 180, delta: 92.4, value: 684420 },
    { base: 180, vol: 35, days: 180, delta: 128.5, value: 38284 },
    { base: 48, vol: 15, days: 180, delta: 64.3, value: 12442 },
    { base: 3.8, vol: 0.6, days: 180, delta: 2.4, value: 5.8 },
  ],
};

export async function POST() {
  try {
    let count = 0;
    for (const range of Object.keys(RANGES)) {
      const configs = RANGES[range];
      for (let i = 0; i < KPIS.length; i++) {
        const kpi = KPIS[i];
        const cfg = configs[i];
        const series = genSeries(cfg.base, cfg.vol, cfg.days);
        await db.kpiMetric.upsert({
          where: { kpiId_range: { kpiId: kpi.kpiId, range } },
          update: {
            label: kpi.label,
            value: cfg.value,
            delta: cfg.delta,
            series: JSON.stringify(series),
            icon: kpi.icon,
          },
          create: {
            kpiId: kpi.kpiId,
            label: kpi.label,
            range,
            value: cfg.value,
            delta: cfg.delta,
            series: JSON.stringify(series),
            icon: kpi.icon,
          },
        });
        count++;
      }
    }

    // also create default config (findFirst for null userId — Prisma findUnique doesn't accept null)
    const existingConfig = await db.dashboardConfig.findFirst({ where: { userId: null } });
    if (!existingConfig) {
      await db.dashboardConfig.create({
        data: {
          userId: null,
          dashboardTitle: "The Dashboard",
          defaultRange: "30D",
          refreshInterval: 12,
          showTable: true,
          showBarChart: true,
          visibleKpis: "rev,users,orders,conv",
        },
      });
    }

    return NextResponse.json({ seeded: true, metricsCount: count, ranges: Object.keys(RANGES) });
  } catch (err) {
    return NextResponse.json(
      { error: "Seed failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
