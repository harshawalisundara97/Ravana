import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getKycProvider } from "@/lib/kyc";

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to start identity verification." }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const provider = getKycProvider();
  const kycSession = await provider.createSession({ userId: user.id, email: user.email, fullName: user.name });

  await db
    .update(users)
    .set({
      kycProvider: provider.name,
      kycApplicantId: kycSession.applicantId,
      kycStatus: user.kycStatus === "cleared" ? "cleared" : "in_progress",
      kycUpdatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return NextResponse.json({ applicantId: kycSession.applicantId, token: kycSession.token, mock: kycSession.mock });
}
