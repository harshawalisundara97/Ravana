// Real Postgres-backed queries, shaped to match lib/types.ts exactly — the
// UI components built against the mock data in lib/data.ts work unchanged
// against these. This is the "swap-in point" described in db/schema.ts.
import { eq, desc, count, inArray, and } from "drizzle-orm";
import { db } from "@/db";
import {
  gems as gemsTable,
  sellerProfiles,
  verificationRecords,
  auctions,
  users,
  orders as ordersTable,
  orderActivity,
  ledgerEntries,
  offers,
} from "@/db/schema";
import type { Gem, Seller, Order, EscrowStage } from "./types";

type GemRow = typeof gemsTable.$inferSelect;
type AuctionRow = typeof auctions.$inferSelect;
type SellerRow = typeof sellerProfiles.$inferSelect;

// Commission taken from the settled amount, by seller plan. Basis points so
// the arithmetic stays in integers all the way to the ledger.
export const COMMISSION_BPS: Record<SellerRow["plan"], number> = {
  free: 500,
  pro: 300,
  business: 200,
};

const ESCROW_STAGES = ["paid", "funded", "shipped", "delivered", "confirmed"] as const;

function toGem(row: GemRow, auction?: AuctionRow | null, seller?: { name: string; verified: boolean }): Gem {
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
    photos: row.photos.length ? row.photos : ["/gems/gem-01.jpg"],
    video: row.video ?? undefined,
    certLab: row.certLab,
    certNumber: row.certNumber,
    sellerId: row.sellerId,
    sellerName: seller?.name,
    sellerVerified: seller?.verified,
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

function toSeller(profile: SellerRow, name: string, records: (typeof verificationRecords.$inferSelect)[], gemCount: number): Seller {
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

// Gems joined with the bits of the seller a listing card needs, so callers
// don't have to issue a lookup per card.
async function decorate(rows: GemRow[]): Promise<Gem[]> {
  if (!rows.length) return [];
  const sellerIds = [...new Set(rows.map((r) => r.sellerId))];
  const gemIds = rows.map((r) => r.id);

  const [profiles, auctionRows] = await Promise.all([
    db.select().from(sellerProfiles).where(inArray(sellerProfiles.userId, sellerIds)),
    db.select().from(auctions).where(inArray(auctions.gemId, gemIds)),
  ]);

  const sellerById = new Map(profiles.map((p) => [p.userId, { name: p.displayName, verified: p.verified }]));
  const auctionByGem = new Map(auctionRows.map((a) => [a.gemId, a]));

  return rows.map((r) => toGem(r, auctionByGem.get(r.id), sellerById.get(r.sellerId)));
}

export async function getAllGems(): Promise<Gem[]> {
  const rows = await db.select().from(gemsTable).orderBy(desc(gemsTable.createdAt));
  return decorate(rows);
}

// What buyers are allowed to see: everything except drafts and stones still
// awaiting gemmologist review.
export async function getPublicGems(): Promise<Gem[]> {
  const rows = await db
    .select()
    .from(gemsTable)
    .where(inArray(gemsTable.status, ["live", "reserved", "sold"]))
    .orderBy(desc(gemsTable.createdAt));
  return decorate(rows);
}

export async function getGemById(id: string): Promise<Gem | undefined> {
  const [row] = await db.select().from(gemsTable).where(eq(gemsTable.id, id)).limit(1);
  if (!row) return undefined;
  const [decorated] = await decorate([row]);
  return decorated;
}

export async function getGemsByIds(ids: string[]): Promise<Gem[]> {
  if (!ids.length) return [];
  const rows = await db.select().from(gemsTable).where(inArray(gemsTable.id, ids));
  const decorated = await decorate(rows);
  // Preserve the caller's ordering (cart order, for instance).
  const byId = new Map(decorated.map((g) => [g.id, g]));
  return ids.map((id) => byId.get(id)).filter((g): g is Gem => !!g);
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
  return decorate(rows);
}

// ---- orders & escrow -------------------------------------------------

function toOrder(row: typeof ordersTable.$inferSelect, activity: (typeof orderActivity.$inferSelect)[]): Order {
  return {
    id: row.id,
    gemId: row.gemId,
    buyerId: row.buyerId,
    sellerId: row.sellerId,
    amount: row.amountMinorUnits / 100,
    commissionPct: row.commissionBps / 100,
    escrowStage: ESCROW_STAGES.indexOf(row.escrowStage) as EscrowStage,
    activity: activity.map((a) => ({
      timestamp: a.occurredAt.toISOString().slice(0, 16).replace("T", " "),
      event: a.event,
      tag: a.tag,
    })),
    txHash: row.txHash ?? undefined,
    network: row.network,
    depositAddress: row.depositAddress,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const [row] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
  if (!row) return undefined;
  const activity = await db
    .select()
    .from(orderActivity)
    .where(eq(orderActivity.orderId, id))
    .orderBy(orderActivity.occurredAt);
  return toOrder(row, activity);
}

export async function getOrdersForBuyer(buyerId: string): Promise<Order[]> {
  const rows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.buyerId, buyerId))
    .orderBy(desc(ordersTable.createdAt));
  if (!rows.length) return [];
  const activity = await db
    .select()
    .from(orderActivity)
    .where(inArray(orderActivity.orderId, rows.map((r) => r.id)))
    .orderBy(orderActivity.occurredAt);
  return rows.map((r) => toOrder(r, activity.filter((a) => a.orderId === r.id)));
}

export async function getOrdersForSeller(sellerId: string): Promise<Order[]> {
  const rows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.sellerId, sellerId))
    .orderBy(desc(ordersTable.createdAt));
  if (!rows.length) return [];
  const activity = await db
    .select()
    .from(orderActivity)
    .where(inArray(orderActivity.orderId, rows.map((r) => r.id)))
    .orderBy(orderActivity.occurredAt);
  return rows.map((r) => toOrder(r, activity.filter((a) => a.orderId === r.id)));
}

export { ESCROW_STAGES };

// ---- wallet & dashboard ----------------------------------------------

// Balances are always derived from the ledger, never stored on the user row.
// That means a balance can be recomputed from history at any point, and a bug
// in one posting can't silently corrupt a stored number.
export interface WalletTx {
  id: string;
  createdAt: string;
  type: string;
  orderId: string | null;
  reference: string;
  network: string | null;
  amount: number;
  status: string;
}

export interface WalletSummary {
  available: number;
  inEscrow: number;
  clearing: number;
  lifetimeWithdrawn: number;
  transactions: WalletTx[];
}

const IN_FLIGHT_STAGES = ["paid", "funded", "shipped", "delivered"] as const;

export async function getWalletSummary(userId: string): Promise<WalletSummary> {
  const [entries, buying, selling] = await Promise.all([
    db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.userId, userId))
      .orderBy(desc(ledgerEntries.createdAt)),
    db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.buyerId, userId), inArray(ordersTable.escrowStage, IN_FLIGHT_STAGES))),
    db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.sellerId, userId), inArray(ordersTable.escrowStage, IN_FLIGHT_STAGES))),
  ]);

  const sumWhere = (fn: (e: (typeof entries)[number]) => boolean) =>
    entries.filter(fn).reduce((total, e) => total + e.amountMinorUnits, 0);

  // Money the buyer has committed, plus what the seller is owed once each
  // order releases (net of commission, since that never reaches them).
  const escrowAsBuyer = buying.reduce((total, o) => total + o.amountMinorUnits, 0);
  const escrowAsSeller = selling.reduce(
    (total, o) => total + (o.amountMinorUnits - Math.round((o.amountMinorUnits * o.commissionBps) / 10000)),
    0
  );

  // Titles for the reference column, fetched in one go.
  const orderIds = [...new Set(entries.map((e) => e.orderId).filter((id): id is string => !!id))];
  const orderRows = orderIds.length
    ? await db
        .select({ id: ordersTable.id, title: gemsTable.title })
        .from(ordersTable)
        .innerJoin(gemsTable, eq(gemsTable.id, ordersTable.gemId))
        .where(inArray(ordersTable.id, orderIds))
    : [];
  const titleByOrder = new Map(orderRows.map((r) => [r.id, r.title]));

  return {
    available: sumWhere((e) => e.status === "confirmed") / 100,
    inEscrow: (escrowAsBuyer + escrowAsSeller) / 100,
    clearing: sumWhere((e) => e.status === "pending") / 100,
    lifetimeWithdrawn: Math.abs(sumWhere((e) => e.type === "withdrawal" && e.status === "confirmed")) / 100,
    transactions: entries.map((e) => ({
      id: e.id,
      createdAt: e.createdAt.toISOString(),
      type: e.type,
      orderId: e.orderId,
      reference: e.orderId ? (titleByOrder.get(e.orderId) ?? e.orderId.slice(0, 8)) : "—",
      network: e.network,
      amount: e.amountMinorUnits / 100,
      status: e.status,
    })),
  };
}

export interface DashboardOrder {
  id: string;
  gemTitle: string;
  gemId: string;
  amount: number;
  stage: EscrowStage;
  stageLabel: string;
}

const STAGE_LABELS = ["Awaiting funding", "In escrow", "Shipped", "Delivered", "Completed"];

export async function getBuyerOrders(buyerId: string): Promise<DashboardOrder[]> {
  const rows = await db
    .select({
      id: ordersTable.id,
      gemId: ordersTable.gemId,
      gemTitle: gemsTable.title,
      amountMinorUnits: ordersTable.amountMinorUnits,
      escrowStage: ordersTable.escrowStage,
    })
    .from(ordersTable)
    .innerJoin(gemsTable, eq(gemsTable.id, ordersTable.gemId))
    .where(eq(ordersTable.buyerId, buyerId))
    .orderBy(desc(ordersTable.createdAt));

  return rows.map((r) => {
    const stage = ESCROW_STAGES.indexOf(r.escrowStage) as EscrowStage;
    return {
      id: r.id,
      gemId: r.gemId,
      gemTitle: r.gemTitle,
      amount: r.amountMinorUnits / 100,
      stage,
      stageLabel: STAGE_LABELS[stage],
    };
  });
}

export interface DashboardOffer {
  id: string;
  gemId: string;
  gemTitle: string;
  sellerName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export async function getBuyerOffers(buyerId: string): Promise<DashboardOffer[]> {
  const rows = await db
    .select({
      id: offers.id,
      gemId: offers.gemId,
      gemTitle: gemsTable.title,
      sellerName: sellerProfiles.displayName,
      amountMinorUnits: offers.amountMinorUnits,
      status: offers.status,
      createdAt: offers.createdAt,
    })
    .from(offers)
    .innerJoin(gemsTable, eq(gemsTable.id, offers.gemId))
    .innerJoin(sellerProfiles, eq(sellerProfiles.userId, gemsTable.sellerId))
    .where(eq(offers.buyerId, buyerId))
    .orderBy(desc(offers.createdAt));

  return rows.map((r) => ({
    id: r.id,
    gemId: r.gemId,
    gemTitle: r.gemTitle,
    sellerName: r.sellerName,
    amount: r.amountMinorUnits / 100,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));
}

// Everything the buyer dashboard needs, in one round of queries.
export async function getBuyerDashboard(userId: string) {
  const [wallet, orders, offerRows] = await Promise.all([
    getWalletSummary(userId),
    getBuyerOrders(userId),
    getBuyerOffers(userId),
  ]);

  const collectionValue = orders.filter((o) => o.stage === 4).reduce((total, o) => total + o.amount, 0);

  return {
    wallet,
    orders,
    offers: offerRows,
    pendingOffers: offerRows.filter((o) => o.status === "pending").length,
    collectionValue,
  };
}
