import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/config — returns the authenticated user's dashboard config
 * PUT /api/config — updates the config (body: partial DashboardConfig)
 *
 * MULTI-USER: userId comes from the NextAuth session (JWT).
 * Unauthenticated requests fall back to null userId (demo/shared config).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULTS = {
  dashboardTitle: "The Dashboard",
  defaultRange: "30D" as const,
  refreshInterval: 12,
  showTable: true,
  showBarChart: true,
  visibleKpis: ["rev", "users", "orders", "conv"] as const,
};

async function getOrCreateConfig(userId: string | null) {
  // For nullable userId (demo user), use findFirst — Prisma findUnique doesn't accept null
  const existing = userId
    ? await db.dashboardConfig.findUnique({ where: { userId } })
    : await db.dashboardConfig.findFirst({ where: { userId: null } });
  if (existing) {
    return {
      id: existing.id,
      dashboardTitle: existing.dashboardTitle,
      defaultRange: existing.defaultRange,
      refreshInterval: existing.refreshInterval,
      showTable: existing.showTable,
      showBarChart: existing.showBarChart,
      visibleKpis: existing.visibleKpis.split(",").filter(Boolean),
    };
  }
  // create with defaults
  const created = await db.dashboardConfig.create({
    data: {
      userId,
      dashboardTitle: DEFAULTS.dashboardTitle,
      defaultRange: DEFAULTS.defaultRange,
      refreshInterval: DEFAULTS.refreshInterval,
      showTable: DEFAULTS.showTable,
      showBarChart: DEFAULTS.showBarChart,
      visibleKpis: DEFAULTS.visibleKpis.join(","),
    },
  });
  return {
    dashboardTitle: created.dashboardTitle,
    defaultRange: created.defaultRange,
    refreshInterval: created.refreshInterval,
    showTable: created.showTable,
    showBarChart: created.showBarChart,
    visibleKpis: created.visibleKpis.split(",").filter(Boolean),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id ?? null; // null = demo/shared config

  try {
    const config = await getOrCreateConfig(userId);
    return NextResponse.json({ config, source: "database", userId: userId ?? "demo" });
  } catch (err) {
    return NextResponse.json(
      { error: "Database error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id ?? null;

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body.dashboardTitle === "string") data.dashboardTitle = body.dashboardTitle;
    if (typeof body.defaultRange === "string") data.defaultRange = body.defaultRange;
    if (typeof body.refreshInterval === "number") data.refreshInterval = body.refreshInterval;
    if (typeof body.showTable === "boolean") data.showTable = body.showTable;
    if (typeof body.showBarChart === "boolean") data.showBarChart = body.showBarChart;
    if (Array.isArray(body.visibleKpis)) data.visibleKpis = body.visibleKpis.join(",");

    // upsert — create if not exists, update if exists
    // For nullable userId (demo), use findFirst + update by id
    const existing = userId
      ? await db.dashboardConfig.findUnique({ where: { userId } })
      : await db.dashboardConfig.findFirst({ where: { userId: null } });
    let config;
    if (existing) {
      config = await db.dashboardConfig.update({ where: { id: existing.id }, data });
    } else {
      config = await db.dashboardConfig.create({
        data: {
          userId,
          dashboardTitle: body.dashboardTitle ?? DEFAULTS.dashboardTitle,
          defaultRange: body.defaultRange ?? DEFAULTS.defaultRange,
          refreshInterval: body.refreshInterval ?? DEFAULTS.refreshInterval,
          showTable: body.showTable ?? DEFAULTS.showTable,
          showBarChart: body.showBarChart ?? DEFAULTS.showBarChart,
          visibleKpis: Array.isArray(body.visibleKpis) ? body.visibleKpis.join(",") : DEFAULTS.visibleKpis.join(","),
        },
      });
    }

    return NextResponse.json({
      config: {
        dashboardTitle: config.dashboardTitle,
        defaultRange: config.defaultRange,
        refreshInterval: config.refreshInterval,
        showTable: config.showTable,
        showBarChart: config.showBarChart,
        visibleKpis: config.visibleKpis.split(",").filter(Boolean),
      },
      source: "database",
      saved: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Database error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
