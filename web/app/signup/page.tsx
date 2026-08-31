import { Check } from "lucide-react";

export default function SignupPage() {
  return (
    <main className="grid flex-1" style={{ gridTemplateColumns: ".85fr 1.15fr", minHeight: 820 }}>
      <div className="flex flex-col px-8.5 py-10" style={{ background: "var(--color-text)", color: "var(--color-bg)" }}>
        <div className="font-heading font-extrabold text-[21px] tracking-[-0.02em] mb-11">
          RAVANA<span style={{ color: "var(--color-accent)" }}>GEMS</span>
        </div>
        <h1 className="text-[44px] leading-[1.02] tracking-[-0.03em] max-w-[15ch] mb-4.5">SELL TO 48,000 VERIFIED BUYERS.</h1>
        <p className="text-[14.5px] leading-relaxed opacity-75 max-w-[44ch] mb-10">Verification takes about a day. Once cleared you can list, take offers, run auctions and withdraw in USDT.</p>
        <div className="text-[13.5px]">
          {["No listing fees on any plan", "Escrow removes the payment risk for both sides", "Withdraw to your own wallet, usually within the hour", "The verified badge measurably raises what buyers will pay"].map((text, i, arr) => (
            <div key={text} className="flex gap-2.5 items-start py-3.5 border-t" style={{ borderColor: "rgba(243,242,242,.22)", borderBottom: i === arr.length - 1 ? "1px solid rgba(243,242,242,.22)" : undefined }}>
              <Check size={15} strokeWidth={3} color="var(--color-accent)" style={{ flex: "none", marginTop: 3 }} />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-9 text-xs opacity-55 leading-relaxed">Identity checks are a legal requirement for cross-border trade and custody of funds. Documents are held encrypted and are never shown to buyers.</div>
      </div>

      <div className="px-10 pt-9 pb-12">
        <div className="flex justify-between items-baseline mb-6.5">
          <div className="text-[11px] tracking-[.14em] uppercase font-semibold" style={{ color: "var(--color-accent)" }}>
            Step 2 of 4 · identity
          </div>
          <div className="text-[12.5px] opacity-60">
            Already have an account?{" "}
            <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>
              Sign in
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-7">
          {[true, true, false, false].map((filled, i) => (
            <span key={i} className="h-[5px]" style={{ background: filled ? "var(--color-accent)" : "var(--color-neutral-300)" }} />
          ))}
        </div>

        <div className="flex flex-col mb-7.5">
          {[
            { label: "Account", desc: "email, password, two-factor", status: "Complete", state: "done" },
            { label: "Identity", desc: "passport or national ID, selfie check", status: "In progress", state: "active" },
            { label: "Business", desc: "registration, gem dealer licence", status: "Sellers only", state: "pending" },
            { label: "Payout wallet", desc: "USDT address, test transfer", status: "Pending", state: "pending" },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              className="grid gap-3.5 py-3.5 border-t items-center"
              style={{
                gridTemplateColumns: "26px 1fr auto",
                borderColor: "var(--color-divider)",
                borderBottom: i === arr.length - 1 ? "1px solid var(--color-divider)" : undefined,
                background: s.state === "active" ? "color-mix(in srgb, var(--color-accent) 7%, transparent)" : undefined,
              }}
            >
              {s.state === "done" ? (
                <span className="w-4 h-4 flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
                  <Check size={10} strokeWidth={3.5} color="#f3f2f2" />
                </span>
              ) : s.state === "active" ? (
                <span className="w-4 h-4" style={{ border: "2px solid var(--color-accent)" }} />
              ) : (
                <span className="w-4 h-4" style={{ border: "1px solid var(--color-divider)" }} />
              )}
              <span className="text-[13.5px]" style={{ opacity: s.state === "pending" ? 0.7 : 1 }}>
                <strong className="font-heading">{s.label}</strong> — {s.desc}
              </span>
              <span className="text-[11.5px]" style={{ color: s.state === "active" ? "var(--color-accent)" : undefined, fontWeight: s.state === "active" ? 600 : undefined, opacity: s.state === "active" ? 1 : 0.5 }}>
                {s.status}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["Legal first name", "Anura"],
            ["Legal surname", "Fernando"],
            ["Date of birth", "14 / 06 / 1988"],
            ["Country of residence", "Sri Lanka"],
            ["Document type", "Passport"],
            ["Document number", "N4821907"],
          ].map(([label, val]) => (
            <div key={label} className="field">
              <label>{label}</label>
              <input className="input" defaultValue={val} />
            </div>
          ))}
          <div className="field" style={{ gridColumn: "1/-1" }}>
            <label>Residential address</label>
            <input className="input" defaultValue="118 Galle Road, Colombo 03, Sri Lanka" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5 mt-5">
          <div className="p-5 flex flex-col gap-1.5" style={{ border: "2px dashed var(--color-divider)" }}>
            <span className="font-heading font-extrabold text-sm">Document photograph</span>
            <span className="text-[11.5px] opacity-60">passport-page.jpg · 2.4 MB</span>
            <span className="text-[11px] tracking-wider uppercase font-semibold mt-1.5" style={{ color: "var(--color-accent)" }}>
              Uploaded
            </span>
          </div>
          <div className="p-5 flex flex-col gap-1.5" style={{ border: "2px dashed var(--color-divider)" }}>
            <span className="font-heading font-extrabold text-sm">Selfie check</span>
            <span className="text-[11.5px] opacity-60">Hold your document beside your face</span>
            <span className="text-[11px] tracking-wider uppercase opacity-55 mt-1.5">Start camera</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mt-5.5 text-[12.5px]">
          <label className="radio">
            <input type="radio" name="acct" defaultChecked /> <span className="dot" />
            I am registering as a <strong className="font-heading pl-1">seller</strong> — business step required
          </label>
          <label className="radio">
            <input type="radio" name="acct" /> <span className="dot" />
            I am registering as a <strong className="font-heading pl-1">buyer only</strong> — identity step is enough
          </label>
        </div>

        <div className="flex gap-2.5 mt-6.5 pt-5 border-t-2" style={{ borderColor: "var(--color-divider)" }}>
          <button className="btn btn-primary" style={{ padding: "15px 22px" }}>
            SUBMIT FOR VERIFICATION
          </button>
          <button className="btn btn-secondary" style={{ padding: "15px 20px" }}>
            SAVE AND FINISH LATER
          </button>
        </div>
        <div className="note mt-4 max-w-[70ch]">Most identity checks clear within a few hours. Business documents can take a full working day. You can browse and buy while verification is pending; listing and withdrawal unlock once it clears.</div>
      </div>
    </main>
  );
}
