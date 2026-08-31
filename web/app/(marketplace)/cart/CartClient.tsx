"use client";
import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Gem } from "@/lib/types";
import { usdt } from "@/lib/format";
import { Seg } from "@/components/ui/Seg";

type PayState = "review" | "pending" | "done";
type Network = "TRC20" | "ERC20" | "BEP20";

export function CartClient({ initialGems }: { initialGems: Gem[] }) {
  const [lines, setLines] = useState(initialGems);
  const [pay, setPay] = useState<PayState>("review");
  const [network, setNetwork] = useState<Network>("TRC20");

  const subtotal = lines.reduce((s, g) => s + g.price, 0);
  const shipping = lines.length ? 45 : 0;
  const escrowFee = +(subtotal * 0.0031).toFixed(2);
  const total = +(subtotal + shipping + escrowFee).toFixed(2);
  const sellerCount = new Set(lines.map((g) => g.sellerId)).size;

  return (
    <main className="grid" style={{ gridTemplateColumns: "1fr 420px" }}>
      <section className="border-r-2 px-8 pt-6.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <h1 className="mb-1">Cart</h1>
        <p className="text-[13px] opacity-60 mb-5.5">
          {lines.length} {lines.length === 1 ? "stone" : "stones"} from {sellerCount} {sellerCount === 1 ? "seller" : "sellers"}. Each seller&apos;s parcel ships and settles separately.
        </p>

        <div className="border-t-2" style={{ borderColor: "var(--color-divider)" }}>
          {lines.map((g) => (
            <div key={g.id} className="grid gap-4.5 py-4.5 border-b items-center" style={{ gridTemplateColumns: "88px 1fr auto", borderColor: "var(--color-divider)" }}>
              <div className="w-[88px] h-[88px] bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${g.photos[0]})` }} />
              <div>
                <div className="font-heading font-extrabold text-base mb-1">{g.title}</div>
                <div className="text-xs opacity-60 mb-2">
                  {g.carat} ct · {g.origin} · {g.treatment}
                </div>
                <div className="flex gap-3.5 text-[11.5px]">
                  <button className="bg-transparent border-0 p-0 cursor-pointer" style={{ color: "var(--color-accent)" }} onClick={() => setLines((prev) => prev.filter((x) => x.id !== g.id))}>
                    Remove
                  </button>
                  <button className="bg-transparent border-0 p-0 cursor-pointer" style={{ color: "var(--color-accent)" }}>
                    Save for later
                  </button>
                </div>
              </div>
              <div className="text-right">
                <span className="font-heading font-extrabold text-xl">{usdt(g.price)}</span>
                <div className="text-[10.5px] tracking-[.12em] opacity-55">USDT</div>
              </div>
            </div>
          ))}
          {lines.length === 0 && <div className="py-10 text-center opacity-60">Your cart is empty. <Link href="/explore">Browse gems</Link></div>}
        </div>

        <h3 className="label-section !text-xs mt-8 mb-3">Shipping</h3>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="field">
            <label>Recipient</label>
            <input className="input" defaultValue="A. Fernando" />
          </div>
          <div className="field">
            <label>Destination</label>
            <input className="input" defaultValue="New York, United States" />
          </div>
          <div className="field">
            <label>Carrier</label>
            <input className="input" defaultValue="FedEx Priority — insured to 25,000 USDT" />
          </div>
          <div className="field">
            <label>Declared value</label>
            <input className="input" readOnly value={`${usdt(subtotal)} USDT`} />
          </div>
        </div>
        <div className="flex gap-3 mt-4 text-[13px]">
          <label className="radio">
            <input type="radio" name="ship" defaultChecked /> <span className="dot" />
            Insured courier — 45 USDT
          </label>
          <label className="radio">
            <input type="radio" name="ship" /> <span className="dot" />
            Hand delivery at Colombo office — free
          </label>
        </div>
      </section>

      <aside className="px-7 pt-6.5 pb-16 relative">
        <h2 className="label-section !text-xs mb-4">Order summary</h2>
        <div className="text-[13.5px] flex flex-col gap-2.5 border-t pt-3.5" style={{ borderColor: "var(--color-divider)" }}>
          <div className="flex justify-between">
            <span className="opacity-65">Subtotal</span>
            <span className="font-semibold">{usdt(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-65">Insured shipping</span>
            <span className="font-semibold">{usdt(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-65">Escrow &amp; network fee</span>
            <span className="font-semibold">{usdt(escrowFee)}</span>
          </div>
          <div className="flex justify-between opacity-65">
            <span>Buyer protection</span>
            <span>Included</span>
          </div>
        </div>
        <div className="flex justify-between items-end border-t-2 border-b-2 py-4 my-4" style={{ borderColor: "var(--color-divider)" }}>
          <span className="text-xs tracking-[.12em] uppercase opacity-65">Total</span>
          <span>
            <span className="font-heading font-extrabold text-[34px] tracking-[-0.02em]">{usdt(total)}</span> <span className="text-xs tracking-[.12em] opacity-60">USDT</span>
          </span>
        </div>

        <div className="label-micro mb-2.5">Network</div>
        <div className="w-full mb-5">
          <Seg
            value={network}
            onChange={setNetwork}
            options={[
              { label: "TRC20", value: "TRC20" as Network },
              { label: "ERC20", value: "ERC20" as Network },
              { label: "BEP20", value: "BEP20" as Network },
            ]}
          />
        </div>

        {pay === "review" && (
          <div>
            <button className="btn btn-primary w-full justify-between text-left" style={{ padding: "16px 20px" }} disabled={lines.length === 0} onClick={() => setPay("pending")}>
              PAY WITH USDT <span>→</span>
            </button>
            <div className="text-[11.5px] opacity-60 leading-relaxed mt-3">Funds go to RavanaGems escrow, not to the sellers. Released only after you confirm each parcel.</div>
          </div>
        )}

        {pay === "pending" && (
          <div className="p-4.5" style={{ border: "2px solid var(--color-accent)" }}>
            <div className="flex justify-between items-baseline mb-3.5">
              <span className="text-[11px] tracking-[.14em] uppercase font-semibold" style={{ color: "var(--color-accent)" }}>
                Awaiting transfer
              </span>
              <span className="font-heading font-extrabold text-[15px]">14:32</span>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-[112px] h-[112px] flex-none p-2 bg-white" style={{ border: "1px solid var(--color-divider)" }}>
                <div className="w-full h-full" style={{ backgroundImage: "repeating-conic-gradient(#201e1d 0% 25%, #fff 0% 50%)", backgroundSize: "9px 9px" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="label-micro mb-1">Send exactly</div>
                <div className="font-heading font-extrabold text-[22px] mb-2.5">{usdt(total)} USDT</div>
                <div className="label-micro mb-1">{network} address</div>
                <div className="text-xs break-all leading-relaxed p-2" style={{ background: "var(--color-surface)" }}>
                  TXk9mQ4pV2sB7hL1nR6yD3wZ8cF5aJ0eUt
                </div>
              </div>
            </div>
            <div className="text-[11.5px] opacity-60 leading-relaxed my-3.5">Single-use address for this order. Sending on another network will lose the funds.</div>
            <button className="btn btn-primary w-full text-left" style={{ padding: "14px 18px" }} onClick={() => setPay("done")}>
              I&apos;VE SENT THE PAYMENT
            </button>
          </div>
        )}

        {pay === "done" && (
          <div className="p-4.5" style={{ border: "2px solid var(--color-accent)" }}>
            <div className="flex gap-2 items-center mb-3">
              <Check size={18} strokeWidth={3} color="var(--color-accent)" />
              <span className="font-heading font-extrabold text-[17px]">Payment detected</span>
            </div>
            <div className="text-[12.5px] leading-relaxed opacity-80 mb-3.5">19 of 19 confirmations. {usdt(total)} USDT is held in escrow. All sellers have been cleared to ship.</div>
            <div className="text-[11px] break-all p-2 mb-3.5" style={{ background: "var(--color-surface)" }}>
              Tx 0x9f2a…c41b · {network} · 30 Aug 2026 11:04 UTC
            </div>
            <Link href="/escrow/o1" className="btn btn-primary w-full text-left block">
              TRACK THIS ORDER
            </Link>
            <button className="btn btn-secondary w-full text-left mt-2" onClick={() => setPay("review")}>
              RESET DEMO
            </button>
          </div>
        )}
      </aside>
    </main>
  );
}
