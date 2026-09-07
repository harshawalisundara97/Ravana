import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { sellerProfiles } from "@/db/schema";
import { SellerNav } from "@/components/seller/SellerNav";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  let displayName = session?.user?.name ?? "Seller";
  let plan = "free";
  if (userId) {
    const [profile] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1);
    if (profile) {
      displayName = profile.displayName;
      plan = profile.plan;
    }
  }

  return (
    <>
      <div className="flex items-center gap-6.5 px-7 py-3.5" style={{ background: "var(--color-text)", color: "var(--color-bg)" }}>
        <span className="font-heading font-extrabold text-[17px]">
          RAVANA<span style={{ color: "var(--color-accent)" }}>GEMS</span>{" "}
          <span className="font-normal text-[13px] tracking-[.14em] uppercase opacity-70">Seller Centre</span>
        </span>
        <span className="ml-auto flex items-center gap-4.5 text-[12.5px]">
          <span className="opacity-75 capitalize">
            {displayName} · {plan} plan
          </span>
          <Link href={userId ? `/sellers/${userId}` : "/sellers/s1"} className="btn" style={{ border: "1px solid rgba(243,242,242,.35)", color: "inherit", padding: "8px 14px" }}>
            VIEW PUBLIC SHOP
          </Link>
          <Link href="/sell" className="btn btn-primary" style={{ padding: "9px 15px" }}>
            ADD A GEM
          </Link>
        </span>
      </div>
      <div className="grid flex-1" style={{ gridTemplateColumns: "220px 1fr" }}>
        <SellerNav />
        <section className="px-8 pt-6 pb-16">{children}</section>
      </div>
    </>
  );
}
