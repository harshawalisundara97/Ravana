const SECTIONS = [
  ["1. What RavanaGems is", "RavanaGems operates a marketplace connecting buyers and sellers of gemstones. We are not a party to the sale of any stone — the contract is between buyer and seller. We provide escrow, identity verification, laboratory report cross-checks and dispute resolution as marketplace services."],
  ["2. Escrow and settlement", "Funds paid by a buyer are held by RavanaGems in escrow, denominated in USDT, until the buyer confirms receipt or the inspection window lapses. Escrow protects both sides against non-delivery and non-payment; it does not constitute a guarantee of a stone's authenticity, origin or treatment beyond what the accompanying laboratory report states."],
  ["3. Seller obligations", "Sellers must list only stones they have the legal right to sell, disclose treatment and origin accurately, and ship insured within the stated handling time. Stones listed above 5,000 USDT are reviewed by a gemmologist before the listing settles; a review flag does not remove a live listing unless a discrepancy is confirmed."],
  ["4. Buyer obligations", "Buyers must pay the exact amount to the single-use deposit address shown at checkout, on the selected network. Sending funds on the wrong network, or to an address obtained outside the marketplace, results in an unrecoverable loss that RavanaGems cannot reverse."],
  ["5. Fees and commission", "Listing is free on every plan. Commission is deducted from the settled amount only when escrow releases to the seller — never up front, and never on an unsold gem. Current commission rates by plan are published on the seller plans page."],
  ["6. Disputes", "A buyer may open a dispute within the stated inspection window if a stone differs materially from its listing or laboratory report. Escrow funds freeze automatically for the duration of the case. RavanaGems reviews evidence from both parties and may order an independent laboratory opinion before deciding a refund, release or split."],
  ["7. Account suspension", "Accounts found to be requesting payment outside the marketplace, misrepresenting a stone's laboratory report, or accumulating repeated substantiated disputes may be suspended, with pending payouts frozen pending investigation."],
  ["8. Limitation of liability", "RavanaGems is a marketplace intermediary. We do not appraise, authenticate or insure stones beyond the escrow and verification services described here. Any AI-assisted tools on the platform are assistive only and are not a substitute for a laboratory report."],
];

export default function TermsPage() {
  return (
    <main className="px-8 flex justify-center" style={{ padding: "44px 32px 70px" }}>
      <div className="w-full" style={{ maxWidth: 760 }}>
        <div className="text-[11px] tracking-[.16em] uppercase font-semibold mb-3.5" style={{ color: "var(--color-accent)" }}>
          Legal
        </div>
        <h1 className="mb-2.5">Terms of service</h1>
        <p className="text-[13px] opacity-60 mb-8">Last updated 30 August 2026. This is a general summary and not a substitute for full legal advice in your jurisdiction.</p>

        <div className="flex flex-col">
          {SECTIONS.map(([title, body], i) => (
            <div key={title} className="py-5.5 border-t" style={{ borderColor: "var(--color-divider)", borderBottom: i === SECTIONS.length - 1 ? "2px solid var(--color-divider)" : undefined }}>
              <h3 className="mb-2">{title}</h3>
              <p className="text-[13.5px] leading-relaxed opacity-80 m-0">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
