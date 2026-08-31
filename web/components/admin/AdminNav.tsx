"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin", label: "Users", exact: false },
  { href: "/admin", label: "Sellers", exact: false },
  { href: "/admin", label: "Listings", exact: false },
  { href: "/admin", label: "Escrow", exact: false },
  { href: "/admin/verification", label: "Verification", meta: "14", exact: true },
  { href: "/admin/disputes/d1", label: "Disputes", meta: "3", exact: true },
  { href: "/admin", label: "Withdrawals", meta: "21", exact: false },
  { href: "/admin", label: "Commissions", exact: false },
  { href: "/admin", label: "Reports", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="border-r-2 pt-5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
      {NAV.map((n, i) => {
        const active = n.exact && pathname === n.href;
        return (
          <Link
            key={n.label + i}
            href={n.href}
            className="w-full text-left border-t block px-5 py-2.5 text-[13.5px] flex justify-between no-underline"
            style={{ borderColor: "var(--color-divider)", color: active ? "var(--color-accent)" : "var(--color-text)", fontWeight: active ? 800 : 400 }}
          >
            <span>{n.label}</span>
            {n.meta && <span className="opacity-50 text-[11.5px]">{n.meta}</span>}
          </Link>
        );
      })}
    </aside>
  );
}
