import Link from "next/link";

const COLUMNS = [
  { title: "Marketplace", links: [["Explore gems", "/explore"], ["Live auctions", "/explore?auction=1"], ["Sell a gem", "/sell"], ["Seller plans", "/plans"]] },
  { title: "Trust & safety", links: [["Verify a certificate", "/verify"], ["Buyer protection", "/explore"], ["Escrow explained", "/escrow/o1"], ["Dispute resolution", "/admin/disputes/d1"]] },
  { title: "Account", links: [["Buyer dashboard", "/dashboard"], ["Seller Centre", "/seller"], ["Wallet", "/wallet"], ["Sign up & KYC", "/signup"]] },
  { title: "Company", links: [["About RavanaGems", "/about"], ["Contact", "/contact"], ["Terms", "/terms"], ["Privacy", "/privacy"]] },
];

export function Footer() {
  return (
    <footer className="border-t-2 mt-16" style={{ borderColor: "var(--color-divider)" }}>
      <div className="grid grid-cols-4 gap-8 px-8 py-10 max-w-[1440px] mx-auto">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h6 className="mb-3">{col.title}</h6>
            <ul className="flex flex-col gap-2">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted no-underline hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="hr mx-8" />
      <p className="text-xs text-muted px-8 pb-6">© 2026 RavanaGems. Not investment advice. USDT settlement is subject to network confirmation times.</p>
    </footer>
  );
}
