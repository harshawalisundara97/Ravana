// Domain types. Shapes mirror the intended Postgres/Drizzle schema so a real
// backend can be swapped in behind lib/data.ts without touching UI code.

export type GemType =
  | "Sapphire"
  | "Ruby"
  | "Emerald"
  | "Spinel"
  | "Garnet"
  | "Tourmaline"
  | "Aquamarine"
  | "Topaz"
  | "Alexandrite"
  | "Chrysoberyl"
  | "Zircon";

export type Treatment = "Unheated" | "Heated" | "Untreated" | "Diffusion" | "Oiled";

export type GemStatus = "live" | "in_review" | "reserved" | "draft" | "sold";

export interface Gem {
  id: string;
  marketplaceId: string;
  title: string;
  type: GemType;
  carat: number;
  origin: string;
  cut: string;
  colour: string;
  clarity: string;
  dimensions: string;
  treatment: Treatment;
  price: number; // USDT, minor-unit-free display value (backend stores integer minor units)
  pricePerCarat: number;
  offerFloor: number;
  photos: string[];
  video?: string;
  certLab: string;
  certNumber: string;
  sellerId: string;
  sellerName?: string;
  sellerVerified?: boolean;
  status: GemStatus;
  views: number;
  offers: number;
  featured?: boolean;
  auction?: {
    lotNumber: number;
    lotsTotal: number;
    currentBid: number;
    bidders: number;
    endsAt: string; // ISO
    incrementTier: number;
  };
  createdAt: string;
}

export type SellerPlan = "free" | "pro" | "business";

export interface VerificationRecord {
  label: string;
  date: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  bio: string;
  verified: boolean;
  plan: SellerPlan;
  rating: number;
  reviewCount: number;
  gemCount: number;
  verificationRecords: VerificationRecord[];
  walletAddress: string;
}

export type EscrowStage = 0 | 1 | 2 | 3 | 4; // Paid -> Funded -> Shipped -> Delivered -> Confirmed

export interface OrderActivity {
  timestamp: string;
  event: string;
  tag: string;
}

export interface Order {
  id: string;
  gemId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  commissionPct: number;
  escrowStage: EscrowStage;
  activity: OrderActivity[];
  txHash?: string;
  network: "TRC20" | "ERC20" | "BEP20";
  depositAddress: string;
  createdAt: string;
}

export type OfferStatus = "pending" | "accepted" | "countered" | "declined";

export interface Offer {
  id: string;
  gemId: string;
  buyerId: string;
  amount: number;
  status: OfferStatus;
  createdAt: string;
}

export interface Bid {
  id: string;
  gemId: string;
  bidderHandle: string;
  amount: number;
  isAuto: boolean;
  isSelf?: boolean;
  createdAt: string;
}

export type DisputeStatus = "open" | "refunded" | "released" | "split" | "second_opinion";

export interface Dispute {
  id: string;
  orderId: string;
  buyerClaim: string;
  sellerResponse: string;
  amountHeld: number;
  status: DisputeStatus;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  type: "deposit" | "withdrawal" | "sale" | "commission" | "refund";
  amount: number; // signed
  network: "TRC20" | "ERC20" | "BEP20";
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  category: "offer" | "order" | "auction" | "message" | "system";
  title: string;
  detail: string;
  read: boolean;
  createdAt: string;
}

export interface MessageThread {
  id: string;
  gemId: string;
  buyerId: string;
  sellerId: string;
  messages: {
    id: string;
    from: "buyer" | "seller";
    text: string;
    createdAt: string;
    isOffer?: boolean;
    offerAmount?: number;
  }[];
}
