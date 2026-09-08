import { NextResponse } from "next/server";
import { getGemsByIds } from "@/lib/queries";

// Used by the cart, which holds ids in browser storage and needs the real,
// current listing data (and price) rendered server-side of the truth.
export async function GET(req: Request) {
  const ids = new URL(req.url).searchParams.get("ids");
  const gemIds = (ids ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!gemIds.length) return NextResponse.json({ gems: [] });
  const gems = await getGemsByIds(gemIds);
  return NextResponse.json({ gems });
}
