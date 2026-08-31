import Link from "next/link";
import { usdt } from "@/lib/format";

const MONTH_HEIGHTS = [38, 52, 44, 61, 57, 73, 66, 81, 70, 88, 79, 100];
const MONTH_LABELS = ["S", "O", "N", "D", "J", "F", "M", "A", "M", "J", "J", "A"];

const ACTION_ROWS = [
  { order: "RG-88104", stone: "2.15 ct Blue Sapphire", amount: "2,895.00", tag: "Ship today", cls: "tag-accent" },
  { order: "RG-88090", stone: "0.92 ct Alexandrite", amount: "8,900.00", tag: "Ship today", cls: "tag-accent" },
  { order: "RG-88077", stone: "3.44 ct Yellow Sapphire", amount: "2,100.00", tag: "Offer to answer", cls: "tag-outline" },
  { order: "RG-87994", stone: "6.80 ct Star Sapphire", amount: "1,450.00", tag: "Awaiting buyer", cls: "tag-neutral" },
  { order: "RG-87901", stone: "1.86 ct Padparadscha", amount: "12,800.00", tag: "In transit", cls: "tag-neutral" },
];

export default function SellerDashboardPage() {
  return (
    <div>
      <h1 className="mb-5">Dashboard</h1>
      <div className="grid grid-cols-5 border-t-2 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        {[
          ["Sales, 30 d", "12,450", "+18% on last month", true],
          ["Orders", "28", "7 awaiting shipment", false],
          ["Live listings", "146", "3 in review", false],
          ["Open offers", "9", "2 expire today", true],
          ["Available balance", "8,250", "USDT · withdrawable", false],
        ].map(([label, num, note, accent], i) => (
          <div key={label as string} className="py-4.5" style={{ paddingLeft: i === 0 ? 0 : 18, paddingRight: 18, borderRight: i < 4 ? "1px solid var(--color-divider)" : undefined }}>
            <div className="label-micro mb-1.5">{label}</div>
            <div className="font-heading font-extrabold text-[27px]">{num}</div>
            <div className="text-[11px]" style={{ color: accent ? "var(--color-accent)" : undefined, opacity: accent ? 1 : 0.5 }}>
              {note}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-9 mt-7.5" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div>
          <div className="flex justify-between items-baseline mb-3.5">
            <h3 className="label-section !text-xs m-0">Settled sales — last 12 months</h3>
            <span className="text-xs opacity-55">USDT</span>
          </div>
          <div className="grid grid-cols-12 gap-2 items-end h-[170px] border-b-2" style={{ borderColor: "var(--color-divider)" }}>
            {MONTH_HEIGHTS.map((h, i) => (
              <span key={i} style={{ height: `${h}%`, background: i === MONTH_HEIGHTS.length - 1 ? "var(--color-accent)" : "var(--color-neutral-300)" }} />
            ))}
          </div>
          <div className="grid grid-cols-12 gap-2 text-[10px] tracking-[.06em] uppercase opacity-50 pt-1.5">
            {MONTH_LABELS.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>

          <h3 className="label-section !text-xs mt-7.5 mb-3">Needs your action</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Stone</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ACTION_ROWS.map((r) => (
                <tr key={r.order}>
                  <td>{r.order}</td>
                  <td>{r.stone}</td>
                  <td>{r.amount}</td>
                  <td>
                    <span className={`tag ${r.cls}`}>{r.tag}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="label-section !text-xs mb-3">Payouts</h3>
          <div className="border-t text-[13px]" style={{ borderColor: "var(--color-divider)" }}>
            {[
              ["Available now", "8,250.00", false],
              ["Held in escrow", "16,145.00", true],
              ["Clearing, 48 h", "2,707.50", false],
              ["Commission, 30 d", "−373.50", false],
            ].map(([label, value, accent]) => (
              <div key={label as string} className="flex justify-between py-2.5 border-b" style={{ borderColor: "var(--color-divider)" }}>
                <span className="opacity-65">{label}</span>
                <span className="font-semibold" style={{ color: accent ? "var(--color-accent)" : undefined }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <Link href="/wallet" className="btn btn-primary w-full text-left block mt-3.5">
            WITHDRAW USDT
          </Link>

          <h3 className="label-section !text-xs mt-7 mb-3">Listing health</h3>
          <div className="text-[12.5px] flex flex-col gap-2.5">
            {[
              ["With lab report", 92],
              ["Five or more photographs", 68],
              ["Video included", 41],
            ].map(([label, pct]) => (
              <div key={label as string}>
                <div className="flex justify-between mb-1.5">
                  <span>{label}</span>
                  <span className="font-semibold">{pct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="note mt-4.5">
            Response time 2h 04m. Sellers under 4h keep the <strong>Fast responder</strong> badge.
          </div>
        </div>
      </div>
    </div>
  );
}
