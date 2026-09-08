import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { gems, sellerProfiles, orders, orderActivity, ledgerEntries } from "@/db/schema";
import { COMMISSION_BPS } from "@/lib/queries";

type Network = "TRC20" | "ERC20" | "BEP20";

// Creates one order per stone — the design's cart copy is explicit that each
// seller's parcel ships and settles separately, and the schema keys an order
// to a single gem.
//
// NOTE: no real USDT moves here. Until custody (Phase B3) is wired, the
// deposit address is generated locally and the escrow hold is recorded in our
// own ledger only. Nothing in this path talks to a chain.
export async function POST(req: Request) {
  const session = await auth();
  const buyerId = (session?.user as { id?: string } | undefined)?.id;
  if (!buyerId) {
    return NextResponse.json({ error: "Sign in to place an order." }, { status: 401 });
  }

  const body = (await req.json()) as { gemIds?: string[]; network?: Network };
  const gemIds = body.gemIds ?? [];
  const network: Network = body.network ?? "TRC20";

  if (!gemIds.length) {
    return NextResponse.json({ error: "No gems supplied." }, { status: 400 });
  }

  const rows = await db.select().from(gems).where(inArray(gems.id, gemIds));
  if (rows.length !== gemIds.length) {
    return NextResponse.json({ error: "One or more stones could not be found." }, { status: 404 });
  }

  const unavailable = rows.filter((r) => r.status !== "live");
  if (unavailable.length) {
    return NextResponse.json(
      { error: `No longer available: ${unavailable.map((r) => r.title).join(", ")}.` },
      { status: 409 }
    );
  }

  const ownGems = rows.filter((r) => r.sellerId === buyerId);
  if (ownGems.length) {
    return NextResponse.json({ error: "You cannot buy your own listing." }, { status: 400 });
  }

  const sellerIds = [...new Set(rows.map((r) => r.sellerId))];
  const profiles = await db.select().from(sellerProfiles).where(inArray(sellerProfiles.userId, sellerIds));
  const planBySeller = new Map(profiles.map((p) => [p.userId, p.plan]));

  const created: { id: string; gemId: string; amount: number }[] = [];

  // One transaction so a partial cart can never leave dangling holds.
  await db.transaction(async (tx) => {
    for (const gem of rows) {
      const plan = planBySeller.get(gem.sellerId) ?? "free";
      const commissionBps = COMMISSION_BPS[plan];

      const [order] = await tx
        .insert(orders)
        .values({
          gemId: gem.id,
          buyerId,
          sellerId: gem.sellerId,
          amountMinorUnits: gem.priceMinorUnits,
          commissionBps,
          escrowStage: "paid",
          network,
          depositAddress: `SIMULATED-${network}-${randomUUID().replace(/-/g, "").slice(0, 24)}`,
        })
        .returning();

      await tx.insert(orderActivity).values({
        orderId: order.id,
        event: "Order placed, awaiting escrow funding",
        tag: "PAID",
      });

      // Buyer's funds are earmarked. Signed negative: money leaving the
      // buyer's available balance into the marketplace's escrow position.
      await tx.insert(ledgerEntries).values({
        userId: buyerId,
        orderId: order.id,
        type: "escrow_hold",
        amountMinorUnits: -gem.priceMinorUnits,
        network,
        status: "pending",
      });

      await tx.update(gems).set({ status: "reserved" }).where(eq(gems.id, gem.id));

      created.push({ id: order.id, gemId: gem.id, amount: gem.priceMinorUnits / 100 });
    }
  });

  return NextResponse.json({ orders: created }, { status: 201 });
}
