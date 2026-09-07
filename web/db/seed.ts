// One-time dev seed: pushes the existing mock catalogue (lib/data.ts) into
// Postgres so the app has real, queryable data to develop against.
// Run with: pnpm db:seed
import bcrypt from "bcryptjs";
import { db } from "./index";
import { users, sellerProfiles, verificationRecords, gems, auctions } from "./schema";
import { sellers as mockSellers, gems as mockGems } from "../lib/data";

async function main() {
  console.log("Seeding database...");

  const sellerIdMap = new Map<string, string>();

  for (const s of mockSellers) {
    const passwordHash = await bcrypt.hash("password123", 10);
    const [user] = await db
      .insert(users)
      .values({
        email: `${s.id}@ravanagems.test`,
        passwordHash,
        name: s.name,
        role: "seller",
        kycStatus: s.verified ? "cleared" : "in_progress",
      })
      .returning();

    sellerIdMap.set(s.id, user.id);

    await db.insert(sellerProfiles).values({
      userId: user.id,
      displayName: s.name,
      avatarUrl: s.avatar,
      coverUrl: s.cover,
      bio: s.bio,
      verified: s.verified,
      plan: s.plan,
      walletAddress: s.walletAddress,
    });

    for (const rec of s.verificationRecords) {
      await db.insert(verificationRecords).values({
        sellerId: user.id,
        label: rec.label,
        occurredAt: new Date(rec.date),
      });
    }
  }

  // A demo buyer account to log in with.
  const buyerPasswordHash = await bcrypt.hash("password123", 10);
  await db.insert(users).values({
    email: "buyer@ravanagems.test",
    passwordHash: buyerPasswordHash,
    name: "A. Fernando",
    role: "buyer",
    kycStatus: "cleared",
  });

  // An admin account.
  const adminPasswordHash = await bcrypt.hash("password123", 10);
  await db.insert(users).values({
    email: "admin@ravanagems.test",
    passwordHash: adminPasswordHash,
    name: "S. Perera",
    role: "admin",
    kycStatus: "cleared",
  });

  for (const g of mockGems) {
    const sellerId = sellerIdMap.get(g.sellerId);
    if (!sellerId) continue;

    const [row] = await db
      .insert(gems)
      .values({
        marketplaceId: g.marketplaceId,
        sellerId,
        title: g.title,
        type: g.type,
        carat: g.carat.toString(),
        origin: g.origin,
        cut: g.cut,
        colour: g.colour,
        clarity: g.clarity,
        dimensions: g.dimensions,
        treatment: g.treatment,
        priceMinorUnits: Math.round(g.price * 100),
        offerFloorMinorUnits: Math.round(g.offerFloor * 100),
        photos: g.photos,
        certLab: g.certLab,
        certNumber: g.certNumber,
        status: g.status,
        views: g.views,
        featured: !!g.featured,
      })
      .returning();

    if (g.auction) {
      await db.insert(auctions).values({
        gemId: row.id,
        lotNumber: g.auction.lotNumber,
        lotsTotal: g.auction.lotsTotal,
        currentBidMinorUnits: Math.round(g.auction.currentBid * 100),
        incrementTierMinorUnits: Math.round(g.auction.incrementTier * 100),
        endsAt: new Date(g.auction.endsAt),
      });
    }
  }

  console.log(`Seeded ${mockSellers.length} sellers, ${mockGems.length} gems, 2 extra accounts (buyer@ravanagems.test, admin@ravanagems.test — password: password123).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
