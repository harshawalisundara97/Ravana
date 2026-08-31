"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/seller", label: "Dashboard", meta: "", exact: true },
  { href: "/seller/gems", label: "My gems", meta: "146", exact: true },
  { href: "/seller", label: "Orders", meta: "28", exact: false },
  { href: "/seller", label: "Offers", meta: "9", exact: false },
  { href: "/seller", label: "Auctions", meta: "4", exact: false },
  { href: "/seller", label: "Messages", meta: "3", exact: false },
  { href: "/seller", label: "Wallet", meta: "", exact: false },
  { href: "/seller", label: "Reviews", meta: "", exact: false },
  { href: "/seller", label: "Verification", meta: "", exact: false },
  { href: "/seller", label: "Plan & billing", meta: "", exact: false },
  { href: "/seller", label: "Settings", meta: "", exact: false },
];

export function SellerNav() {
  const pathname = usePathname();
  return (
    <aside className="border-r-2 pt-5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
      {NAV.map((n, i) => {
        const active = n.exact && pathname === n.href;
        return (
          <Link
            key={n.label + i}
            href={n.href}
            className={clsx("w-full text-left border-t block px-5 py-2.5 text-[13.5px] flex justify-between no-underline")}
            style={{ borderColor: "var(--color-divider)", color: active ? "var(--color-accent)" : "var(--color-text)", fontWeight: active ? 800 : 400 }}
          >
            <span>{n.label}</span>
            {n.meta && <span className="opacity-50 text-[11.5px]">{n.meta}</span>}
          </Link>
        );
      })}
      <div className="border-t" style={{ borderColor: "var(--color-divider)" }} />
      <div className="mx-5 mt-5.5 p-3.5 text-xs leading-relaxed" style={{ background: "var(--color-surface)" }}>
        Pro plan · 3% commission · 500 listings.{" "}
        <Link href="/plans" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
          Compare plans
        </Link>
      </div>
    </aside>
  );
}
