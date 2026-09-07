import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { TrustStrip } from "./TrustStrip";
import { AccountMenu } from "./AccountMenu";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/explore?auction=1", label: "Auctions" },
  { href: "/sell", label: "Sell a gem" },
  { href: "/plans", label: "Seller plans" },
  { href: "/verify", label: "Verify a certificate" },
];

export function Header({ cartCount = 2 }: { cartCount?: number }) {
  return (
    <>
      <TrustStrip />
      <header className="sticky top-0 z-40" style={{ background: "var(--color-bg)" }}>
        <div className="nav">
          <Link href="/" className="nav-brand">
            RAVANAGEMS
          </Link>
          <nav className="flex gap-4">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 ml-4" style={{ background: "var(--color-surface)", padding: "6px 10px", minWidth: 200 }}>
            <Search size={14} strokeWidth={2} />
            <input placeholder="Search gems, sellers, IDs" className="bg-transparent outline-none text-sm w-full" />
          </div>
          <AccountMenu />
          <Link href="/cart" className="btn btn-primary">
            <ShoppingCart size={14} strokeWidth={2} /> {cartCount}
          </Link>
        </div>
      </header>
    </>
  );
}
