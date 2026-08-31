"use client";
import { useState } from "react";
import type { Gem } from "@/lib/types";
import { getSeller } from "@/lib/data";
import { usdt } from "@/lib/format";

const COMPARISON = [
  ["Species", "Sapphire, padparadscha", "Corundum, padparadscha"],
  ["Weight", "1.86 ct", "1.86 ct"],
  ["Origin", "Sri Lanka", "Sri Lanka"],
  ["Treatment", "Unheated", "No indication of heating"],
  ["Report number", "GRS2026-041912", "Found in GRS database"],
  ["Photograph provenance", "Own studio", "No reverse-image match"],
];

export function VerificationClient({ queue }: { queue: Gem[] }) {
  const [selected, setSelected] = useState(0);
  const gem = queue[selected];
  const seller = getSeller(gem.sellerId);

  return (
    <div>
      <h1 className="mb-1.5">Verification queue</h1>
      <p className="text-[13px] opacity-60 mb-5">Every stone listed above 5,000 USDT is reviewed by a gemmologist before it can settle.</p>
      <div className="grid border-t-2" style={{ gridTemplateColumns: "300px 1fr", borderColor: "var(--color-divider)" }}>
        <div className="border-r-2" style={{ borderColor: "var(--color-divider)" }}>
          {queue.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setSelected(i)}
              className="w-full text-left block py-3 pr-4 border-b"
              style={{
                borderColor: "var(--color-divider)",
                borderBottom: i === selected ? "2px solid var(--color-accent)" : "1px solid var(--color-divider)",
                background: i === selected ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : "transparent",
              }}
            >
              <div className="font-heading font-extrabold text-sm mb-1">{g.title}</div>
              <div className="text-[11.5px] opacity-65">
                {usdt(g.price)} USDT · {getSeller(g.sellerId)?.name}
              </div>
            </button>
          ))}
          <div className="py-3.5 text-xs opacity-55">9 more in queue</div>
        </div>

        <div className="pt-5 pl-7">
          <div className="flex justify-between items-start gap-5 mb-4.5">
            <div>
              <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-1.5" style={{ color: "var(--color-accent)" }}>
                Case {gem.certNumber} · high value
              </div>
              <h2 className="mb-1.5">{gem.title}</h2>
              <div className="text-[12.5px] opacity-65">
                {seller?.name} · verified seller · {seller?.gemCount} stones cleared
              </div>
            </div>
            <span className="tag tag-outline whitespace-nowrap">AWAITING REVIEW</span>
          </div>

          <div className="grid grid-cols-5 gap-2.5 mb-5.5">
            {gem.photos.slice(0, 4).map((p, i) => (
              <div key={i} className="aspect-square bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${p})` }} />
            ))}
            <div className="aspect-square flex items-center justify-center text-[10.5px] uppercase tracking-wider" style={{ background: "var(--color-neutral-200)" }}>
              Lab report
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Seller declared</th>
                <th>Laboratory report</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row[0]}>
                  <td style={{ opacity: 0.6 }}>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td style={{ color: "var(--color-accent)", fontWeight: 600 }}>✓</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="field mt-5" style={{ maxWidth: 640 }}>
            <label>Reviewer note — visible to the seller</label>
            <textarea className="input" defaultValue="Colour call agreed with the report. Cleared for sale; no further evidence required." />
          </div>
          <div className="flex gap-2.5 mt-4 flex-wrap">
            <button className="btn btn-primary" style={{ padding: "14px 20px" }}>
              APPROVE LISTING
            </button>
            <button className="btn btn-secondary" style={{ padding: "14px 20px" }}>
              REQUEST MORE INFORMATION
            </button>
            <button className="btn btn-secondary" style={{ padding: "14px 20px" }}>
              REJECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
