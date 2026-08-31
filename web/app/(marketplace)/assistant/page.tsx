import { gems } from "@/lib/data";
import { GemGrid } from "@/components/marketplace/GemGrid";

export default function AssistantPage() {
  const comparable = gems.filter((g) => g.featured).slice(0, 4);
  return (
    <main className="grid" style={{ gridTemplateColumns: "1fr 380px" }}>
      <section className="border-r-2 px-8 pt-6.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <div className="text-[11px] tracking-[.16em] uppercase font-semibold mb-2.5" style={{ color: "var(--color-accent)" }}>
          Beta · assistive only
        </div>
        <h1 className="mb-1.5">Gem assistant</h1>
        <p className="text-sm opacity-70 max-w-[64ch] mb-6.5">Upload a photograph and the assistant describes what it can see and finds comparable listings. It cannot authenticate a stone, confirm treatment, or replace a laboratory report.</p>

        <div className="grid gap-6.5 border-t-2 pt-6" style={{ gridTemplateColumns: "260px 1fr", borderColor: "var(--color-divider)" }}>
          <div className="aspect-square bg-cover bg-center grayscale-photo" style={{ backgroundImage: "url(/gems/gem-04.jpg)" }} />
          <div>
            <div className="label-micro mb-3">What the assistant sees</div>
            <table className="table">
              <tbody>
                {[
                  ["Likely species", "Corundum — sapphire family · moderate confidence"],
                  ["Apparent colour", "Blue, medium-dark, vivid saturation"],
                  ["Cut observed", "Oval mixed brilliant, symmetrical"],
                  ["Visible features", "Window at the centre, no obvious surface reaching fractures"],
                  ["Photograph quality", "Good — daylight, neutral ground"],
                  ["Cannot determine", "Origin · treatment · natural or synthetic · true colour"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ opacity: 0.6, width: "44%" }}>{k}</td>
                    <td style={{ fontWeight: 600 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4.5 p-4 text-[12.5px] leading-relaxed" style={{ border: "2px solid var(--color-accent)" }}>
              <strong className="font-heading text-[13px]">This is not an appraisal.</strong> Species, origin and treatment can only be established by a gemmological laboratory. Never buy a high-value stone on the strength of an image analysis.
            </div>
          </div>
        </div>

        <h3 className="label-section !text-xs mt-8.5 mb-3.5">Comparable listings</h3>
        <GemGrid gems={comparable} cols={4} />
      </section>

      <aside className="px-6 pt-6.5 pb-16 flex flex-col">
        <h3 className="label-section !text-xs mb-3.5">Ask about gems</h3>
        <div className="flex-1 flex flex-col gap-3.5">
          <div className="p-3.5 text-[13px] leading-relaxed" style={{ background: "var(--color-surface)" }}>
            What does &quot;unheated&quot; actually change about the price?
          </div>
          <div className="p-3.5 text-[13px] leading-relaxed" style={{ background: "var(--color-text)", color: "var(--color-bg)" }}>
            For sapphire and ruby, an unheated stone with a good colour typically trades at a substantial premium over an identical heated stone, because untreated material is scarce. The premium only holds if a laboratory states it — a seller&apos;s word is not enough.
          </div>
          <div className="p-3.5 text-[13px] leading-relaxed" style={{ background: "var(--color-surface)" }}>
            Show me unheated Ceylon sapphires between 2 and 3 ct under 6,000 USDT.
          </div>
          <div className="p-3.5 text-[13px] leading-relaxed" style={{ background: "var(--color-text)", color: "var(--color-bg)" }}>
            Eleven listings match. Nine carry a GRS or GIA report.
            <button className="block bg-transparent border-0 p-0 pt-2 cursor-pointer font-heading font-extrabold text-[12.5px]" style={{ color: "#ff9783" }}>
              OPEN THESE RESULTS →
            </button>
          </div>
        </div>
        <div className="flex gap-2.5 mt-4">
          <input className="input flex-1" placeholder="Ask a question" />
          <button className="btn btn-primary" style={{ padding: "10px 16px" }}>
            SEND
          </button>
        </div>
        <div className="text-[11.5px] opacity-55 leading-relaxed mt-2.5">Answers are general information, not gemmological or investment advice.</div>
      </aside>
    </main>
  );
}
