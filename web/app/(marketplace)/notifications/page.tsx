import { NotificationToggles } from "@/components/marketplace/NotificationToggles";

const TODAY = [
  { unread: true, title: "Mogok House countered your offer", detail: "1.42 ct Burmese Ruby — 9,000 USDT, expires in 41h", time: "09:40" },
  { unread: true, title: "Payment detected — 3,977.40 USDT", detail: "Order RG-88104 is funded and both sellers are cleared to ship", time: "11:06" },
  { unread: true, title: "Auction ending in 2 hours", detail: "2.85 ct Ceylon Blue Sapphire — you are the highest bidder at 4,250 USDT", time: "09:12" },
  { unread: false, title: "Ceylon Rare Stones replied to your question", detail: "“The GRS report confirms heat only, with no diffusion…”", time: "11:12" },
];

const EARLIER = [
  { unread: false, title: "Price dropped on a saved gem", detail: "5.12 ct Santa Maria Aquamarine — 2,180 → 1,980 USDT", time: "28 Aug" },
  { unread: false, title: "Dispute D-2026-0117 resolved in your favour", detail: "3,300.00 USDT refunded to your wallet", time: "27 Aug" },
  { unread: false, title: "New gem from a seller you follow", detail: "Ratnapura Fine listed a 1.86 ct Padparadscha", time: "26 Aug" },
  { unread: false, title: "Withdrawal of 1,500.00 USDT sent", detail: "TRC20 · confirmed in 4 minutes", time: "24 Aug" },
];

function Row({ n }: { n: (typeof TODAY)[number] }) {
  return (
    <div className="grid gap-4 py-3.5 border-b items-center" style={{ gridTemplateColumns: "8px 1fr auto", borderColor: "var(--color-divider)" }}>
      <span className="w-2 h-2" style={{ background: n.unread ? "var(--color-accent)" : "transparent" }} />
      <span>
        <span className="font-heading font-extrabold text-[14.5px] block mb-0.5">{n.title}</span>
        <span className="text-[12.5px] opacity-65">{n.detail}</span>
      </span>
      <span className="text-[11.5px] opacity-50">{n.time}</span>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <main className="grid" style={{ gridTemplateColumns: "1fr 320px" }}>
      <section className="border-r-2 px-8 pt-6.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <div className="flex justify-between items-end gap-5 mb-4.5">
          <div>
            <h1 className="mb-1.5">Notifications</h1>
            <div className="text-[13px] opacity-60">9 unread</div>
          </div>
          <button className="btn-ghost text-[13px] font-extrabold" style={{ fontFamily: "var(--font-heading)" }}>
            MARK ALL READ
          </button>
        </div>
        <div className="seg mb-1.5">
          {["All", "Offers", "Orders", "Auctions", "Messages", "System"].map((s, i) => (
            <button key={s} type="button" className={`seg-opt ${i === 0 ? "is-active" : ""}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="label-micro mt-6 mb-2">Today</div>
        <div className="border-t-2" style={{ borderColor: "var(--color-divider)" }}>
          {TODAY.map((n) => (
            <Row key={n.title} n={n} />
          ))}
        </div>

        <div className="label-micro mt-7 mb-2">Earlier this week</div>
        <div className="border-t-2" style={{ borderColor: "var(--color-divider)" }}>
          {EARLIER.map((n) => (
            <Row key={n.title} n={n} />
          ))}
        </div>
      </section>
      <aside className="px-6 pt-6.5 pb-16">
        <h3 className="label-section !text-xs mb-3.5">What you get told about</h3>
        <NotificationToggles />
        <div className="note mt-4.5">Auction and escrow alerts cannot be switched off — they carry deadlines that cost money.</div>
      </aside>
    </main>
  );
}
