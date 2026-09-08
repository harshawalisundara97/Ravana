"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight } from "lucide-react";
import type { Gem, Seller } from "@/lib/types";
import { usdt } from "@/lib/format";
import { useCart } from "@/lib/cart";

export function GemDetailClient({ gem, seller }: { gem: Gem; seller: Seller }) {
  const router = useRouter();
  const { add, gemIds } = useCart();
  const inCart = gemIds.includes(gem.id);
  const soldOut = gem.status !== "live";
  const [offerOpen, setOfferOpen] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [offerAmount, setOfferAmount] = useState(gem.offerFloor);

  return (
    <>
      <div className="px-8 py-3.5 border-b text-xs opacity-60" style={{ borderColor: "var(--color-divider)" }}>
        <Link href="/explore" className="no-underline" style={{ color: "inherit" }}>
          Explore
        </Link>{" "}
        / {gem.type} /<span className="opacity-90"> {gem.title}</span>
      </div>

      <section className="grid md:grid-cols-[1.15fr_.85fr] border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <div className="border-r-2 px-8 pt-6 pb-8" style={{ borderColor: "var(--color-divider)" }}>
          <div className="relative aspect-[4/3] bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${gem.photos[activeThumb]})` }}>
            <span className="absolute top-3.5 left-3.5 uppercase text-[10px] tracking-wider font-semibold px-[9px] py-1" style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}>
              {gem.certLab} certified
            </span>
            <span className="absolute bottom-3.5 right-3.5 uppercase text-[10.5px] tracking-wider font-semibold px-[9px] py-1" style={{ background: "var(--color-bg)" }}>
              Daylight · 5500K · unretouched
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2 mt-2">
            {gem.photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className="aspect-square bg-cover bg-center grayscale-photo p-0 border-0 cursor-pointer"
                style={{ backgroundImage: `url(${p})`, outline: activeThumb === i ? "2px solid var(--color-accent)" : "none", outlineOffset: -2 }}
              />
            ))}
            <div className="aspect-square flex items-center justify-center text-[10px] uppercase tracking-wider" style={{ background: "var(--color-neutral-300)" }}>
              Video
            </div>
            <div className="aspect-square flex items-center justify-center text-[10px] uppercase tracking-wider" style={{ background: "var(--color-neutral-200)" }}>
              Cert
            </div>
          </div>

          <h3 className="label-section !text-[13px] mt-8.5 mb-3">Gem information</h3>
          <table className="table">
            <tbody>
              {[
                ["Gemstone", `${gem.type} (Corundum family)`],
                ["Weight", `${gem.carat} ct`],
                ["Origin", gem.origin],
                ["Treatment", gem.treatment],
                ["Colour", gem.colour],
                ["Shape / cut", gem.cut],
                ["Dimensions", gem.dimensions],
                ["Clarity", gem.clarity],
                ["Marketplace ID", gem.marketplaceId],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ width: "40%", opacity: 0.6 }}>{k}</td>
                  <td style={{ fontWeight: 600 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 pt-6 pb-8 flex flex-col gap-4.5">
          <div>
            <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-2.5" style={{ color: "var(--color-accent)" }}>
              Lot {gem.marketplaceId.split("-").pop()} · 1 of 1
            </div>
            <h1 className="text-[38px] leading-[1.02] tracking-[-0.025em] mb-2.5">{gem.title}</h1>
            <div className="text-sm opacity-70">
              {gem.carat} ct · {gem.treatment} · ★ {seller.rating} ({seller.reviewCount} seller reviews)
            </div>
          </div>

          <div className="border-t-2 border-b-2 py-4.5 flex items-end gap-3.5" style={{ borderColor: "var(--color-divider)" }}>
            <span className="font-heading font-extrabold text-[44px] tracking-[-0.03em] leading-none">{usdt(gem.price)}</span>
            <span className="text-[13px] tracking-[.12em] opacity-60 pb-2">USDT</span>
            <span className="ml-auto text-xs opacity-60 text-right pb-1.5">
              ≈ {usdt(gem.pricePerCarat)} USDT / ct
              <br />
              Offers accepted above {usdt(gem.offerFloor)}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              className="btn btn-primary justify-between text-left"
              style={{ padding: "16px 20px" }}
              disabled={soldOut}
              onClick={() => {
                add(gem.id);
                router.push("/cart");
              }}
            >
              {soldOut ? "NO LONGER AVAILABLE" : "BUY NOW"} {!soldOut && <span>{usdt(gem.price)} USDT</span>}
            </button>
            <button onClick={() => setOfferOpen((v) => !v)} className="btn btn-secondary text-left" style={{ padding: "15px 20px" }} disabled={soldOut}>
              MAKE AN OFFER
            </button>
            <button
              className="btn btn-secondary text-left"
              style={{ padding: "15px 20px" }}
              disabled={soldOut || inCart}
              onClick={() => add(gem.id)}
            >
              {inCart ? "IN YOUR CART" : "ADD TO CART"}
            </button>
          </div>

          {offerOpen && (
            <div className="p-4" style={{ border: "2px solid var(--color-accent)" }}>
              <div className="text-[11px] tracking-[.14em] uppercase font-semibold mb-3" style={{ color: "var(--color-accent)" }}>
                Negotiation
              </div>
              <div className="flex flex-col gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="opacity-60">Marketplace floor</span>
                  <span className="font-semibold">{usdt(gem.offerFloor)} USDT</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3.5">
                <input className="input" style={{ maxWidth: 120 }} value={offerAmount} onChange={(e) => setOfferAmount(Number(e.target.value) || 0)} />
                <button className="btn btn-primary" style={{ padding: "8px 16px" }}>
                  SEND OFFER
                </button>
                <button className="btn btn-secondary" style={{ padding: "8px 14px" }} onClick={() => setOfferOpen(false)}>
                  CLOSE
                </button>
              </div>
              <div className="text-[11px] opacity-55 mt-2.5">Offers expire in 48h. Accepted offers move straight to escrow funding.</div>
            </div>
          )}

          <div className="p-4" style={{ border: "1px solid var(--color-divider)" }}>
            <div className="flex gap-3 items-center">
              <div className="w-[46px] h-[46px] flex-none bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${seller.avatar})` }} />
              <div className="flex-1">
                <Link href={`/sellers/${seller.id}`} className="font-heading font-extrabold text-base no-underline" style={{ color: "var(--color-text)" }}>
                  {seller.name}
                </Link>
                <div className="text-[11.5px] opacity-60">
                  {gem.origin.split(",")[0]} · {seller.gemCount} listings · {seller.rating}/5
                </div>
              </div>
              {seller.verified && (
                <span className="tag tag-accent" style={{ fontWeight: 600 }}>
                  VERIFIED
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5 mt-3.5 text-xs">
              {seller.verificationRecords.slice(0, 3).map((r) => (
                <span key={r.label} className="flex gap-1.5 items-center">
                  <ShieldCheck size={13} strokeWidth={3} color="var(--color-accent)" /> {r.label}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 flex gap-3.5 items-start" style={{ border: "1px solid var(--color-divider)" }}>
            <div className="w-[84px] h-[84px] flex-none p-2 bg-white" style={{ border: "1px solid var(--color-divider)" }}>
              <div className="w-full h-full" style={{ backgroundImage: "repeating-conic-gradient(#201e1d 0% 25%, #fff 0% 50%)", backgroundSize: "11px 11px" }} />
            </div>
            <div className="flex-1">
              <div className="font-heading font-extrabold text-[15px] mb-1">Certificate {gem.certLab.replace(/\s/g, "")}-{gem.certNumber}</div>
              <div className="text-xs opacity-65 mb-2.5">
                Issued by {gem.certLab}. Scan or open to check the report against the marketplace record.
              </div>
              <Link href="/verify" className="btn-ghost text-[13px] font-extrabold no-underline inline-flex items-center gap-1" style={{ fontFamily: "var(--font-heading)" }}>
                VERIFY THIS STONE <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="note">
            <strong className="font-heading text-[13px]">Buyer protection.</strong> Your {usdt(gem.price)} USDT is held by RavanaGems escrow until you confirm receipt. 72-hour inspection window. Full refund if the stone differs from the stated weight, treatment or origin.
          </div>
        </div>
      </section>
    </>
  );
}
