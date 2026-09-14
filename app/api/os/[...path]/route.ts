import { NextRequest, NextResponse } from "next/server";
import { OpenSeaError, osFetch } from "@/lib/opensea";

export const dynamic = "force-dynamic";

async function handle(req: NextRequest, path: string[]) {
  const search = req.nextUrl.search;
  const joined = `/${path.join("/")}${search}`;
  try {
    if (req.method === "GET") {
      const data = await osFetch(joined, { method: "GET" });
      return NextResponse.json(data);
    }
    const body = await req.text();
    const data = await osFetch(joined, {
      method: req.method,
      body: body || undefined,
      headers: { "content-type": req.headers.get("content-type") || "application/json" },
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof OpenSeaError) {
      return NextResponse.json(
        { error: err.message, status: err.status, detail: err.body, missingKey: !process.env.OPENSEA_API_KEY },
        { status: err.status === 401 && !process.env.OPENSEA_API_KEY ? 503 : err.status },
      );
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : "proxy failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return handle(req, path);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return handle(req, path);
}
