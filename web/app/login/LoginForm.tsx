"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push(params.get("callbackUrl") || "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[380px]">
      <div className="field">
        <label>Email</label>
        <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>Password</label>
        <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && (
        <div className="text-xs" style={{ color: "var(--color-accent)" }}>
          {error}
        </div>
      )}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "SIGNING IN..." : "SIGN IN"}
      </button>
      <div className="text-[12.5px] opacity-60">
        No account yet?{" "}
        <Link href="/register" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
          Create one
        </Link>
      </div>
      <div className="note text-[11.5px]">
        Demo accounts (password: password123): buyer@ravanagems.test · s1@ravanagems.test (seller) · admin@ravanagems.test
      </div>
    </form>
  );
}
