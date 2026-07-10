import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/metrics?range=7D|30D|90D|YTD
 * Returns KPI metrics for the given time range.
 * If no range, returns all.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range");

  try {
    const where = range ? { range } : {};
    const metrics = await db.kpiMetric.findMany({ where });

    if (metrics.length === 0) {
      return NextResponse.json(
        { error: "No metrics found. Run /api/seed first.", count: 0, results: [] },
        { status: 200 }
      );
    }

    const results = metrics.map((m) => ({
      id: m.kpiId,
      label: m.label,
      value: m.value,
      delta: m.delta,
      icon: m.icon,
      data: JSON.parse(m.series),
    }));

    return NextResponse.json({ count: results.length, range: range ?? "all", results });
  } catch (err) {
    return NextResponse.json(
      { error: "Database error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
