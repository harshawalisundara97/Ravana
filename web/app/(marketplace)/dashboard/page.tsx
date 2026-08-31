import Link from "next/link";
import { walletTransactions } from "@/lib/data";
import { usdt } from "@/lib/format";

const NAV = [
  { name: "Overview", meta: "" },
  { name: "Orders", meta: "4" },
  { name: "Offers", meta: "3" },
  { name: "Saved gems", meta: "18" },
  { name: "Following", meta: "6" },
  { name: "Messages", meta: "1" },
  { name: "Wallet", meta: "" },
  { name: "Verification", meta: "" },
  { name: "Settings", meta: "" },
];

const ORDERS = [
  { order: "RG-88104", stone: "2.15 ct Blue Sapphire", amount: "2,895.00", tag: "In escrow", cls: "tag-accent" },
  { order: "RG-87720", stone: "1.04 ct Mahenge Spinel", amount: "1,180.00", tag: "Delivered", cls: "tag-neutral" },
  { order: "RG-87001", stone: "3.44 ct Yellow Sapphire", amount: "2,145.00", tag: "Completed", cls: "tag-neutral" },
  { order: "RG-86544", stone: "2.66 ct Tsavorite", amount: "3,300.00", tag: "Disputed", cls: "tag-outline" },
];

const OFFERS = [
  { stone: "1.42 ct Burmese Ruby", offer: "8,600", seller: "Mogok House", tag: "Countered 9,000", cls: "tag-accent" },
  { stone: "5.12 ct Aquamarine", offer: "1,700", seller: "Minas Azul", tag: "Pending 41h", cls: "tag-neutral" },
  { stone: "0.92 ct Alexandrite", offer: "8,100", seller: "Ceylon Rare Stones", tag: "Declined", cls: "tag-neutral" },
];

export default function BuyerDashboardPage() {
  return (
    <main className="grid" style={{ gridTemplateColumns: "230px 1fr" }}>
      <aside className="border-r-2 pt-6.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <div className="px-5 pb-4.5 flex gap-3 items-center">
          <div className="w-10 h-10 flex-none bg-cover bg-center grayscale-photo" style={{ backgroundImage: "url(/gems/gem-05.jpg)" }} />
          <div>
            <div className="font-heading font-extrabold text-[15px]">A. Fernando</div>
            <div className="text-[11px] opacity-55">Buyer · since 2024</div>
          </div>
        </div>
        {NAV.map((n) => (
          <div key={n.name} className="px-5 py-2.5 border-t text-[13.5px] flex justify-between" style={{ borderColor: "var(--color-divider)" }}>
            <span>{n.name}</span>
            <span className="opacity-50 text-[11.5px]">{n.meta}</span>
          </div>
        ))}
        <div className="border-t" style={{ borderColor: "var(--color-divider)" }} />
        <Link href="/seller" className="btn btn-primary block text-left" style={{ margin: "22px 20px 0", width: "calc(100% - 40px)" }}>
          SWITCH TO SELLING
        </Link>
      </aside>

      <section className="px-8 pt-6.5 pb-16">
        <h1 className="mb-5.5">Overview</h1>
        <div className="grid grid-cols-4 border-t-2 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
          {[
            ["Available", "1,240.00", "USDT · withdrawable", false],
            ["In escrow", "2,895.00", "1 order in transit", true],
            ["Pending offers", "3", "1 countered", false],
            ["Collection value", "18,410", "11 stones, at cost", false],
          ].map(([label, num, note, accent], i) => (
            <div key={label as string} className="py-5" style={{ paddingLeft: i === 0 ? 0 : 20, paddingRight: 20, borderRight: i < 3 ? "1px solid var(--color-divider)" : undefined }}>
              <div className="label-micro mb-1.5">{label}</div>
              <div className="font-heading font-extrabold text-[28px]" style={{ color: accent ? "var(--color-accent)" : undefined }}>
                {num}
              </div>
              <div className="text-[11px] opacity-50">{note}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-9 mt-8" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
          <div>
            <h3 className="label-section !text-xs mb-3">Orders</h3>
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
                {ORDERS.map((o) => (
                  <tr key={o.order}>
                    <td>{o.order}</td>
                    <td>{o.stone}</td>
                    <td>{o.amount}</td>
                    <td>
                      <span className={`tag ${o.cls}`}>{o.tag}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="label-section !text-xs mt-7.5 mb-3">Offers</h3>
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
                {OFFERS.map((o) => (
                  <tr key={o.stone}>
                    <td>{o.stone}</td>
                    <td>{o.offer}</td>
                    <td>{o.seller}</td>
                    <td>
                      <span className={`tag ${o.cls}`}>{o.tag}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="label-section !text-xs mb-3">Wallet activity</h3>
            <div className="border-t" style={{ borderColor: "var(--color-divider)" }}>
              {walletTransactions.slice(0, 5).map((w) => (
                <div key={w.id} className="flex justify-between gap-3 py-3 border-b text-[13px]" style={{ borderColor: "var(--color-divider)" }}>
                  <span>
                    <span className="block capitalize">{w.type}</span>
                    <span className="text-[11px] opacity-50">{w.network}</span>
                  </span>
                  <span className="font-semibold whitespace-nowrap" style={{ color: w.amount > 0 ? "var(--color-accent)" : undefined }}>
                    {w.amount > 0 ? "+" : ""}
                    {usdt(w.amount)}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/escrow/o1" className="btn btn-secondary block text-left mt-4">
              TRACK ACTIVE ORDER
            </Link>
            <div className="note mt-4">Withdrawals settle to your verified TRC20 address within one hour. Adding a new address triggers a 24-hour security hold.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
