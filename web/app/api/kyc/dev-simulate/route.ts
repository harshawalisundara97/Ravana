import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, kycEvents } from "@/db/schema";

// Stands in for the vendor's webhook while KYC_PROVIDER=mock. Hard-gated so
// it can never fire a status change once a real provider is configured —
// this route is for local development and demoing the flow only.
export async function POST(req: Request) {
  if (process.env.KYC_PROVIDER === "sumsub") {
    return NextResponse.json({ error: "Not available: a real KYC provider is configured." }, { status: 403 });
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { outcome } = (await req.json()) as { outcome?: "cleared" | "rejected" };
  if (outcome !== "cleared" && outcome !== "rejected") {
    return NextResponse.json({ error: "outcome must be 'cleared' or 'rejected'." }, { status: 400 });
  }

  await db.update(users).set({ kycStatus: outcome, kycUpdatedAt: new Date() }).where(eq(users.id, userId));

  await db.insert(kycEvents).values({
    userId,
    provider: "mock",
    eventType: "dev-simulated",
    resultStatus: outcome,
    rawPayload: null,
  });

  return NextResponse.json({ ok: true, kycStatus: outcome });
}
