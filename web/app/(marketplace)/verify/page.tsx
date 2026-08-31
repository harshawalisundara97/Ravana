import Link from "next/link";
import { Check } from "lucide-react";

export default function VerifyPage() {
  return (
    <main className="flex justify-center px-8" style={{ padding: "40px 32px 70px" }}>
      <div className="w-full" style={{ maxWidth: 820 }}>
        <div style={{ border: "2px solid var(--color-text)" }}>
          <div className="flex justify-between items-center px-6 py-4" style={{ background: "var(--color-text)", color: "var(--color-bg)" }}>
            <span className="font-heading font-extrabold text-[15px] tracking-wide">RAVANAGEMS MARKETPLACE RECORD</span>
            <span className="text-[10.5px] tracking-[.14em] uppercase">Scanned 30 Aug 2026 · 11:41 UTC</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr 220px" }}>
            <div className="px-6 py-7 border-r-2" style={{ borderColor: "var(--color-divider)" }}>
              <div className="flex items-center gap-2.5 mb-4.5">
                <Check size={22} strokeWidth={3} color="var(--color-accent)" />
                <span className="font-heading font-extrabold text-[26px] tracking-[-0.02em]" style={{ color: "var(--color-accent)" }}>
                  VERIFIED
                </span>
              </div>
              <div className="font-heading font-extrabold text-[32px] tracking-[-0.02em] mb-1">GEM-2026-SL-004582</div>
              <div className="text-[13px] opacity-65 mb-6">This identifier matches one listing, one seller and one laboratory report. Re-cutting or re-treating voids the record.</div>
              <table className="table">
                <tbody>
                  {[
                    ["Stone", "Natural Blue Sapphire"],
                    ["Weight", "2.15 ct"],
                    ["Origin", "Sri Lanka"],
                    ["Shape", "Oval mixed brilliant"],
                    ["Treatment", "Heat only"],
                    ["Laboratory", "GRS Swisslab · GRS2026-041882"],
                    ["Listed by", "Ceylon Rare Stones — verified seller"],
                    ["Record created", "14 Mar 2026"],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ opacity: 0.6, width: "38%" }}>{k}</td>
                      <td style={{ fontWeight: 600 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-7 flex flex-col gap-4 items-start">
              <div className="w-40 h-40 p-2.5 bg-white" style={{ border: "1px solid var(--color-divider)" }}>
                <div className="w-full h-full" style={{ backgroundImage: "repeating-conic-gradient(#201e1d 0% 25%, #fff 0% 50%)", backgroundSize: "12px 12px" }} />
              </div>
              <div className="label-micro">Scan to verify</div>
              <div className="text-xs leading-relaxed opacity-75">Printed on the parcel seal and on the seller&apos;s own certificate card.</div>
              <Link href="/gems/g3" className="btn btn-secondary w-full text-left">
                OPEN THE LISTING
              </Link>
            </div>
          </div>
          <div className="border-t-2 px-6 py-4.5 grid grid-cols-3 gap-5 text-xs" style={{ borderColor: "var(--color-divider)" }}>
            <div>
              <div className="font-heading font-extrabold text-[13px] mb-1.5">Ownership history</div>
              <div className="opacity-65 leading-relaxed">Mined Ratnapura 2025 · cut Colombo 2026 · listed 14 Mar 2026 · sold 30 Aug 2026</div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-[13px] mb-1.5">Report cross-check</div>
              <div className="opacity-65 leading-relaxed">Matched against the GRS database on 14 Mar 2026 and re-checked at each resale.</div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-[13px] mb-1.5">What this is not</div>
              <div className="opacity-65 leading-relaxed">A marketplace record, not a laboratory opinion. Origin and treatment are the laboratory&apos;s findings.</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <input className="input" defaultValue="GEM-2026-SL-004582" style={{ maxWidth: 280 }} />
          <button className="btn btn-primary" style={{ padding: "0 22px" }}>
            CHECK ANOTHER ID
          </button>
        </div>
      </div>
    </main>
  );
}
