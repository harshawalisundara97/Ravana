"use client";
import { useState } from "react";
import Link from "next/link";
import type { Gem, Bid } from "@/lib/types";
import { usdt } from "@/lib/format";

export function AuctionClient({ gem, bids, catalogue }: { gem: Gem; bids: Bid[]; catalogue: Gem[] }) {
  const [ended, setEnded] = useState(false);
  const auction = gem.auction!;

  return (
    <main>
      <section className="grid border-b-2" style={{ gridTemplateColumns: "1.1fr .9fr", borderColor: "var(--color-divider)" }}>
        <div className="border-r-2 bg-cover bg-center grayscale-photo" style={{ borderColor: "var(--color-divider)", backgroundImage: `url(${gem.photos[0]})`, minHeight: 520 }} />
        <div className="px-8 pt-6.5 pb-8">
          {!ended ? (
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="pulse-dot" />
              <span className="text-[11px] tracking-[.16em] uppercase font-semibold" style={{ color: "var(--color-accent)" }}>
                Live · lot {auction.lotNumber} of {auction.lotsTotal}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="text-[11px] tracking-[.16em] uppercase font-semibold" style={{ color: "var(--color-accent)" }}>
                Auction closed · you won
              </span>
            </div>
          )}

          <h1 className="text-[36px] leading-[1.02] tracking-[-0.025em] mb-2.5">{gem.title}</h1>
          <div className="text-[13.5px] opacity-70 mb-5">
            {gem.treatment} · {gem.colour} · {gem.certLab} report · {gem.origin}
          </div>

          <div className="grid grid-cols-3 border-t-2 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
            <div className="py-4">
              <div className="label-micro mb-1.5">Current bid</div>
              <div className="font-heading font-extrabold text-[30px]">{usdt(auction.currentBid)}</div>
              <div className="text-[11px] opacity-50">USDT · reserve met</div>
            </div>
            <div className="py-4">
              <div className="label-micro mb-1.5">Time left</div>
              <div className="font-heading font-extrabold text-[30px]" style={{ color: "var(--color-accent)" }}>
                02:14:32
              </div>
              <div className="text-[11px] opacity-50">Ends 30 Aug 14:00 UTC</div>
            </div>
            <div className="py-4">
              <div className="label-micro mb-1.5">Bidders</div>
              <div className="font-heading font-extrabold text-[30px]">{auction.bidders}</div>
              <div className="text-[11px] opacity-50">{bids.length} bids placed</div>
            </div>
          </div>

          {!ended ? (
            <div className="mt-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="field">
                  <label>Your bid (min {usdt(auction.currentBid + auction.incrementTier)})</label>
                  <input className="input" defaultValue={usdt(auction.currentBid + auction.incrementTier)} />
                </div>
                <div className="field">
                  <label>Maximum — proxy bidding</label>
                  <input className="input" defaultValue={usdt(auction.currentBid + auction.incrementTier * 10)} />
                </div>
              </div>
              <div className="flex gap-2.5 mt-1.5">
                <button className="btn btn-primary" style={{ padding: "15px 22px" }}>
                  PLACE BID — {usdt(auction.currentBid + auction.incrementTier)} USDT
                </button>
                <button className="btn btn-secondary" style={{ padding: "15px 20px" }}>
                  SET AUTO-BID
                </button>
              </div>
              <div className="note mt-4">
                <strong className="font-heading text-[13px]">Auto-bidding.</strong> We bid the smallest increment needed to keep you in front, up to your maximum. Your maximum is never shown to anyone.
              </div>
            </div>
          ) : (
            <div className="mt-5 p-5" style={{ border: "2px solid var(--color-accent)" }}>
              <div className="font-heading font-extrabold text-[22px] mb-2">You won this lot at {usdt(auction.currentBid)} USDT</div>
              <div className="text-[13px] leading-relaxed opacity-80 mb-4">Payment is due within 48 hours or the lot passes to the underbidder and a strike is recorded on your account. Funds go to escrow, not to the seller.</div>
              <div className="text-[13px] flex flex-col gap-2 border-t pt-3 mb-4" style={{ borderColor: "var(--color-divider)" }}>
                <div className="flex justify-between">
                  <span className="opacity-65">Hammer price</span>
                  <span className="font-semibold">{usdt(auction.currentBid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-65">Insured shipping</span>
                  <span className="font-semibold">45.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-65">Escrow &amp; network fee</span>
                  <span className="font-semibold">13.40</span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t" style={{ borderColor: "var(--color-divider)" }}>
                  <span className="font-heading font-extrabold">Due now</span>
                  <span className="font-heading font-extrabold">{usdt(auction.currentBid + 58.4)} USDT</span>
                </div>
              </div>
              <Link href="/cart" className="btn btn-primary w-full text-left block">
                PAY {usdt(auction.currentBid + 58.4)} USDT
              </Link>
            </div>
          )}

          <button className="btn-ghost text-[12.5px] font-extrabold pt-3.5" style={{ fontFamily: "var(--font-heading)" }} onClick={() => setEnded((v) => !v)}>
            TOGGLE LIVE / WON STATE →
          </button>
        </div>
      </section>

      <section className="grid border-b-2" style={{ gridTemplateColumns: "1.2fr 1fr", borderColor: "var(--color-divider)" }}>
        <div className="px-8 py-6 border-r-2" style={{ borderColor: "var(--color-divider)" }}>
          <h3 className="label-section !text-xs mb-3">Bid history</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Bidder</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b) => (
                <tr key={b.id}>
                  <td>{new Date(b.createdAt).toISOString().slice(11, 19)}</td>
                  <td>{b.bidderHandle}</td>
                  <td>{b.isAuto ? "Auto-bid" : "Manual"}</td>
                  <td style={b.isSelf ? { fontWeight: 600, color: "var(--color-accent)" } : undefined}>{usdt(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6">
          <h3 className="label-section !text-xs mb-3">Increment rules</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Current bid</th>
                <th>Minimum increment</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Up to 500", "25 USDT"],
                ["500 – 2,000", "50 USDT"],
                ["2,000 – 5,000", "100 USDT"],
                ["5,000 – 20,000", "250 USDT"],
                ["Above 20,000", "500 USDT"],
              ].map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="note mt-4">A bid in the last two minutes extends the lot by two minutes. Reserve prices are hidden but the lot shows whether the reserve has been met.</div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline px-8 pt-5.5 pb-4">
          <h2 className="m-0">Catalogue — {auction.lotsTotal} lots live</h2>
          <span className="text-[12.5px] opacity-55">Sale closes rolling, 30 Aug – 1 Sep</span>
        </div>
        <div className="grid grid-cols-3 border-t" style={{ borderColor: "var(--color-divider)" }}>
          {catalogue.map((g) => (
            <Link key={g.id} href={`/auctions/${g.id}`} className="flex flex-col no-underline" style={{ color: "var(--color-text)", borderRight: "1px solid var(--color-divider)", borderBottom: "1px solid var(--color-divider)" }}>
              <div className="relative bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${g.photos[0]})`, aspectRatio: "16/10" }}>
                <span className="absolute top-2.5 left-2.5 uppercase text-[10px] tracking-wider font-semibold px-1.5 py-0.5" style={{ background: "var(--color-bg)" }}>
                  {g.auction ? `${Math.max(1, Math.floor((new Date(g.auction.endsAt).getTime() - Date.now()) / 3600000))}h left` : ""}
                </span>
              </div>
              <div className="px-4.5 pt-3.5 flex flex-col gap-1.5 pb-4">
                <span className="font-heading font-extrabold text-base">{g.title}</span>
                <span className="text-xs opacity-60">{g.auction?.bidders} bids</span>
                <span className="font-heading font-extrabold text-[19px]">
                  {usdt(g.auction?.currentBid ?? g.price)} <span className="text-[11px] opacity-55 tracking-wider">USDT</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
