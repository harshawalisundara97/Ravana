import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, kycEvents } from "@/db/schema";
import { getKycProvider } from "@/lib/kyc";

// The vendor calls this directly — never gated behind our own auth() check,
// since the caller is Sumsub's servers, not a signed-in user. Trust is
// established entirely by the HMAC signature instead.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const provider = getKycProvider();

  if (!provider.verifyWebhookSignature(rawBody, req.headers)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const event = provider.parseWebhookEvent(rawBody);

  const [user] = await db.select().from(users).where(eq(users.kycApplicantId, event.applicantId)).limit(1);
  if (!user) {
    // Applicant we don't recognise — acknowledge so the vendor doesn't retry
    // forever, but don't touch anything.
    return NextResponse.json({ ok: true, ignored: true });
  }

  await db
    .update(users)
    .set({ kycStatus: event.status, kycUpdatedAt: new Date() })
    .where(eq(users.id, user.id));

  await db.insert(kycEvents).values({
    userId: user.id,
    provider: provider.name,
    eventType: event.eventType,
    resultStatus: event.status,
    rawPayload: rawBody,
  });

  return NextResponse.json({ ok: true });
}
