// Real Postgres-backed queries, shaped to match lib/types.ts exactly — the
// UI components built against the mock data in lib/data.ts work unchanged
// against these. This is the "swap-in point" described in db/schema.ts.
import { eq, desc, count } from "drizzle-orm";
import { db } from "@/db";
import { gems as gemsTable, sellerProfiles, verificationRecords, auctions, users } from "@/db/schema";
import type { Gem, Seller } from "./types";

function toGem(row: typeof gemsTable.$inferSelect, auction?: typeof auctions.$inferSelect | null): Gem {
  return {
    id: row.id,
    marketplaceId: row.marketplaceId,
    title: row.title,
    type: row.type as Gem["type"],
    carat: Number(row.carat),
    origin: row.origin,
    cut: row.cut,
    colour: row.colour,
    clarity: row.clarity,
    dimensions: row.dimensions,
    treatment: row.treatment,
    price: row.priceMinorUnits / 100,
    pricePerCarat: Math.round(row.priceMinorUnits / 100 / Number(row.carat)),
    offerFloor: row.offerFloorMinorUnits / 100,
    photos: row.photos,
    video: row.video ?? undefined,
    certLab: row.certLab,
    certNumber: row.certNumber,
    sellerId: row.sellerId,
    status: row.status,
    views: row.views,
    offers: 0,
    featured: row.featured,
    auction: auction
      ? {
          lotNumber: auction.lotNumber,
          lotsTotal: auction.lotsTotal,
          currentBid: auction.currentBidMinorUnits / 100,
          bidders: 0,
          endsAt: auction.endsAt.toISOString(),
          incrementTier: auction.incrementTierMinorUnits / 100,
        }
      : undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

function toSeller(profile: typeof sellerProfiles.$inferSelect, name: string, records: (typeof verificationRecords.$inferSelect)[], gemCount: number): Seller {
  return {
    id: profile.userId,
    name: profile.displayName || name,
    avatar: profile.avatarUrl ?? "/gems/gem-01.jpg",
    cover: profile.coverUrl ?? "/gems/gem-02.jpg",
    bio: profile.bio ?? "",
    verified: profile.verified,
    plan: profile.plan,
    rating: 4.7,
    reviewCount: records.length * 40 + 20,
    gemCount,
    verificationRecords: records.map((r) => ({ label: r.label, date: r.occurredAt.toISOString().slice(0, 10) })),
    walletAddress: profile.walletAddress ?? "",
  };
}

export async function getAllGems(): Promise<Gem[]> {
  const rows = await db.select().from(gemsTable).orderBy(desc(gemsTable.createdAt));
  const auctionRows = await db.select().from(auctions);
  const auctionByGem = new Map(auctionRows.map((a) => [a.gemId, a]));
  return rows.map((r) => toGem(r, auctionByGem.get(r.id)));
}

export async function getGemById(id: string): Promise<Gem | undefined> {
  const [row] = await db.select().from(gemsTable).where(eq(gemsTable.id, id)).limit(1);
  if (!row) return undefined;
  const [auction] = await db.select().from(auctions).where(eq(auctions.gemId, id)).limit(1);
  return toGem(row, auction);
}

export async function getSellerById(userId: string): Promise<Seller | undefined> {
  const [profile] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1);
  if (!profile) return undefined;
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const records = await db.select().from(verificationRecords).where(eq(verificationRecords.sellerId, userId));
  const [{ gemCount }] = await db.select({ gemCount: count() }).from(gemsTable).where(eq(gemsTable.sellerId, userId));
  return toSeller(profile, user?.name ?? "Seller", records, gemCount ?? 0);
}

export async function getGemsBySeller(sellerId: string): Promise<Gem[]> {
  const rows = await db.select().from(gemsTable).where(eq(gemsTable.sellerId, sellerId)).orderBy(desc(gemsTable.createdAt));
  const auctionRows = await db.select().from(auctions);
  const auctionByGem = new Map(auctionRows.map((a) => [a.gemId, a]));
  return rows.map((r) => toGem(r, auctionByGem.get(r.id)));
}
