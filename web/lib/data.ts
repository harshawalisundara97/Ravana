// Mock data layer. Same shapes the real API (NestJS + Drizzle/Postgres) will
// return, so screens can be repointed at real fetch calls without changes.
import type { Gem, Seller, Order, Offer, Bid, Dispute, WalletTransaction, Notification, MessageThread } from "./types";

const img = (n: number) => `/gems/gem-${String(n).padStart(2, "0")}.jpg`;

export const sellers: Seller[] = [
  {
    id: "s1",
    name: "Ceylon Rare Stones",
    avatar: img(1),
    cover: img(2),
    bio: "Third-generation gem cutter and dealer based in Ratnapura, sourcing directly from licensed mines across Sri Lanka's gem belt.",
    verified: true,
    plan: "business",
    rating: 4.9,
    reviewCount: 214,
    gemCount: 146,
    verificationRecords: [
      { label: "Identity verified", date: "2024-02-11" },
      { label: "Business registration confirmed", date: "2024-02-14" },
      { label: "Bank & wallet ownership confirmed", date: "2024-02-20" },
      { label: "Laboratory partnership verified (GIA Colombo)", date: "2024-03-02" },
      { label: "50+ trades without a dispute", date: "2025-09-18" },
    ],
    walletAddress: "TXo4b2VmC9k1FqzQeYVXbEwqQe8Yt4Rn7c",
  },
  {
    id: "s2",
    name: "Meridian Gem House",
    avatar: img(3),
    cover: img(4),
    bio: "Specialists in unheated Kashmir and Burmese-origin sapphires with full provenance chains.",
    verified: true,
    plan: "pro",
    rating: 4.7,
    reviewCount: 98,
    gemCount: 62,
    verificationRecords: [
      { label: "Identity verified", date: "2024-05-03" },
      { label: "Laboratory partnership verified (GRS Bangkok)", date: "2024-05-20" },
      { label: "20+ trades without a dispute", date: "2025-11-01" },
    ],
    walletAddress: "TQn8R2vD5sYcM3kLpZeXjHwGtA1bNc6Fd",
  },
  {
    id: "s3",
    name: "Indra Minerals",
    avatar: img(5),
    cover: img(6),
    bio: "Family-run spinel and garnet specialists, three generations in Elahera.",
    verified: false,
    plan: "free",
    rating: 4.3,
    reviewCount: 22,
    gemCount: 18,
    verificationRecords: [{ label: "Identity in progress", date: "2026-08-20" }],
    walletAddress: "TFk9L3mB7nQxV2sZeYcH8wRtA5jDp1Kf",
  },
];

const types: Gem["type"][] = ["Sapphire", "Ruby", "Emerald", "Spinel", "Garnet", "Tourmaline", "Aquamarine", "Topaz", "Alexandrite", "Chrysoberyl", "Zircon"];
const origins = ["Sri Lanka", "Myanmar", "Madagascar", "Mozambique", "Tanzania", "Kashmir, India"];
const cuts = ["Oval brilliant", "Cushion", "Emerald cut", "Round brilliant", "Pear", "Radiant"];
const colours = ["Royal blue", "Pigeon-blood red", "Vivid green", "Cornflower blue", "Padparadscha", "Vivid pink"];
const treatments: Gem["treatment"][] = ["Unheated", "Heated", "Untreated", "Diffusion", "Oiled"];

function seededGem(i: number): Gem {
  const type = types[i % types.length];
  const carat = +(1.2 + ((i * 37) % 900) / 100).toFixed(2);
  const price = Math.round((800 + ((i * 733) % 12000)) / 5) * 5;
  return {
    id: `g${i + 1}`,
    marketplaceId: `RG-${2026000 + i * 7}`,
    title: `${colours[i % colours.length]} ${type}`,
    type,
    carat,
    origin: origins[i % origins.length],
    cut: cuts[i % cuts.length],
    colour: colours[i % colours.length],
    clarity: ["VVS", "VS1", "VS2", "SI1", "Eye clean"][i % 5],
    dimensions: `${(6 + (i % 5)).toFixed(2)} x ${(5 + (i % 4)).toFixed(2)} x ${(3 + (i % 3)).toFixed(2)} mm`,
    treatment: treatments[i % treatments.length],
    price,
    pricePerCarat: Math.round(price / carat),
    offerFloor: Math.round(price * 0.86),
    photos: [img((i % 11) + 1), img(((i + 1) % 11) + 1), img(((i + 2) % 11) + 1)],
    certLab: ["GIA Colombo", "GRS Bangkok", "AIGS Bangkok", "NGJA Sri Lanka"][i % 4],
    certNumber: `${1000000 + i * 913}`,
    sellerId: sellers[i % sellers.length].id,
    status: (["live", "live", "live", "in_review", "reserved", "draft", "sold"] as const)[i % 7],
    views: 40 + ((i * 53) % 900),
    offers: i % 5,
    featured: i % 3 === 0,
    auction:
      i % 4 === 0
        ? {
            lotNumber: (i % 38) + 1,
            lotsTotal: 38,
            currentBid: Math.round(price * 0.9),
            bidders: 6 + (i % 10),
            endsAt: new Date(Date.now() + 1000 * 60 * (30 + i)).toISOString(),
            incrementTier: 50,
          }
        : undefined,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)).toISOString(),
  };
}

export const gems: Gem[] = Array.from({ length: 48 }, (_, i) => seededGem(i));

export function getGem(id: string) {
  return gems.find((g) => g.id === id);
}
export function getSeller(id: string) {
  return sellers.find((s) => s.id === id);
}
export function sellerGems(sellerId: string) {
  return gems.filter((g) => g.sellerId === sellerId);
}

export const orders: Order[] = [
  {
    id: "o1",
    gemId: "g3",
    buyerId: "buyer1",
    sellerId: "s1",
    amount: gems[2]?.price ?? 2850,
    commissionPct: 5,
    escrowStage: 2,
    activity: [
      { timestamp: "2026-08-24 10:02", event: "Payment received", tag: "PAID" },
      { timestamp: "2026-08-24 10:11", event: "Escrow funded", tag: "FUNDED" },
      { timestamp: "2026-08-25 08:40", event: "Seller marked as shipped", tag: "SHIPPED" },
    ],
    txHash: "0x4f2a...9be1",
    network: "TRC20",
    depositAddress: "TQx7GdV3mZkPeYcS9wRnH2LbA6jDf1Kt",
    createdAt: "2026-08-24T10:00:00Z",
  },
];

export const offers: Offer[] = [
  { id: "of1", gemId: "g5", buyerId: "buyer1", amount: Math.round((gems[4]?.price ?? 1000) * 0.9), status: "pending", createdAt: "2026-08-27T12:00:00Z" },
];

export const bids: Bid[] = Array.from({ length: 10 }, (_, i) => ({
  id: `b${i + 1}`,
  gemId: "g1",
  bidderHandle: i === 2 ? "you (auto-bid)" : `Bidder-${1000 + i * 17}`,
  amount: 3800 + i * 50,
  isAuto: i % 3 === 0,
  isSelf: i === 2,
  createdAt: new Date(Date.now() - 1000 * 60 * (10 - i)).toISOString(),
}));

export const disputes: Dispute[] = [
  {
    id: "d1",
    orderId: "o1",
    buyerClaim: "Received stone shows visible inclusions not disclosed in listing photos or the laboratory report summary.",
    sellerResponse: "Stone matches the lab report exactly; inclusions described are within the disclosed clarity grade (VS2).",
    amountHeld: 2850,
    status: "open",
    createdAt: "2026-08-28T09:00:00Z",
  },
];

export const walletTransactions: WalletTransaction[] = Array.from({ length: 14 }, (_, i) => ({
  id: `wt${i + 1}`,
  type: (["sale", "withdrawal", "deposit", "commission", "refund"] as const)[i % 5],
  amount: i % 5 === 1 ? -(200 + i * 37) : 150 + i * 61,
  network: (["TRC20", "ERC20", "BEP20"] as const)[i % 3],
  status: "confirmed",
  txHash: `0x${(1000 + i * 91).toString(16)}...${(9000 - i * 3).toString(16)}`,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toISOString(),
}));

export const notifications: Notification[] = [
  { id: "n1", category: "offer", title: "New offer received", detail: "Buyer offered 2,450 USDT on your Royal blue Sapphire.", read: false, createdAt: "2026-08-30T08:10:00Z" },
  { id: "n2", category: "order", title: "Escrow funded", detail: "Order #o1 escrow has been funded — ship within 3 days.", read: false, createdAt: "2026-08-30T07:40:00Z" },
  { id: "n3", category: "auction", title: "You've been outbid", detail: "Lot 12 — someone bid 4,300 USDT.", read: true, createdAt: "2026-08-29T18:20:00Z" },
  { id: "n4", category: "message", title: "New message", detail: "Meridian Gem House replied to your question.", read: true, createdAt: "2026-08-29T11:05:00Z" },
  { id: "n5", category: "system", title: "KYC approved", detail: "Your identity verification is complete.", read: true, createdAt: "2026-08-27T09:00:00Z" },
];

export const messageThreads: MessageThread[] = [
  {
    id: "t1",
    gemId: "g3",
    buyerId: "buyer1",
    sellerId: "s1",
    messages: [
      { id: "m1", from: "buyer", text: "Is this stone available for inspection before I pay?", createdAt: "2026-08-24T09:00:00Z" },
      { id: "m2", from: "seller", text: "Yes — I can share a video under three light sources. Would that help?", createdAt: "2026-08-24T09:05:00Z" },
      { id: "m3", from: "buyer", text: "That would be great, thank you.", createdAt: "2026-08-24T09:06:00Z", isOffer: true, offerAmount: 2600 },
    ],
  },
];
