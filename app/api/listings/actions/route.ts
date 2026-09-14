import { NextRequest, NextResponse } from "next/server";
import { OpenSeaError, osFetch } from "@/lib/opensea";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!payload?.maker || !Array.isArray(payload?.items) || payload.items.length === 0) {
      return NextResponse.json(
        { error: "maker and items[] are required. Each item needs chain, contract, identifier, and a price." },
        { status: 400 },
      );
    }
    const data = await osFetch("/listings/actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof OpenSeaError) {
      return NextResponse.json(
        { error: err.message, status: err.status, detail: err.body, missingKey: !process.env.OPENSEA_API_KEY },
        { status: err.status === 401 && !process.env.OPENSEA_API_KEY ? 503 : err.status },
      );
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : "listing actions failed" }, { status: 500 });
  }
}
