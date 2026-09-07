import { pgTable, text, integer, boolean, timestamp, numeric, primaryKey, pgEnum, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---- enums -----------------------------------------------------------

export const userRoleEnum = pgEnum("user_role", ["buyer", "seller", "admin"]);
export const sellerPlanEnum = pgEnum("seller_plan", ["free", "pro", "business"]);
export const gemStatusEnum = pgEnum("gem_status", ["live", "in_review", "reserved", "draft", "sold"]);
export const treatmentEnum = pgEnum("treatment", ["Unheated", "Heated", "Untreated", "Diffusion", "Oiled"]);
export const offerStatusEnum = pgEnum("offer_status", ["pending", "accepted", "countered", "declined"]);
export const escrowStageEnum = pgEnum("escrow_stage", ["paid", "funded", "shipped", "delivered", "confirmed"]);
export const disputeStatusEnum = pgEnum("dispute_status", ["open", "refunded", "released", "split", "second_opinion"]);
export const kycStatusEnum = pgEnum("kyc_status", ["unstarted", "in_progress", "cleared", "rejected"]);
export const networkEnum = pgEnum("network", ["TRC20", "ERC20", "BEP20"]);

// ---- users & sellers ---------------------------------------------------

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("buyer"),
  kycStatus: kycStatusEnum("kyc_status").notNull().default("unstarted"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sellerProfiles = pgTable("seller_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  bio: text("bio"),
  verified: boolean("verified").notNull().default(false),
  plan: sellerPlanEnum("plan").notNull().default("free"),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verificationRecords = pgTable("verification_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => sellerProfiles.userId, { onDelete: "cascade" }),
  label: text("label").notNull(),
  occurredAt: timestamp("occurred_at").notNull().defaultNow(),
});

// ---- gems ---------------------------------------------------------------

export const gems = pgTable("gems", {
  id: uuid("id").defaultRandom().primaryKey(),
  marketplaceId: text("marketplace_id").notNull().unique(),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => sellerProfiles.userId, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(),
  carat: numeric("carat", { precision: 6, scale: 2 }).notNull(),
  origin: text("origin").notNull(),
  cut: text("cut").notNull(),
  colour: text("colour").notNull(),
  clarity: text("clarity").notNull(),
  dimensions: text("dimensions").notNull(),
  treatment: treatmentEnum("treatment").notNull(),
  priceMinorUnits: integer("price_minor_units").notNull(), // USDT cents
  offerFloorMinorUnits: integer("offer_floor_minor_units").notNull(),
  photos: text("photos").array().notNull().default([]),
  video: text("video"),
  certLab: text("cert_lab").notNull(),
  certNumber: text("cert_number").notNull(),
  status: gemStatusEnum("status").notNull().default("draft"),
  views: integer("views").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auctions = pgTable("auctions", {
  gemId: uuid("gem_id")
    .primaryKey()
    .references(() => gems.id, { onDelete: "cascade" }),
  lotNumber: integer("lot_number").notNull(),
  lotsTotal: integer("lots_total").notNull(),
  currentBidMinorUnits: integer("current_bid_minor_units").notNull(),
  incrementTierMinorUnits: integer("increment_tier_minor_units").notNull(),
  endsAt: timestamp("ends_at").notNull(),
});

export const bids = pgTable("bids", {
  id: uuid("id").defaultRandom().primaryKey(),
  gemId: uuid("gem_id")
    .notNull()
    .references(() => gems.id, { onDelete: "cascade" }),
  bidderId: uuid("bidder_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amountMinorUnits: integer("amount_minor_units").notNull(),
  isAuto: boolean("is_auto").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const offers = pgTable("offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  gemId: uuid("gem_id")
    .notNull()
    .references(() => gems.id, { onDelete: "cascade" }),
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amountMinorUnits: integer("amount_minor_units").notNull(),
  status: offerStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---- orders, escrow, ledger ----------------------------------------------

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  gemId: uuid("gem_id")
    .notNull()
    .references(() => gems.id, { onDelete: "restrict" }),
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => sellerProfiles.userId, { onDelete: "restrict" }),
  amountMinorUnits: integer("amount_minor_units").notNull(),
  commissionBps: integer("commission_bps").notNull(), // basis points, e.g. 300 = 3%
  escrowStage: escrowStageEnum("escrow_stage").notNull().default("paid"),
  network: networkEnum("network").notNull(),
  depositAddress: text("deposit_address").notNull(),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderActivity = pgTable("order_activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  event: text("event").notNull(),
  tag: text("tag").notNull(),
  occurredAt: timestamp("occurred_at").notNull().defaultNow(),
});

// Double-entry style ledger — every escrow hold, release, refund, commission
// and withdrawal is a row here. wallet balances are derived, never stored.
export const ledgerEntries = pgTable("ledger_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  type: text("type").notNull(), // deposit | withdrawal | escrow_hold | escrow_release | commission | refund
  amountMinorUnits: integer("amount_minor_units").notNull(), // signed
  network: networkEnum("network"),
  txHash: text("tx_hash"),
  status: text("status").notNull().default("pending"), // pending | confirmed | failed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const disputes = pgTable("disputes", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  buyerClaim: text("buyer_claim").notNull(),
  sellerResponse: text("seller_response"),
  amountHeldMinorUnits: integer("amount_held_minor_units").notNull(),
  status: disputeStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---- messaging & notifications --------------------------------------------

export const messageThreads = pgTable("message_threads", {
  id: uuid("id").defaultRandom().primaryKey(),
  gemId: uuid("gem_id").references(() => gems.id, { onDelete: "set null" }),
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => sellerProfiles.userId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => messageThreads.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  offerAmountMinorUnits: integer("offer_amount_minor_units"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // offer | order | auction | message | system
  title: text("title").notNull(),
  detail: text("detail").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---- relations (for query API ergonomics) ---------------------------------

export const usersRelations = relations(users, ({ one, many }) => ({
  sellerProfile: one(sellerProfiles, { fields: [users.id], references: [sellerProfiles.userId] }),
  offers: many(offers),
  bids: many(bids),
  orders: many(orders),
  notifications: many(notifications),
}));

export const sellerProfilesRelations = relations(sellerProfiles, ({ one, many }) => ({
  user: one(users, { fields: [sellerProfiles.userId], references: [users.id] }),
  gems: many(gems),
  verificationRecords: many(verificationRecords),
}));

export const gemsRelations = relations(gems, ({ one, many }) => ({
  seller: one(sellerProfiles, { fields: [gems.sellerId], references: [sellerProfiles.userId] }),
  auction: one(auctions, { fields: [gems.id], references: [auctions.gemId] }),
  offers: many(offers),
  bids: many(bids),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  gem: one(gems, { fields: [orders.gemId], references: [gems.id] }),
  buyer: one(users, { fields: [orders.buyerId], references: [users.id] }),
  seller: one(sellerProfiles, { fields: [orders.sellerId], references: [sellerProfiles.userId] }),
  activity: many(orderActivity),
  disputes: many(disputes),
}));

export const messageThreadsRelations = relations(messageThreads, ({ one, many }) => ({
  gem: one(gems, { fields: [messageThreads.gemId], references: [gems.id] }),
  buyer: one(users, { fields: [messageThreads.buyerId], references: [users.id] }),
  seller: one(sellerProfiles, { fields: [messageThreads.sellerId], references: [sellerProfiles.userId] }),
  messages: many(messages),
}));
