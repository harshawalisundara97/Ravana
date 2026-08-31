"use client";
import { useState } from "react";
import type { Order, Gem, Seller } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { usdt } from "@/lib/format";

const STEP_TITLES = ["Buyer paid", "Escrow funded", "Shipped", "Delivered", "Receipt confirmed"];
const STEP_WHEN = [
  "USDT received, awaiting confirmations",
  "Seller cleared to ship",
  "In transit, tracked and insured",
  "72-hour inspection window open",
  "Funds released to seller",
];
const CTA_BY_STAGE = ["MARK AS PAID", "CONFIRM FUNDING", "CONFIRM SHIPMENT", "CONFIRM RECEIPT", "RESTART DEMO"];

export function EscrowClient({ order, gem, seller }: { order: Order; gem: Gem; seller: Seller }) {
  const [stage, setStage] = useState(order.escrowStage);
  const [activity, setActivity] = useState(order.activity);

  function advance() {
    if (stage >= 4) {
      setStage(order.escrowStage);
      setActivity(order.activity);
      return;
    }
    const next = (stage + 1) as typeof stage;
    setStage(next);
    setActivity((prev) => [...prev, { timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), event: STEP_TITLES[next], tag: STEP_TITLES[next].toUpperCase().split(" ")[0] }]);
  }

  const commission = +(order.amount * (order.commissionPct / 100)).toFixed(2);
  const sellerReceives = +(order.amount - commission).toFixed(2);

  return (
    <main>
      <section className="px-8 py-6.5 border-b-2 flex justify-between items-end gap-6 flex-wrap" style={{ borderColor: "var(--color-divider)" }}>
        <div>
          <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
            Order RG-{order.id.toUpperCase()} · {STEP_TITLES[stage].toLowerCase()}
          </div>
          <h1 className="mb-1.5">{gem.title}</h1>
          <div className="text-[13px] opacity-65">
            {seller.name}, {gem.origin} → New York · Placed {formatDate(order.createdAt)}
          </div>
        </div>
        <div className="text-right">
          <div className="label-micro mb-1">Held in escrow</div>
          <div className="font-heading font-extrabold text-[34px] tracking-[-0.02em]">
            {usdt(order.amount)} <span className="text-xs tracking-[.12em] opacity-60">USDT</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-5 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        {STEP_TITLES.map((title, i) => (
          <div key={title} className="px-4.5 pt-5 pb-5.5" style={{ borderRight: i < 4 ? "1px solid var(--color-divider)" : undefined }}>
            <div className="h-1.5 mb-3.5" style={{ background: i < stage ? "var(--color-accent)" : i === stage ? "var(--color-neutral-400)" : "var(--color-neutral-200)" }} />
            <div className="font-heading font-extrabold text-xs mb-1.5" style={{ color: i <= stage ? "var(--color-accent)" : "var(--color-neutral-500)" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="font-heading font-extrabold text-[15px] mb-1.5">{title}</div>
            <div className="text-[11.5px] opacity-60 leading-relaxed">{STEP_WHEN[i]}</div>
          </div>
        ))}
      </section>

      <section className="grid" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div className="border-r-2 px-8 pt-6 pb-10" style={{ borderColor: "var(--color-divider)" }}>
          <h3 className="label-section !text-xs mb-3.5">Activity</h3>
          <div className="border-t" style={{ borderColor: "var(--color-divider)" }}>
            {activity.map((a, i) => (
              <div key={i} className="grid gap-4 py-3.5 border-b text-[13px] items-baseline" style={{ gridTemplateColumns: "150px 1fr auto", borderColor: "var(--color-divider)" }}>
                <span className="opacity-55 text-[11.5px]">{a.timestamp}</span>
                <span>{a.event}</span>
                <span className="text-[11px] font-semibold tracking-[.08em] uppercase" style={{ color: "var(--color-accent)" }}>
                  {a.tag}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2.5 mt-6 flex-wrap">
            <button className="btn btn-primary" style={{ padding: "14px 20px" }} onClick={advance}>
              {CTA_BY_STAGE[stage]}
            </button>
            <button className="btn btn-secondary" style={{ padding: "14px 20px" }}>
              OPEN A DISPUTE
            </button>
            <button className="btn btn-secondary" style={{ padding: "14px 20px" }}>
              MESSAGE SELLER
            </button>
          </div>
          <div className="note mt-4.5 max-w-[74ch]">
            Confirming receipt releases {usdt(order.amount)} USDT to {seller.name} and cannot be undone. If the stone differs from the listing, open a dispute inside the 72-hour window and the funds stay frozen while the case is reviewed.
          </div>
        </div>
        <div className="px-7 pt-6 pb-10">
          <h3 className="label-section !text-xs mb-3.5">Shipment</h3>
          <table className="table">
            <tbody>
              <tr>
                <td style={{ opacity: 0.6, width: "45%" }}>Carrier</td>
                <td style={{ fontWeight: 600 }}>FedEx Priority</td>
              </tr>
              <tr>
                <td style={{ opacity: 0.6 }}>Tracking</td>
                <td style={{ fontWeight: 600 }}>7789 4412 0031</td>
              </tr>
              <tr>
                <td style={{ opacity: 0.6 }}>Insured to</td>
                <td style={{ fontWeight: 600 }}>25,000 USDT</td>
              </tr>
              <tr>
                <td style={{ opacity: 0.6 }}>Est. delivery</td>
                <td style={{ fontWeight: 600 }}>3 Sep 2026</td>
              </tr>
              <tr>
                <td style={{ opacity: 0.6 }}>Inspection ends</td>
                <td style={{ fontWeight: 600 }}>6 Sep 2026, 17:00 UTC</td>
              </tr>
            </tbody>
          </table>
          <h3 className="label-section !text-xs mt-6.5 mb-3.5">Funds flow</h3>
          <div className="flex flex-col text-[13px]">
            <div className="flex justify-between py-2.5 border-t" style={{ borderColor: "var(--color-divider)" }}>
              <span className="opacity-65">Buyer paid</span>
              <span className="font-semibold">{usdt(order.amount)}</span>
            </div>
            <div className="flex justify-between py-2.5 border-t" style={{ borderColor: "var(--color-divider)" }}>
              <span className="opacity-65">In escrow now</span>
              <span className="font-semibold" style={{ color: "var(--color-accent)" }}>
                {usdt(stage < 4 ? order.amount : 0)}
              </span>
            </div>
            <div className="flex justify-between py-2.5 border-t" style={{ borderColor: "var(--color-divider)" }}>
              <span className="opacity-65">Platform commission {order.commissionPct}%</span>
              <span className="font-semibold">{usdt(commission)}</span>
            </div>
            <div className="flex justify-between py-2.5 border-t border-b" style={{ borderColor: "var(--color-divider)" }}>
              <span className="opacity-65">Seller receives on release</span>
              <span className="font-semibold">{usdt(sellerReceives)}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
