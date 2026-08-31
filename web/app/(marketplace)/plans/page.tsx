import Link from "next/link";

export default function PlansPage() {
  return (
    <main>
      <section className="px-8 border-b-2" style={{ padding: "44px 32px 30px", borderColor: "var(--color-divider)" }}>
        <div className="text-[11px] tracking-[.16em] uppercase font-semibold mb-3.5" style={{ color: "var(--color-accent)" }}>
          Selling on RavanaGems
        </div>
        <h1 className="text-[54px] leading-none tracking-[-0.03em] max-w-[18ch] mb-3.5">LIST FREE. PAY WHEN THE STONE SELLS.</h1>
        <p className="text-base opacity-75 max-w-[62ch] m-0">No listing fee on any plan. Commission is taken from the settled amount when escrow releases — never up front, never on an unsold gem.</p>
      </section>

      <section className="grid grid-cols-3 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <div className="flex flex-col border-r px-8 pt-7 pb-8" style={{ borderColor: "var(--color-divider)" }}>
          <div className="font-heading font-extrabold text-[22px] mb-1.5">Free</div>
          <div className="font-heading font-extrabold text-[40px] tracking-[-0.02em] mb-1">0</div>
          <div className="text-xs opacity-60 mb-5.5">USDT / month · 5% commission</div>
          <div className="text-[13.5px] flex flex-col gap-2.5 flex-1">
            <span>20 active listings</span>
            <span>Standard search placement</span>
            <span>Escrow &amp; buyer protection</span>
            <span>Basic seller profile</span>
            <span className="opacity-45">No featured placement</span>
            <span className="opacity-45">No analytics</span>
          </div>
          <button className="btn btn-secondary text-left mt-6">START FREE</button>
        </div>
        <div className="flex flex-col border-r px-7 pt-7 pb-8" style={{ borderColor: "var(--color-divider)", background: "var(--color-surface)" }}>
          <div className="flex items-baseline gap-2.5 mb-1.5">
            <span className="font-heading font-extrabold text-[22px]">Pro</span>
            <span className="tag tag-accent" style={{ fontWeight: 600 }}>
              MOST SELLERS
            </span>
          </div>
          <div className="font-heading font-extrabold text-[40px] tracking-[-0.02em] mb-1">49</div>
          <div className="text-xs opacity-60 mb-5.5">USDT / month · 3% commission</div>
          <div className="text-[13.5px] flex flex-col gap-2.5 flex-1">
            <span>500 active listings</span>
            <span>Priority search placement</span>
            <span>4 featured slots a month</span>
            <span>Sales &amp; traffic analytics</span>
            <span>Auction listings</span>
            <span>Fast responder badge</span>
          </div>
          <Link href="/seller" className="btn btn-primary text-left mt-6">
            CHOOSE PRO
          </Link>
        </div>
        <div className="flex flex-col px-8 pt-7 pb-8">
          <div className="font-heading font-extrabold text-[22px] mb-1.5">Business</div>
          <div className="font-heading font-extrabold text-[40px] tracking-[-0.02em] mb-1">199</div>
          <div className="text-xs opacity-60 mb-5.5">USDT / month · 2% commission</div>
          <div className="text-[13.5px] flex flex-col gap-2.5 flex-1">
            <span>Unlimited listings</span>
            <span>Top search placement</span>
            <span>20 featured slots a month</span>
            <span>Full analytics &amp; exports</span>
            <span>Bulk upload &amp; API access</span>
            <span>Named account manager</span>
          </div>
          <button className="btn btn-secondary text-left mt-6">TALK TO US</button>
        </div>
      </section>

      <section className="px-8 py-7.5 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <h3 className="label-section !text-xs mb-3.5">What a 2,850 USDT sale actually pays</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Monthly</th>
              <th>Commission</th>
              <th>You receive on one sale</th>
              <th>Break-even sales / month</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free</td>
              <td>0</td>
              <td>5% — 142.50</td>
              <td style={{ fontWeight: 600 }}>2,707.50</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Pro</td>
              <td>49</td>
              <td>3% — 85.50</td>
              <td style={{ fontWeight: 600 }}>2,764.50</td>
              <td>1 sale</td>
            </tr>
            <tr>
              <td>Business</td>
              <td>199</td>
              <td>2% — 57.00</td>
              <td style={{ fontWeight: 600 }}>2,793.00</td>
              <td>3 sales</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="px-8 py-12 flex items-end justify-between gap-10 flex-wrap" style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}>
        <h2 className="text-[48px] leading-none tracking-[-0.03em] max-w-[18ch] m-0">FEATURED PLACEMENT IS 20 USDT FOR SEVEN DAYS ON ANY PLAN.</h2>
        <Link href="/sell" className="btn whitespace-nowrap" style={{ background: "var(--color-bg)", color: "var(--color-text)", padding: "16px 24px" }}>
          LIST A GEM
        </Link>
      </section>
    </main>
  );
}
