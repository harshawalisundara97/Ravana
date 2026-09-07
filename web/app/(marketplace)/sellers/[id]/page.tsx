import { notFound } from "next/navigation";
import { getSeller, sellerGems } from "@/lib/data";
import { getSellerById, getGemsBySeller } from "@/lib/queries";
import { usdt } from "@/lib/format";
import { GemGrid } from "@/components/marketplace/GemGrid";

const REVIEWS = [
  { stars: 5, text: "Stone arrived in four days, exactly the colour in the photographs. Re-weighed at 2.15 ct on my own scale.", meta: "M. Okonjo · Lagos · 2.15 ct sapphire · Mar 2026" },
  { stars: 5, text: "Asked for extra macro shots before buying and got them the same evening. Packaging was excellent.", meta: "J. Weber · Idar-Oberstein · 1.04 ct spinel · Feb 2026" },
  { stars: 4, text: "Shipping took longer than quoted but the escrow window covered it. Stone is lovely.", meta: "A. Rahman · Dubai · 3.44 ct yellow sapphire · Jan 2026" },
];

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seller = getSeller(id) ?? (await getSellerById(id));
  if (!seller) notFound();
  const gems = (id.startsWith("s") && id.length <= 3 ? sellerGems(seller.id) : await getGemsBySeller(seller.id)).slice(0, 4);

  return (
    <main>
      <section className="grid border-b-2" style={{ gridTemplateColumns: "1fr 320px", borderColor: "var(--color-divider)" }}>
        <div className="border-r-2" style={{ borderColor: "var(--color-divider)" }}>
          <div className="h-[150px] bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${seller.cover})` }} />
          <div className="px-8 pt-5.5 pb-6.5 flex gap-5 items-start">
            <div className="w-24 h-24 flex-none bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${seller.avatar})`, marginTop: -58, outline: "4px solid var(--color-bg)" }} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="m-0">{seller.name}</h1>
                {seller.verified && (
                  <span className="tag tag-accent" style={{ fontWeight: 600 }}>
                    VERIFIED SELLER
                  </span>
                )}
              </div>
              <div className="text-[13px] opacity-70 mb-3.5">Member since 2019 · Responds in ~2h · Ships worldwide</div>
              <p className="text-[13.5px] leading-relaxed max-w-[70ch] opacity-85 m-0">{seller.bio}</p>
              <div className="flex gap-2.5 mt-4.5">
                <button className="btn btn-primary" style={{ padding: "12px 18px" }}>
                  FOLLOW SELLER
                </button>
                <button className="btn btn-secondary" style={{ padding: "12px 18px" }}>
                  MESSAGE
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 border-t-2" style={{ borderColor: "var(--color-divider)" }}>
            {[
              [seller.gemCount * 8, "Sales"],
              [seller.rating, "Rating"],
              ["98.7%", "Positive"],
              [0, "Open disputes"],
            ].map(([val, label], i) => (
              <div key={label as string} className="py-4.5" style={{ paddingLeft: i === 0 ? 32 : 18, paddingRight: 18, borderRight: i < 3 ? "1px solid var(--color-divider)" : undefined }}>
                <div className="font-heading font-extrabold text-[26px]" style={{ color: label === "Open disputes" ? "var(--color-accent)" : undefined }}>
                  {val}
                </div>
                <div className="label-micro">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 pt-5.5">
          <h3 className="label-section !text-xs mb-3.5">Verification record</h3>
          <div className="flex flex-col text-[13px]">
            {seller.verificationRecords.map((r, i) => (
              <div key={r.label} className="flex gap-2.5 items-center py-2.5 border-t" style={{ borderColor: "var(--color-divider)", borderBottom: i === seller.verificationRecords.length - 1 ? "1px solid var(--color-divider)" : undefined }}>
                <span style={{ color: "var(--color-accent)" }}>✓</span> {r.label}
              </div>
            ))}
          </div>
          <div className="note mt-4.5">Verification is re-run every 12 months. A lapsed check suspends listings until renewed.</div>
        </div>
      </section>

      <section>
        <div className="flex gap-5.5 px-8 py-4.5 border-b-2 text-[13.5px] font-heading font-extrabold" style={{ borderColor: "var(--color-divider)" }}>
          <span style={{ color: "var(--color-accent)", borderBottom: "2px solid var(--color-accent)", paddingBottom: 4 }}>ALL GEMS {seller.gemCount}</span>
          <span className="opacity-60">REVIEWS {seller.reviewCount}</span>
          <span className="opacity-60">ABOUT</span>
        </div>
        <GemGrid gems={gems} cols={4} />
        <div className="grid grid-cols-3 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
          {REVIEWS.map((r, i) => (
            <div key={i} className="px-8 pt-5.5 pb-6" style={{ borderRight: i < 2 ? "1px solid var(--color-divider)" : undefined }}>
              <div className="text-sm mb-2" style={{ color: "var(--color-accent)" }}>
                {"★".repeat(r.stars)}
                {"☆".repeat(5 - r.stars)}
              </div>
              <p className="text-[13.5px] leading-relaxed mb-2.5">{r.text}</p>
              <div className="text-[11.5px] opacity-55">{r.meta}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
