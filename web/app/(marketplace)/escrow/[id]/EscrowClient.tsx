"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, Gem, Seller } from "@/lib/types";
import { usdt, formatDate } from "@/lib/format";

const STEP_TITLES = ["Buyer paid", "Escrow funded", "Shipped", "Delivered", "Receipt confirmed"];
const STEP_WHEN = [
  "USDT received, awaiting confirmations",
  "Seller cleared to ship",
  "In transit, tracked and insured",
  "72-hour inspection window open",
  "Funds released to seller",
];

// Which party can move each stage, mirroring the server-side rule in
// /api/orders/[id]/advance — the button is hidden for the wrong party, but
// the API is what actually enforces it.
const STAGE_ACTOR: readonly ("buyer" | "seller")[] = ["buyer", "seller", "buyer", "buyer"];
const CTA_BY_STAGE = ["CONFIRM FUNDING", "CONFIRM SHIPMENT", "CONFIRM DELIVERY", "CONFIRM RECEIPT"];

export function EscrowClient({
  order,
  gem,
  seller,
  viewerRole,
}: {
  order: Order;
  gem: Gem;
  seller: Seller;
  viewerRole: "buyer" | "seller" | "admin";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stage = order.escrowStage;
  const commission = +(order.amount * (order.commissionPct / 100)).toFixed(2);
  const sellerReceives = +(order.amount - commission).toFixed(2);

  const canAdvance = stage < 4 && (viewerRole === "admin" || STAGE_ACTOR[stage] === viewerRole);

  async function advance() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/orders/${order.id}/advance`, { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not update this order.");
      return;
    }
    router.refresh();
  }

  return (
    <main>
      <section className="px-8 py-6.5 border-b-2 flex justify-between items-end gap-6 flex-wrap" style={{ borderColor: "var(--color-divider)" }}>
        <div>
          <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
            Order {order.id.slice(0, 8).toUpperCase()} · {STEP_TITLES[stage].toLowerCase()}
          </div>
          <h1 className="mb-1.5">{gem.title}</h1>
          <div className="text-[13px] opacity-65">
            {seller.name} · {gem.origin} · Placed {formatDate(order.createdAt)}
          </div>
        </div>
        <div className="text-right">
          <div className="label-micro mb-1">{stage < 4 ? "Held in escrow" : "Released"}</div>
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
            {order.activity.map((a, i) => (
              <div key={i} className="grid gap-4 py-3.5 border-b text-[13px] items-baseline" style={{ gridTemplateColumns: "150px 1fr auto", borderColor: "var(--color-divider)" }}>
                <span className="opacity-55 text-[11.5px]">{a.timestamp}</span>
                <span>{a.event}</span>
                <span className="text-[11px] font-semibold tracking-[.08em] uppercase" style={{ color: "var(--color-accent)" }}>
                  {a.tag}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="text-xs mt-4" style={{ color: "var(--color-accent)" }}>
              {error}
            </div>
          )}

          <div className="flex gap-2.5 mt-6 flex-wrap">
            {canAdvance && (
              <button className="btn btn-primary" style={{ padding: "14px 20px" }} onClick={advance} disabled={busy}>
                {busy ? "WORKING…" : CTA_BY_STAGE[stage]}
              </button>
            )}
            {stage < 4 && !canAdvance && (
              <div className="note">
                Waiting on the {STAGE_ACTOR[stage]} to {CTA_BY_STAGE[stage].toLowerCase().replace("confirm ", "confirm ")}.
              </div>
            )}
            {stage < 4 && (
              <>
                <button className="btn btn-secondary" style={{ padding: "14px 20px" }}>
                  OPEN A DISPUTE
                </button>
                <button className="btn btn-secondary" style={{ padding: "14px 20px" }}>
                  MESSAGE {viewerRole === "seller" ? "BUYER" : "SELLER"}
                </button>
              </>
            )}
          </div>

          {stage === 3 && viewerRole === "buyer" && (
            <div className="note mt-4.5 max-w-[74ch]">
              Confirming receipt releases {usdt(sellerReceives)} USDT to {seller.name} and cannot be undone. If the stone differs from the listing, open a dispute inside the 72-hour window and the funds stay frozen while the case is reviewed.
            </div>
          )}
          {stage === 4 && (
            <div className="note mt-4.5 max-w-[74ch]">
              This order is complete. {usdt(sellerReceives)} USDT was released to {seller.name} and {usdt(commission)} USDT was taken as commission.
            </div>
          )}
        </div>

        <div className="px-7 pt-6 pb-10">
          <h3 className="label-section !text-xs mb-3.5">Settlement</h3>
          <table className="table">
            <tbody>
              <tr>
                <td style={{ opacity: 0.6, width: "45%" }}>Network</td>
                <td style={{ fontWeight: 600 }}>{order.network}</td>
              </tr>
              <tr>
                <td style={{ opacity: 0.6 }}>Deposit address</td>
                <td style={{ fontWeight: 600, fontSize: 11, wordBreak: "break-all" }}>{order.depositAddress}</td>
              </tr>
              <tr>
                <td style={{ opacity: 0.6 }}>Marketplace ID</td>
                <td style={{ fontWeight: 600 }}>{gem.marketplaceId}</td>
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
              <span className="opacity-65">Seller receives {stage === 4 ? "" : "on release"}</span>
              <span className="font-semibold">{usdt(sellerReceives)}</span>
            </div>
          </div>

          <div className="note mt-4.5">
            Custody is not yet connected — the deposit address above is simulated and no USDT moves on-chain. Balances shown come from the marketplace ledger.
          </div>
        </div>
      </section>
    </main>
  );
}
