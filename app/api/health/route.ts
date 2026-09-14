import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "harbor-press",
    openseaKey: Boolean(process.env.OPENSEA_API_KEY),
  });
}
