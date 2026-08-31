const SECTIONS = [
  ["1. What we collect", "Account details (name, email), identity verification documents (passport or national ID, a selfie check), business registration documents for sellers, wallet addresses used for deposits and withdrawals, and records of your listings, orders, offers, bids and messages on the marketplace."],
  ["2. Why we collect it", "Identity and business documents exist to satisfy KYC and anti-money-laundering obligations that apply to custody of funds and cross-border trade in high-value goods. Transaction records exist to operate escrow, resolve disputes and provide the marketplace itself."],
  ["3. Who sees it", "Identity documents are held encrypted and are never shown to buyers or other sellers. Verified-seller badges and business names are public; the underlying documents are visible only to RavanaGems compliance staff and, where legally required, to regulators."],
  ["4. Third parties", "We share data with the laboratories that issue certificates (to cross-check report numbers), identity-verification providers, and blockchain networks inherent to USDT settlement — wallet addresses and transaction hashes are public on-chain by nature."],
  ["5. Retention", "Transaction and identity records are retained for the period required by applicable financial-services and anti-money-laundering regulation, typically five to seven years after an account closes, after which they are deleted."],
  ["6. Your rights", "You can request a copy of the personal data we hold about you, ask us to correct inaccurate data, and request deletion once retention obligations have lapsed. Contact compliance@ravanagems.com to exercise any of these."],
  ["7. Security", "Identity documents and wallet credentials are encrypted at rest and in transit. RavanaGems staff access to identity documents is logged and limited to compliance review and dispute investigation."],
];

export default function PrivacyPage() {
  return (
    <main className="px-8 flex justify-center" style={{ padding: "44px 32px 70px" }}>
      <div className="w-full" style={{ maxWidth: 760 }}>
        <div className="text-[11px] tracking-[.16em] uppercase font-semibold mb-3.5" style={{ color: "var(--color-accent)" }}>
          Legal
        </div>
        <h1 className="mb-2.5">Privacy policy</h1>
        <p className="text-[13px] opacity-60 mb-8">Last updated 30 August 2026. Identity checks are a legal requirement for cross-border trade and custody of funds — see section 2.</p>

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
