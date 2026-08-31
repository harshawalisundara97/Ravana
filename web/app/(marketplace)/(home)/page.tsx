import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { gems } from "@/lib/data";
import { usdt } from "@/lib/format";
import { HeroCarousel } from "@/components/marketplace/HeroCarousel";
import { GemGrid } from "@/components/marketplace/GemGrid";
import { getSeller } from "@/lib/data";

const CATEGORIES = ["Sapphire", "Ruby", "Emerald", "Spinel", "Garnet", "Tourmaline", "Aquamarine", "Topaz", "Alexandrite", "Chrysoberyl", "Zircon"];

export default function HomePage() {
  const heroSlides = gems.slice(0, 3);
  const trending = gems.filter((g) => g.featured).slice(0, 4);
  const liveAuction = gems.find((g) => g.auction);
  const auctionSeller = liveAuction ? getSeller(liveAuction.sellerId) : undefined;

  return (
    <main>
      <section className="grid md:grid-cols-[1.05fr_.95fr] border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <div className="flex flex-col justify-center px-8 py-16 border-r-2" style={{ borderColor: "var(--color-divider)" }}>
          <div className="text-[11px] tracking-[.16em] uppercase font-semibold mb-5" style={{ color: "var(--color-accent)" }}>
            Colombo · Bangkok · Antananarivo · Bogotá
          </div>
          <h1 className="max-w-[11ch]">THE WORLD&apos;S GEMS, AT YOUR FINGERTIPS.</h1>
          <p className="text-[17px] max-w-[46ch] opacity-80 mb-8">
            Buy and sell verified gemstones from trusted sellers around the world. Every trade settles in USDT and is held in marketplace escrow until the stone is in your hands.
          </p>
          <div className="flex gap-3">
            <Link href="/explore" className="btn btn-primary" style={{ padding: "15px 22px" }}>
              EXPLORE GEMS <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link href="/sell" className="btn btn-secondary" style={{ padding: "15px 22px" }}>
              SELL YOUR GEM
            </Link>
          </div>
        </div>
        <HeroCarousel slides={heroSlides} />
      </section>

      <section className="grid grid-cols-4 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        {[
          ["41,208", "Gems listed"],
          ["3,182", "Verified sellers"],
          ["12.4M", "USDT settled"],
          ["98.7%", "Positive feedback"],
        ].map(([num, label], i) => (
          <div key={label} className="px-8 py-5" style={{ borderRight: i < 3 ? "1px solid var(--color-divider)" : undefined }}>
            <div className="font-heading font-extrabold text-[30px] tracking-tight" style={{ color: label === "Positive feedback" ? "var(--color-accent)" : undefined }}>
              {num}
            </div>
            <div className="text-[11px] tracking-[.12em] uppercase opacity-60 mt-1">{label}</div>
          </div>
        ))}
      </section>

      <section className="border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <div className="flex items-baseline gap-3.5 px-8 pt-5 pb-3.5">
          <h2 className="label-section !text-[13px] m-0">Browse by species</h2>
          <span className="text-xs opacity-50">{CATEGORIES.length} categories</span>
        </div>
        <div className="grid grid-cols-6 border-t" style={{ borderColor: "var(--color-divider)" }}>
          {CATEGORIES.map((cat, i) => {
            const count = gems.filter((g) => g.type === cat).length;
            const photo = gems.find((g) => g.type === cat)?.photos[0] ?? "/gems/gem-01.jpg";
            return (
              <Link
                key={cat}
                href={`/explore?type=${cat}`}
                className="flex flex-col gap-2.5 p-4 no-underline"
                style={{ color: "var(--color-text)", borderRight: "1px solid var(--color-divider)", borderBottom: "1px solid var(--color-divider)" }}
              >
                <span className="block h-[54px] bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${photo})` }} />
                <span className="font-heading font-extrabold text-sm">{cat}</span>
                <span className="text-[11px] opacity-55">{count} listings</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <div className="flex items-baseline justify-between px-8 pt-6 pb-4">
          <h2 className="m-0">Trending this week</h2>
          <Link href="/explore" className="btn-ghost text-[13px] font-extrabold no-underline" style={{ fontFamily: "var(--font-heading)" }}>
            VIEW ALL 41,208 →
          </Link>
        </div>
        <GemGrid gems={trending} cols={4} />
      </section>

      {liveAuction && (
        <section className="grid grid-cols-2 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
          <div className="p-8 border-r-2" style={{ borderColor: "var(--color-divider)" }}>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="pulse-dot" />
              <span className="text-[11px] tracking-[.16em] uppercase font-semibold" style={{ color: "var(--color-accent)" }}>
                Live auction
              </span>
            </div>
            <h3 className="mb-1.5">{liveAuction.title}</h3>
            <p className="text-[13px] opacity-65 mb-5">
              {liveAuction.treatment} · {liveAuction.colour} · {liveAuction.certLab} report · Ships from {liveAuction.origin}
            </p>
            <div className="grid grid-cols-3 border-t border-b" style={{ borderColor: "var(--color-divider)" }}>
              <div className="py-3.5">
                <div className="label-micro mb-1">Current bid</div>
                <div className="font-heading font-extrabold text-[25px]">{usdt(liveAuction.auction!.currentBid)}</div>
              </div>
              <div className="py-3.5">
                <div className="label-micro mb-1">Ends in</div>
                <div className="font-heading font-extrabold text-[25px]" style={{ color: "var(--color-accent)" }}>
                  02:14:32
                </div>
              </div>
              <div className="py-3.5">
                <div className="label-micro mb-1">Bidders</div>
                <div className="font-heading font-extrabold text-[25px]">{liveAuction.auction!.bidders}</div>
              </div>
            </div>
            <div className="flex gap-2.5 mt-5">
              <Link href={`/auctions/${liveAuction.id}`} className="btn btn-primary" style={{ padding: "13px 20px" }}>
                PLACE BID
              </Link>
              <Link href="/explore?auction=1" className="btn btn-secondary" style={{ padding: "13px 20px" }}>
                ALL 38 LOTS
              </Link>
            </div>
          </div>
          <div className="bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${liveAuction.photos[1]})`, minHeight: 340 }} />
        </section>
      )}

      <section className="px-8 py-9 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <h2 className="label-section !text-[13px] mb-1">How a RavanaGems trade works</h2>
        <p className="text-[13px] opacity-60 max-w-[60ch] mb-6">Funds never move directly from buyer to seller. The marketplace holds the USDT until the stone is received and confirmed.</p>
        <div className="grid grid-cols-5 border-t-2" style={{ borderColor: "var(--color-divider)" }}>
          {[
            ["01", "Buyer pays USDT", "TRC20 transfer to a single-use marketplace address."],
            ["02", "Escrow holds funds", "Seller sees “funded” and is cleared to ship."],
            ["03", "Stone ships insured", "Tracked, declared, with the lab report enclosed."],
            ["04", "72-hour inspection", "Re-weigh, re-measure, or send to your own lab."],
            ["05", "Seller is paid", "Balance released, withdrawable to any wallet."],
          ].map(([n, title, body], i) => (
            <div key={n} className="p-[18px]" style={{ borderRight: i < 4 ? "1px solid var(--color-divider)" : undefined }}>
              <div className="font-heading font-extrabold text-[13px] mb-2" style={{ color: "var(--color-accent)" }}>
                {n}
              </div>
              <div className="font-heading font-extrabold text-[15px] mb-1.5">{title}</div>
              <div className="text-xs opacity-65 leading-relaxed">{body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-14 flex items-end justify-between gap-10 flex-wrap" style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}>
        <h2 className="max-w-[16ch] text-[56px] leading-[.98] m-0">EVERY STONE VERIFIED, PHOTOGRAPHED, ESCROWED.</h2>
        <Link href="/sell" className="btn whitespace-nowrap" style={{ background: "var(--color-bg)", color: "var(--color-text)", padding: "16px 24px" }}>
          LIST YOUR FIRST GEM
        </Link>
      </section>
    </main>
  );
}
