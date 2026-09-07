import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { gems, sellerProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!userId || (role !== "seller" && role !== "admin")) {
    return NextResponse.json({ error: "Only signed-in sellers can list a gem." }, { status: 401 });
  }

  const [seller] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1);
  if (!seller) {
    return NextResponse.json({ error: "Complete your seller profile before listing a gem." }, { status: 403 });
  }

  const body = await req.json();
  const {
    title,
    type,
    carat,
    origin,
    cut,
    colour,
    clarity,
    dimensions,
    treatment,
    price,
    offerFloor,
    photos,
    certLab,
    certNumber,
  } = body as Record<string, string | number | string[]>;

  if (!title || !type || !carat || !price || !certLab || !certNumber) {
    return NextResponse.json({ error: "Missing required gem fields." }, { status: 400 });
  }

  const marketplaceId = `RG-${Date.now().toString().slice(-9)}`;

  const [row] = await db
    .insert(gems)
    .values({
      marketplaceId,
      sellerId: userId,
      title: String(title),
      type: String(type),
      carat: String(carat),
      origin: String(origin ?? ""),
      cut: String(cut ?? ""),
      colour: String(colour ?? ""),
      clarity: String(clarity ?? ""),
      dimensions: String(dimensions ?? ""),
      treatment: (treatment as "Unheated" | "Heated" | "Untreated" | "Diffusion" | "Oiled") ?? "Heated",
      priceMinorUnits: Math.round(Number(price) * 100),
      offerFloorMinorUnits: Math.round(Number(offerFloor ?? Number(price) * 0.85) * 100),
      photos: Array.isArray(photos) ? photos : [],
      certLab: String(certLab),
      certNumber: String(certNumber),
      status: "in_review",
    })
    .returning();

  return NextResponse.json({ id: row.id, marketplaceId: row.marketplaceId }, { status: 201 });
}
