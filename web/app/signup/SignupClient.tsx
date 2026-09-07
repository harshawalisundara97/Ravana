"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";

type KycStatus = "unstarted" | "in_progress" | "cleared" | "rejected";

const STEP_LABELS: { label: string; desc: string }[] = [
  { label: "Account", desc: "email, password, two-factor" },
  { label: "Identity", desc: "passport or national ID, selfie check" },
  { label: "Business", desc: "registration, gem dealer licence" },
  { label: "Payout wallet", desc: "USDT address, test transfer" },
];

export function SignupClient() {
  const { data: session } = useSession();
  const [kycStatus, setKycStatus] = useState<KycStatus>("unstarted");
  const [isMock, setIsMock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  async function refreshStatus() {
    const res = await fetch("/api/kyc/status");
    if (res.ok) {
      const body = await res.json();
      setKycStatus(body.kycStatus);
      setIsMock(body.isMock);
    }
  }

  useEffect(() => {
    refreshStatus();
  }, []);

  async function startVerification() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/kyc/session", { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not start verification.");
      return;
    }
    setSessionStarted(true);
    await refreshStatus();
  }

  async function simulate(outcome: "cleared" | "rejected") {
    setLoading(true);
    await fetch("/api/kyc/dev-simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome }),
    });
    setLoading(false);
    await refreshStatus();
  }

  const identityState = kycStatus === "cleared" ? "done" : kycStatus === "in_progress" || kycStatus === "rejected" ? "active" : "pending";
  const steps = STEP_LABELS.map((s, i) => {
    if (i === 0) return { ...s, status: "Complete", state: "done" as const };
    if (i === 1) {
      const status = kycStatus === "cleared" ? "Complete" : kycStatus === "rejected" ? "Rejected — retry" : kycStatus === "in_progress" ? "In progress" : "Not started";
      return { ...s, status, state: identityState };
    }
    return { ...s, status: "Pending", state: "pending" as const };
  });

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
          <div className="text-[12.5px] opacity-60">Signed in as {session?.user?.email}</div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-7">
          {[true, identityState !== "pending", false, false].map((filled, i) => (
            <span key={i} className="h-[5px]" style={{ background: filled ? "var(--color-accent)" : "var(--color-neutral-300)" }} />
          ))}
        </div>

        <div className="flex flex-col mb-7.5">
          {steps.map((s, i, arr) => (
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

        {kycStatus === "cleared" ? (
          <div className="note">Your identity is verified. You can list gems and withdraw once your payout wallet is added.</div>
        ) : (
          <>
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
                  <input className="input" defaultValue={val} disabled={sessionStarted} />
                </div>
              ))}
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <label>Residential address</label>
                <input className="input" defaultValue="118 Galle Road, Colombo 03, Sri Lanka" disabled={sessionStarted} />
              </div>
            </div>

            {!sessionStarted ? (
              <div className="flex gap-2.5 mt-6.5 pt-5 border-t-2" style={{ borderColor: "var(--color-divider)" }}>
                <button className="btn btn-primary" style={{ padding: "15px 22px" }} onClick={startVerification} disabled={loading}>
                  {loading ? "STARTING..." : "SUBMIT FOR VERIFICATION"}
                </button>
              </div>
            ) : (
              <div className="mt-6.5 pt-5 border-t-2" style={{ borderColor: "var(--color-divider)" }}>
                <div className="note mb-4">
                  {isMock
                    ? "This project has no Sumsub account configured yet, so verification is simulated here instead of opening the real vendor widget."
                    : "Your verification session has started — check your email for next steps from Sumsub."}
                </div>
                {isMock && kycStatus === "in_progress" && (
                  <div className="flex gap-2.5">
                    <button className="btn btn-primary" style={{ padding: "13px 20px" }} onClick={() => simulate("cleared")} disabled={loading}>
                      SIMULATE: APPROVE
                    </button>
                    <button className="btn btn-secondary" style={{ padding: "13px 20px" }} onClick={() => simulate("rejected")} disabled={loading}>
                      SIMULATE: REJECT
                    </button>
                  </div>
                )}
                {kycStatus === "rejected" && (
                  <button className="btn btn-secondary" style={{ padding: "13px 20px" }} onClick={startVerification} disabled={loading}>
                    RETRY VERIFICATION
                  </button>
                )}
              </div>
            )}
            {error && (
              <div className="text-xs mt-3" style={{ color: "var(--color-accent)" }}>
                {error}
              </div>
            )}
          </>
        )}

        <div className="note mt-4 max-w-[70ch]">Most identity checks clear within a few hours. Business documents can take a full working day. You can browse and buy while verification is pending; listing and withdrawal unlock once it clears.</div>
      </div>
    </main>
  );
}
