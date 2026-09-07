"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldCheck } from "lucide-react";

const STEPS = ["Gem information", "Photographs & video", "Laboratory report", "Pricing & offers", "Shipping & returns", "Review & publish"];
const BLURBS = [
  "Describe the stone precisely — buyers and the gemmology review team use these exact fields.",
  "Unretouched photographs in daylight, plus an optional 360° video.",
  "Every laboratory report is cross-checked against the issuing lab's database.",
  "Set your price and decide whether to accept negotiated offers.",
  "Tell buyers where the stone ships from and your return policy.",
  "Review everything before it goes live.",
];

export function SellWizard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const completeness = 62 + step * 6;

  async function handlePublish() {
    if (!session?.user) {
      router.push("/login?callbackUrl=/sell");
      return;
    }
    setPublishing(true);
    setPublishError(null);
    const res = await fetch("/api/gems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Natural Ceylon Blue Sapphire",
        type: "Sapphire",
        carat: 2.15,
        origin: "Sri Lanka — Ratnapura",
        cut: "Oval mixed brilliant",
        colour: "Royal Blue",
        clarity: "VS — eye clean",
        dimensions: "8.20 x 6.40 x 4.50 mm",
        treatment: "Heated",
        price: 2850,
        offerFloor: 2500,
        photos: ["/gems/gem-01.jpg", "/gems/gem-02.jpg", "/gems/gem-03.jpg"],
        certLab: "GRS Swisslab",
        certNumber: "GRS2026-041882",
      }),
    });
    setPublishing(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setPublishError(body.error || "Could not publish this listing.");
      return;
    }
    router.push("/seller/gems");
    router.refresh();
  }

  return (
    <main className="grid" style={{ gridTemplateColumns: "250px 1fr 330px" }}>
      <aside className="border-r-2 px-5 pt-6.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <h2 className="label-section !text-xs mb-4.5">List a gem</h2>
        {STEPS.map((title, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <button key={title} onClick={() => setStep(n)} className="w-full text-left bg-transparent border-0 border-t py-3.5 cursor-pointer flex gap-2.5 items-baseline" style={{ borderColor: "var(--color-divider)" }}>
              <span className="font-heading font-extrabold text-[11px]" style={{ color: active || done ? "var(--color-accent)" : "var(--color-neutral-500)" }}>
                {String(n).padStart(2, "0")}
              </span>
              <span className="text-[13.5px]" style={{ fontWeight: active ? 800 : 400, opacity: active ? 1 : 0.75 }}>
                {title}
              </span>
            </button>
          );
        })}
        <div className="note mt-5.5">Listings with a laboratory report and five photographs sell 3.4× faster on RavanaGems.</div>
      </aside>

      <section className="px-8 pt-6.5 pb-16">
        <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-2.5" style={{ color: "var(--color-accent)" }}>
          Step {step} of 6
        </div>
        <h1 className="mb-1.5">{STEPS[step - 1]}</h1>
        <p className="text-[13.5px] opacity-65 max-w-[62ch] mb-6.5">{BLURBS[step - 1]}</p>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Gem type", "Blue Sapphire"],
              ["Weight (ct)", "2.15"],
              ["Origin", "Sri Lanka — Ratnapura"],
              ["Treatment", "Heat only"],
              ["Colour", "Royal Blue"],
              ["Shape / cut", "Oval mixed brilliant"],
              ["Dimensions (mm)", "8.20 x 6.40 x 4.50"],
              ["Clarity", "VS — eye clean"],
            ].map(([label, val]) => (
              <div key={label} className="field">
                <label>{label}</label>
                <input className="input" defaultValue={val} />
              </div>
            ))}
            <div className="field" style={{ gridColumn: "1/-1" }}>
              <label>Description</label>
              <textarea className="input" defaultValue="Vivid royal blue Ceylon sapphire, heated only, no diffusion or filling. Bright under both daylight and incandescent light." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="grid grid-cols-5 gap-3">
              {["Main", "Side", "Back"].map((label, i) => (
                <div key={label} className="aspect-square relative bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(/gems/gem-0${i + 1}.jpg)` }}>
                  <span className="absolute bottom-2 left-2 uppercase text-[10px] tracking-wider font-semibold px-1.5 py-0.5" style={{ background: "var(--color-bg)" }}>
                    {label}
                  </span>
                </div>
              ))}
              {["Macro", "Video"].map((label, i) => (
                <div key={label} className="aspect-square flex flex-col items-start justify-end p-2.5 gap-1" style={{ border: "2px dashed var(--color-divider)" }}>
                  <span className="font-heading font-extrabold text-[13px]">{label}</span>
                  <span className="text-[10.5px] opacity-55">{i === 0 ? "Drop image" : "360° turn, 15s"}</span>
                </div>
              ))}
            </div>
            <div className="note mt-5 max-w-[70ch]">Shoot on a neutral grey card in daylight, unretouched. Colour-corrected or saturated images are the single most common cause of disputes and can suspend a seller account.</div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="field">
              <label>Laboratory</label>
              <input className="input" defaultValue="GRS Swisslab" />
            </div>
            <div className="field">
              <label>Report number</label>
              <input className="input" defaultValue="GRS2026-041882" />
            </div>
            <div className="field" style={{ gridColumn: "1/-1" }}>
              <label>Report file</label>
              <div className="flex justify-between items-center p-5.5" style={{ border: "2px dashed var(--color-divider)" }}>
                <span className="text-[13px]">GRS2026-041882.pdf · 1.8 MB</span>
                <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-accent)" }}>
                  Uploaded
                </span>
              </div>
            </div>
            <div className="note" style={{ gridColumn: "1/-1" }}>
              RavanaGems cross-checks the report number against the laboratory&apos;s own database. Stones above 5,000 USDT are additionally reviewed by our gemmologist before going live.
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-2 gap-4 max-w-[640px]">
            <div className="field">
              <label>Asking price (USDT)</label>
              <input className="input" defaultValue="2,850" />
            </div>
            <div className="field">
              <label>Minimum offer (USDT)</label>
              <input className="input" defaultValue="2,500" />
            </div>
            <div className="field" style={{ gridColumn: "1/-1" }}>
              <label>Accept offers</label>
              <div className="seg">
                <button type="button" className="seg-opt is-active">
                  On
                </button>
                <button type="button" className="seg-opt">
                  Off
                </button>
              </div>
            </div>
            <div className="field" style={{ gridColumn: "1/-1" }}>
              <label>Featured placement — 20 USDT for 7 days</label>
              <div className="seg">
                <button type="button" className="seg-opt">
                  Yes
                </button>
                <button type="button" className="seg-opt is-active">
                  No
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-3.5 border-t-2 text-[13px]" style={{ gridColumn: "1/-1", borderColor: "var(--color-divider)" }}>
              <div className="flex justify-between">
                <span className="opacity-65">Sale price</span>
                <span className="font-semibold">2,850.00</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-65">Commission — Pro plan, 3%</span>
                <span className="font-semibold">−85.50</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t" style={{ borderColor: "var(--color-divider)" }}>
                <span className="font-heading font-extrabold">You receive</span>
                <span className="font-heading font-extrabold">2,764.50 USDT</span>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="grid grid-cols-2 gap-4 max-w-[640px]">
            {[
              ["Ships from", "Colombo, Sri Lanka"],
              ["Handling time", "1–2 business days"],
              ["Ships to", "Worldwide except sanctioned regions"],
              ["Courier", "FedEx / DHL, fully insured"],
            ].map(([label, val]) => (
              <div key={label} className="field">
                <label>{label}</label>
                <input className="input" defaultValue={val} />
              </div>
            ))}
            <div className="field" style={{ gridColumn: "1/-1" }}>
              <label>Returns</label>
              <div className="seg">
                <button type="button" className="seg-opt is-active">
                  72-hour inspection, buyer pays return
                </button>
                <button type="button" className="seg-opt">
                  No returns
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="max-w-[640px]">
            <div className="p-5 mb-4.5" style={{ border: "2px solid var(--color-accent)" }}>
              <div className="font-heading font-extrabold text-[19px] mb-2">Ready to publish</div>
              <div className="text-[13px] leading-relaxed opacity-80">Nine fields complete, four photographs, one laboratory report. The listing goes live immediately and enters gemmologist review in parallel — a review flag will not remove it unless a discrepancy is found.</div>
            </div>
            <table className="table">
              <tbody>
                <tr>
                  <td style={{ opacity: 0.6, width: "40%" }}>Listing</td>
                  <td style={{ fontWeight: 600 }}>Natural Ceylon Blue Sapphire, 2.15 ct</td>
                </tr>
                <tr>
                  <td style={{ opacity: 0.6 }}>Price</td>
                  <td style={{ fontWeight: 600 }}>2,850 USDT · offers from 2,500</td>
                </tr>
                <tr>
                  <td style={{ opacity: 0.6 }}>Certificate</td>
                  <td style={{ fontWeight: 600 }}>GRS2026-041882</td>
                </tr>
                <tr>
                  <td style={{ opacity: 0.6 }}>Marketplace ID</td>
                  <td style={{ fontWeight: 600 }}>GEM-2026-SL-004582</td>
                </tr>
              </tbody>
            </table>
            {publishError && (
              <div className="text-xs mb-3" style={{ color: "var(--color-accent)" }}>
                {publishError}
              </div>
            )}
            <button className="btn btn-primary mt-2 inline-flex" onClick={handlePublish} disabled={publishing}>
              {publishing ? "PUBLISHING..." : "PUBLISH GEM"}
            </button>
          </div>
        )}

        <div className="flex gap-2.5 mt-7.5 pt-5 border-t-2" style={{ borderColor: "var(--color-divider)" }}>
          <button className="btn btn-secondary" style={{ padding: "13px 20px" }} disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
            BACK
          </button>
          <button className="btn btn-primary" style={{ padding: "13px 22px" }} disabled={step === 6} onClick={() => setStep((s) => Math.min(6, s + 1))}>
            CONTINUE
          </button>
          <button className="btn-ghost text-[13.5px] font-extrabold" style={{ fontFamily: "var(--font-heading)", padding: "13px 8px" }}>
            SAVE DRAFT
          </button>
        </div>
      </section>

      <aside className="border-l-2 px-6 pt-6.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <h3 className="label-section !text-xs mb-3.5">Buyer preview</h3>
        <div style={{ border: "1px solid var(--color-divider)" }}>
          <div className="aspect-square bg-cover bg-center grayscale-photo" style={{ backgroundImage: "url(/gems/gem-01.jpg)" }} />
          <div className="p-3.5">
            <div className="font-heading font-extrabold text-base leading-tight mb-1.5">Natural Ceylon Blue Sapphire</div>
            <div className="text-xs opacity-60 mb-2">2.15 ct · Sri Lanka · Oval</div>
            <div className="font-heading font-extrabold text-xl">
              2,850 <span className="text-[11px] tracking-wider opacity-55">USDT</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px] opacity-70 mt-2">
              <ShieldCheck size={12} strokeWidth={2.4} color="var(--color-accent)" /> Ceylon Rare Stones · ★ 4.9
            </div>
          </div>
        </div>
        <div className="mt-5 text-xs leading-relaxed opacity-70">
          Completeness <strong className="font-heading">{completeness}%</strong> — add a macro photograph and a 360° video to reach 100%.
        </div>
        <div className="progress-track mt-2">
          <div className="progress-fill" style={{ width: `${completeness}%` }} />
        </div>
      </aside>
    </main>
  );
}
