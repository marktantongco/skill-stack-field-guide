import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy to the 21st.dev component registry.
 * The API key NEVER leaves the server — the browser only ever talks to /api/components.
 *
 * Real endpoint (per @21st-dev/registry npm package, src/config.ts):
 *   GET https://21st.dev/api/v1/components/search?q=<query>&scope=public&limit=<n>
 *   Authorization: Bearer <API_KEY_21ST>
 *
 * Env var names (canonical, checked in order): API_KEY_21ST, AN_API_KEY
 * The same .env.local works for both this proxy AND the `npx @21st-dev/registry` CLI.
 *
 * Returns: { query, scope, results: Array<{ name, slug, description, registry,
 *          install_ref, url, preview_url, bundle_html_url, tags, author, updated_at }> }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE = process.env.API_URL_21ST ?? "https://21st.dev/api/v1";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const scope = (searchParams.get("scope") ?? "public").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "12", 10) || 12, 50);

  // Canonical env var names from @21st-dev/registry src/config.ts
  const key = process.env.API_KEY_21ST ?? process.env.AN_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "API_KEY_21ST not configured on the server. Set it in .env.local" },
      { status: 500 }
    );
  }
  if (!q) {
    return NextResponse.json(
      { error: "Missing 'q' query parameter." },
      { status: 400 }
    );
  }

  const url = `${API_BASE}/components/search?${new URLSearchParams({
    q,
    scope: ["public", "team", "mine"].includes(scope) ? scope : "public",
    limit: String(limit),
  })}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      // don't cache — live search
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        {
          error: `21st.dev returned HTTP ${upstream.status}`,
          detail: text.slice(0, 300),
        },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    // Pass through but trim to the fields we actually display
    const results = (data?.results ?? []).map((r: any) => ({
      name: r.name,
      slug: r.slug,
      description: r.description,
      install_ref: r.install_ref,
      url: r.url,
      preview_url: r.preview_url,
      author: r.author,
      tags: r.tags ?? [],
      updated_at: r.updated_at,
    }));

    return NextResponse.json(
      { query: q, scope, count: results.length, results },
      {
        headers: {
          // brief browser cache to spare the upstream on rapid re-searches
          "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "Network error reaching 21st.dev",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }
}
