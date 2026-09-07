"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push(role === "seller" ? "/signup" : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[380px]">
      <div className="field">
        <label>Full name</label>
        <input className="input" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Email</label>
        <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label>Password</label>
        <input className="input" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2 text-[12.5px]">
        <label className="radio">
          <input type="radio" name="role" checked={role === "buyer"} onChange={() => setRole("buyer")} /> <span className="dot" />
          I am registering as a <strong className="font-heading pl-1">buyer</strong>
        </label>
        <label className="radio">
          <input type="radio" name="role" checked={role === "seller"} onChange={() => setRole("seller")} /> <span className="dot" />
          I am registering as a <strong className="font-heading pl-1">seller</strong> — identity verification required
        </label>
      </div>
      {error && (
        <div className="text-xs" style={{ color: "var(--color-accent)" }}>
          {error}
        </div>
      )}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
      </button>
      <div className="text-[12.5px] opacity-60">
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
          Sign in
        </Link>
      </div>
    </form>
  );
}
