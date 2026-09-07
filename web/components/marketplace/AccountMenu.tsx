"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "lucide-react";

export function AccountMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="btn btn-secondary" style={{ opacity: 0.5 }}>···</span>;
  }

  if (!session?.user) {
    return (
      <Link href="/login" className="btn btn-secondary">
        <User size={14} strokeWidth={2} /> Sign in
      </Link>
    );
  }

  const role = (session.user as { role?: string }).role;
  const homeHref = role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/dashboard";

  return (
    <div className="flex items-center gap-2">
      <Link href={homeHref} className="btn btn-secondary">
        <User size={14} strokeWidth={2} /> {session.user.name?.split(" ")[0]}
      </Link>
      <button className="btn-ghost text-xs" onClick={() => signOut({ callbackUrl: "/" })}>
        Sign out
      </button>
    </div>
  );
}
