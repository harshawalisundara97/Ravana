"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartButton() {
  const { gemIds } = useCart();
  // The cart is restored from browser storage after hydration, so render 0
  // on the server pass and the real count once mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link href="/cart" className="btn btn-primary">
      <ShoppingCart size={14} strokeWidth={2} /> {mounted ? gemIds.length : 0}
    </Link>
  );
}
