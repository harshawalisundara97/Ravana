import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { orders, orderActivity, ledgerEntries, gems } from "@/db/schema";
import { ESCROW_STAGES } from "@/lib/queries";

// Who is allowed to move each stage on, and what the activity log should say.
const TRANSITIONS = {
  paid: { next: "funded", actor: "buyer", event: "Escrow funded", tag: "FUNDED" },
  funded: { next: "shipped", actor: "seller", event: "Seller marked as shipped", tag: "SHIPPED" },
  shipped: { next: "delivered", actor: "buyer", event: "Delivery confirmed, inspection window open", tag: "DELIVERED" },
  delivered: { next: "confirmed", actor: "buyer", event: "Receipt confirmed, funds released to seller", tag: "CONFIRMED" },
} as const;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to update this order." }, { status: 401 });
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const isBuyer = order.buyerId === userId;
  const isSeller = order.sellerId === userId;
  const isAdmin = role === "admin";
  if (!isBuyer && !isSeller && !isAdmin) {
    return NextResponse.json({ error: "This is not your order." }, { status: 403 });
  }

  const transition = TRANSITIONS[order.escrowStage as keyof typeof TRANSITIONS];
  if (!transition) {
    return NextResponse.json({ error: "This order is already complete." }, { status: 409 });
  }

  // The seller ships; the buyer funds, confirms delivery and confirms receipt.
  // Admins can move any stage (dispute resolution, support).
  const actorOk = isAdmin || (transition.actor === "buyer" ? isBuyer : isSeller);
  if (!actorOk) {
    return NextResponse.json(
      { error: `Only the ${transition.actor} can advance this order from "${order.escrowStage}".` },
      { status: 403 }
    );
  }

  await db.transaction(async (tx) => {
    await tx.update(orders).set({ escrowStage: transition.next }).where(eq(orders.id, id));
    await tx.insert(orderActivity).values({ orderId: id, event: transition.event, tag: transition.tag });

    if (transition.next === "funded") {
      // Record the incoming transfer that paid for this order, then confirm
      // the hold against it. Deposit and hold net to zero on the buyer's
      // available balance, leaving the money visible as an escrow position
      // instead. With real custody this deposit row is exactly what the
      // chain watcher writes once it sees the transaction confirm.
      await tx.insert(ledgerEntries).values({
        userId: order.buyerId,
        orderId: id,
        type: "deposit",
        amountMinorUnits: order.amountMinorUnits,
        network: order.network,
        status: "confirmed",
      });
      await tx
        .update(ledgerEntries)
        .set({ status: "confirmed" })
        .where(eq(ledgerEntries.orderId, id));
    }

    if (transition.next === "confirmed") {
      // Release is posted gross and the commission is debited separately, so
      // the seller statement shows both lines and the two sum to their net.
      // Posting a net release AND a commission debit would charge it twice.
      const commission = Math.round((order.amountMinorUnits * order.commissionBps) / 10000);

      await tx.insert(ledgerEntries).values([
        {
          userId: order.sellerId,
          orderId: id,
          type: "escrow_release",
          amountMinorUnits: order.amountMinorUnits,
          network: order.network,
          status: "confirmed",
        },
        {
          userId: order.sellerId,
          orderId: id,
          type: "commission",
          amountMinorUnits: -commission,
          network: order.network,
          status: "confirmed",
        },
      ]);

      await tx.update(gems).set({ status: "sold" }).where(eq(gems.id, order.gemId));
    }
  });

  return NextResponse.json({ ok: true, escrowStage: transition.next, stageIndex: ESCROW_STAGES.indexOf(transition.next) });
}
