import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <section className="px-8 border-b-2" style={{ padding: "44px 32px 30px", borderColor: "var(--color-divider)" }}>
        <div className="text-[11px] tracking-[.16em] uppercase font-semibold mb-3.5" style={{ color: "var(--color-accent)" }}>
          About us
        </div>
        <h1 className="text-[54px] leading-none tracking-[-0.03em] max-w-[18ch] mb-3.5">A MARKETPLACE BUILT ON PROOF, NOT PROMISES.</h1>
        <p className="text-base opacity-75 max-w-[62ch] m-0">
          RavanaGems connects buyers and sellers of laboratory-certified gemstones across Sri Lanka, Southeast Asia, East Africa and South America — settling every trade in USDT, held in marketplace escrow until the stone is confirmed received.
        </p>
      </section>

      <section className="grid grid-cols-3 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        {[
          ["Why we exist", "Gem trading has run on personal trust and wire transfers for centuries. That works until it doesn't — a stone arrives different from the listing, or a payment leaves with no recourse. Escrow and laboratory cross-checks close that gap without slowing the trade down."],
          ["How we work", "Every stone above 5,000 USDT is reviewed by a gemmologist against its laboratory report before it can settle. Funds move to marketplace escrow, not to the seller, and release only once the buyer confirms receipt inside a 72-hour inspection window."],
          ["Where we operate", "The team is based in Colombo, with verification partners in Bangkok, Antananarivo and Bogotá — the same gem belts our sellers source from. Custody, KYC and cross-border trade carry real regulatory duties in every jurisdiction we operate in."],
        ].map(([title, body], i) => (
          <div key={title} className="px-8 pt-7 pb-8" style={{ borderRight: i < 2 ? "1px solid var(--color-divider)" : undefined }}>
            <h3 className="mb-2.5">{title}</h3>
            <p className="text-[13.5px] leading-relaxed opacity-80 m-0">{body}</p>
          </div>
        ))}
      </section>

      <section className="px-8 py-9 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        <h3 className="label-section !text-xs mb-3.5">By the numbers</h3>
        <div className="grid grid-cols-4 border-t-2" style={{ borderColor: "var(--color-divider)" }}>
          {[
            ["41,208", "Gems listed"],
            ["3,182", "Verified sellers"],
            ["12.4M", "USDT settled"],
            ["98.7%", "Positive feedback"],
          ].map(([num, label], i) => (
            <div key={label} className="py-5" style={{ paddingLeft: i === 0 ? 0 : 20, paddingRight: 20, borderRight: i < 3 ? "1px solid var(--color-divider)" : undefined }}>
              <div className="font-heading font-extrabold text-[30px] tracking-tight">{num}</div>
              <div className="label-micro mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-12 flex items-end justify-between gap-10 flex-wrap" style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}>
        <h2 className="text-[48px] leading-none tracking-[-0.03em] max-w-[18ch] m-0">EVERY STONE VERIFIED, PHOTOGRAPHED, ESCROWED.</h2>
        <Link href="/explore" className="btn whitespace-nowrap" style={{ background: "var(--color-bg)", color: "var(--color-text)", padding: "16px 24px" }}>
          EXPLORE GEMS
        </Link>
      </section>
    </main>
  );
}
