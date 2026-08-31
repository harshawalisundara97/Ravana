import { notFound } from "next/navigation";
import { disputes } from "@/lib/data";
import { usdt } from "@/lib/format";

const DECLARED_VS_RECEIVED = [
  ["Weight", "2.66 ct", "2.41 ct", "−0.25 ct"],
  ["Dimensions", "9.1 × 7.0 × 4.8 mm", "8.8 × 6.9 × 4.6 mm", "Smaller"],
  ["Colour", "Vivid green", "Medium green", "Disputed"],
];

const TIMELINE = [
  ["22 Aug 16:12", "Buyer opened dispute, escrow frozen automatically"],
  ["22 Aug 19:40", "Seller responded with packing evidence"],
  ["24 Aug 09:05", "Both parties agreed to independent re-weighing"],
  ["27 Aug 11:22", "GRS Colombo confirmed 2.41 ct — report attached"],
];

export default async function DisputePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dispute = disputes.find((d) => d.id === id);
  if (!dispute) notFound();
  const amount = dispute.amountHeld;
  const sellerNet = +(amount * 0.95).toFixed(2);

  return (
    <div>
      <div className="flex justify-between items-end gap-5 flex-wrap mb-4.5">
        <div>
          <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-1.5" style={{ color: "var(--color-accent)" }}>
            Dispute {dispute.id.toUpperCase()} · order {dispute.orderId.toUpperCase()}
          </div>
          <h1 className="mb-1.5">Stone not as described</h1>
          <div className="text-[13px] opacity-65">Buyer vs seller · opened 22 Aug · SLA 3 days remaining</div>
        </div>
        <div className="text-right">
          <div className="label-micro mb-1">Frozen in escrow</div>
          <div className="font-heading font-extrabold text-[30px]">
            {usdt(amount)} <span className="text-xs opacity-55">USDT</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t-2 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <div className="pt-5 pr-6 pb-5.5 border-r-2" style={{ borderColor: "var(--color-divider)" }}>
          <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-2.5">Buyer claim</div>
          <p className="text-[13.5px] leading-relaxed mb-3.5">{dispute.buyerClaim}</p>
          <div className="grid grid-cols-4 gap-2">
            {["/gems/gem-02.jpg", "/gems/gem-03.jpg"].map((p) => (
              <div key={p} className="aspect-square bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${p})` }} />
            ))}
            <div className="aspect-square flex items-center justify-center text-[10px] uppercase tracking-wider" style={{ background: "var(--color-neutral-200)" }}>
              Scale
            </div>
            <div className="aspect-square flex items-center justify-center text-[10px] uppercase tracking-wider text-center" style={{ background: "var(--color-neutral-200)" }}>
              Unbox video
            </div>
          </div>
        </div>
        <div className="pt-5 pl-6 pb-5.5">
          <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-2.5">Seller response</div>
          <p className="text-[13.5px] leading-relaxed mb-3.5">{dispute.sellerResponse}</p>
          <div className="grid grid-cols-4 gap-2">
            {["/gems/gem-01.jpg", "/gems/gem-04.jpg"].map((p) => (
              <div key={p} className="aspect-square bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${p})` }} />
            ))}
            <div className="aspect-square flex items-center justify-center text-[10px] uppercase tracking-wider" style={{ background: "var(--color-neutral-200)" }}>
              Lab report
            </div>
            <div className="aspect-square flex items-center justify-center text-[10px] uppercase tracking-wider" style={{ background: "var(--color-neutral-200)" }}>
              Packing
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-9 mt-6.5" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <div>
          <h3 className="label-section !text-xs mb-3">Declared against received</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Listing</th>
                <th>Buyer measurement</th>
                <th>Delta</th>
              </tr>
            </thead>
            <tbody>
              {DECLARED_VS_RECEIVED.map((row) => (
                <tr key={row[0]}>
                  <td style={{ opacity: 0.6 }}>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td style={{ color: "var(--color-accent)", fontWeight: 600 }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="label-section !text-xs mt-7 mb-3">Case timeline</h3>
          <div className="text-[13px]">
            {TIMELINE.map(([time, text], i) => (
              <div key={time} className="grid gap-3.5 py-2.5 border-t" style={{ gridTemplateColumns: "110px 1fr", borderColor: "var(--color-divider)", borderBottom: i === TIMELINE.length - 1 ? "1px solid var(--color-divider)" : undefined }}>
                <span className="opacity-55 text-[11.5px]">{time}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="label-section !text-xs mb-3">Resolution</h3>
          <div className="flex flex-col gap-2.5">
            <button className="btn btn-primary justify-between text-left" style={{ padding: "14px 18px" }}>
              REFUND THE BUYER <span>{usdt(amount)}</span>
            </button>
            <button className="btn btn-secondary justify-between text-left" style={{ padding: "13px 18px" }}>
              RELEASE TO SELLER <span>{usdt(sellerNet)}</span>
            </button>
            <button className="btn btn-secondary justify-between text-left" style={{ padding: "13px 18px" }}>
              PARTIAL — SPLIT <span>Set amount</span>
            </button>
            <button className="btn btn-secondary text-left" style={{ padding: "13px 18px" }}>
              ORDER A SECOND LAB OPINION
            </button>
          </div>
          <div className="field mt-4">
            <label>Decision note — sent to both parties</label>
            <textarea className="input" defaultValue="Independent re-weigh confirms 2.41 ct against a listed 2.66 ct. Refunding the buyer in full; seller to receive the stone back at seller's cost. No account penalty — first substantiated claim." />
          </div>
          <div className="note mt-3.5">Three substantiated claims in twelve months suspend a seller and freeze pending payouts.</div>
        </div>
      </div>
    </div>
  );
}
