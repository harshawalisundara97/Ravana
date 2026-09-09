import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBuyerDashboard } from "@/lib/queries";
import { usdt, formatDate } from "@/lib/format";

// Balances and orders are per-account, so this can never be prerendered.
export const dynamic = "force-dynamic";

const STAGE_TAG: Record<number, string> = {
  0: "tag-outline",
  1: "tag-accent",
  2: "tag-accent",
  3: "tag-accent",
  4: "tag-neutral",
};

const OFFER_TAG: Record<string, string> = {
  pending: "tag-accent",
  countered: "tag-accent",
  accepted: "tag-neutral",
  declined: "tag-neutral",
};

export default async function BuyerDashboardPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login?callbackUrl=/dashboard");

  const { wallet, orders, offers, pendingOffers, collectionValue } = await getBuyerDashboard(userId);
  const openOrders = orders.filter((o) => o.stage < 4);

  return (
    <main className="grid" style={{ gridTemplateColumns: "230px 1fr" }}>
      <aside className="border-r-2 pt-6.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <div className="px-5 pb-4.5">
          <div className="font-heading font-extrabold text-[15px]">{session?.user?.name}</div>
          <div className="text-[11px] opacity-55">Buyer · {session?.user?.email}</div>
        </div>
        {[
          { name: "Overview", meta: "" },
          { name: "Orders", meta: orders.length ? String(orders.length) : "" },
          { name: "Offers", meta: offers.length ? String(offers.length) : "" },
          { name: "Messages", meta: "" },
          { name: "Wallet", meta: "", href: "/wallet" },
          { name: "Verification", meta: "", href: "/signup" },
          { name: "Settings", meta: "" },
        ].map((n) =>
          n.href ? (
            <Link
              key={n.name}
              href={n.href}
              className="px-5 py-2.5 border-t text-[13.5px] flex justify-between no-underline"
              style={{ borderColor: "var(--color-divider)", color: "var(--color-text)" }}
            >
              <span>{n.name}</span>
              <span className="opacity-50 text-[11.5px]">{n.meta}</span>
            </Link>
          ) : (
            <div key={n.name} className="px-5 py-2.5 border-t text-[13.5px] flex justify-between" style={{ borderColor: "var(--color-divider)" }}>
              <span>{n.name}</span>
              <span className="opacity-50 text-[11.5px]">{n.meta}</span>
            </div>
          )
        )}
        <div className="border-t" style={{ borderColor: "var(--color-divider)" }} />
        <Link href="/seller" className="btn btn-primary block text-left" style={{ margin: "22px 20px 0", width: "calc(100% - 40px)" }}>
          SWITCH TO SELLING
        </Link>
      </aside>

      <section className="px-8 pt-6.5 pb-16">
        <h1 className="mb-5.5">Overview</h1>
        <div className="grid grid-cols-4 border-t-2 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
          {[
            { label: "Available", value: usdt(wallet.available), note: "USDT · withdrawable", accent: false },
            {
              label: "In escrow",
              value: usdt(wallet.inEscrow),
              note: `${openOrders.length} ${openOrders.length === 1 ? "order" : "orders"} in flight`,
              accent: true,
            },
            { label: "Pending offers", value: String(pendingOffers), note: offers.length ? `${offers.length} total` : "none yet", accent: false },
            {
              label: "Collection value",
              value: usdt(collectionValue),
              note: `${orders.filter((o) => o.stage === 4).length} ${orders.filter((o) => o.stage === 4).length === 1 ? "stone" : "stones"}, at cost`,
              accent: false,
            },
          ].map((m, i) => (
            <div key={m.label} className="py-5" style={{ paddingLeft: i === 0 ? 0 : 20, paddingRight: 20, borderRight: i < 3 ? "1px solid var(--color-divider)" : undefined }}>
              <div className="label-micro mb-1.5">{m.label}</div>
              <div className="font-heading font-extrabold text-[28px]" style={{ color: m.accent ? "var(--color-accent)" : undefined }}>
                {m.value}
              </div>
              <div className="text-[11px] opacity-50">{m.note}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-9 mt-8" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
          <div>
            <h3 className="label-section !text-xs mb-3">Orders</h3>
            {orders.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Stone</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`/escrow/${o.id}`} style={{ color: "var(--color-accent)", fontWeight: 600 }}>
                          {o.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td>{o.gemTitle}</td>
                      <td>{usdt(o.amount)}</td>
                      <td>
                        <span className={`tag ${STAGE_TAG[o.stage]}`}>{o.stageLabel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="note">
                No orders yet. <Link href="/explore">Browse the marketplace</Link> to buy your first stone.
              </div>
            )}

            <h3 className="label-section !text-xs mt-7.5 mb-3">Offers</h3>
            {offers.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Stone</th>
                    <th>Your offer</th>
                    <th>Seller</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`/gems/${o.gemId}`} style={{ color: "inherit" }}>
                          {o.gemTitle}
                        </Link>
                      </td>
                      <td>{usdt(o.amount)}</td>
                      <td>{o.sellerName}</td>
                      <td>
                        <span className={`tag ${OFFER_TAG[o.status] ?? "tag-neutral"}`}>{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="note">No open offers. Make one from any listing that accepts them.</div>
            )}
          </div>

          <div>
            <h3 className="label-section !text-xs mb-3">Wallet activity</h3>
            {wallet.transactions.length ? (
              <div className="border-t" style={{ borderColor: "var(--color-divider)" }}>
                {wallet.transactions.slice(0, 6).map((t) => (
                  <div key={t.id} className="flex justify-between gap-3 py-3 border-b text-[13px]" style={{ borderColor: "var(--color-divider)" }}>
                    <span>
                      <span className="block capitalize">{t.type.replace(/_/g, " ")}</span>
                      <span className="text-[11px] opacity-50">
                        {formatDate(t.createdAt)}
                        {t.network ? ` · ${t.network}` : ""}
                      </span>
                    </span>
                    <span className="font-semibold whitespace-nowrap" style={{ color: t.amount > 0 ? "var(--color-accent)" : undefined }}>
                      {t.amount > 0 ? "+" : ""}
                      {usdt(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="note">No wallet activity yet.</div>
            )}

            {openOrders[0] && (
              <Link href={`/escrow/${openOrders[0].id}`} className="btn btn-secondary block text-left mt-4">
                TRACK ACTIVE ORDER
              </Link>
            )}
            <Link href="/wallet" className="btn btn-secondary block text-left mt-2">
              OPEN WALLET
            </Link>

            <div className="note mt-4">
              Custody is not connected yet, so balances here come from the marketplace ledger rather than an on-chain wallet.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
