"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";
import type { Gem } from "@/lib/types";
import { usdt } from "@/lib/format";
import { Seg } from "@/components/ui/Seg";
import { useCart } from "@/lib/cart";

type PayState = "review" | "pending" | "done";
type Network = "TRC20" | "ERC20" | "BEP20";

export function CartClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const { gemIds, remove, clear } = useCart();

  const [lines, setLines] = useState<Gem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pay, setPay] = useState<PayState>("review");
  const [network, setNetwork] = useState<Network>("TRC20");
  const [error, setError] = useState<string | null>(null);
  const [placedOrders, setPlacedOrders] = useState<{ id: string; amount: number }[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!gemIds.length) {
        setLines([]);
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/gems/lookup?ids=${gemIds.join(",")}`);
      const body = await res.json();
      if (!cancelled) {
        setLines(body.gems ?? []);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [gemIds]);

  const subtotal = lines.reduce((s, g) => s + g.price, 0);
  const shipping = lines.length ? 45 : 0;
  const escrowFee = +(subtotal * 0.0031).toFixed(2);
  const total = +(subtotal + shipping + escrowFee).toFixed(2);
  const sellerCount = new Set(lines.map((g) => g.sellerId)).size;

  async function placeOrder() {
    if (!session?.user) {
      router.push("/login?callbackUrl=/cart");
      return;
    }
    setError(null);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gemIds: lines.map((g) => g.id), network }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not place this order.");
      return;
    }
    const body = await res.json();
    setPlacedOrders(body.orders);
    setPay("pending");
  }

  async function confirmFunding() {
    // Escrow funding is simulated until custody is wired (Phase B3): we
    // advance each order past "paid" rather than waiting on a chain watcher.
    for (const order of placedOrders) {
      await fetch(`/api/orders/${order.id}/advance`, { method: "POST" });
    }
    clear();
    setPay("done");
  }

  return (
    <main className="grid" style={{ gridTemplateColumns: "1fr 420px" }}>
      <section className="border-r-2 px-8 pt-6.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <h1 className="mb-1">Cart</h1>
        <p className="text-[13px] opacity-60 mb-5.5">
          {loading
            ? "Loading your cart…"
            : lines.length
              ? `${lines.length} ${lines.length === 1 ? "stone" : "stones"} from ${sellerCount} ${sellerCount === 1 ? "seller" : "sellers"}. Each seller's parcel ships and settles separately.`
              : "Your cart is empty."}
        </p>

        <div className="border-t-2" style={{ borderColor: "var(--color-divider)" }}>
          {lines.map((g) => (
            <div key={g.id} className="grid gap-4.5 py-4.5 border-b items-center" style={{ gridTemplateColumns: "88px 1fr auto", borderColor: "var(--color-divider)" }}>
              <div className="w-[88px] h-[88px] bg-cover bg-center" style={{ backgroundImage: `url(${g.photos[0]})` }} />
              <div>
                <div className="font-heading font-extrabold text-base mb-1">{g.title}</div>
                <div className="text-xs opacity-60 mb-2">
                  {g.carat} ct · {g.origin} · {g.treatment}
                </div>
                <div className="flex gap-3.5 text-[11.5px]">
                  <span className="opacity-60">{g.sellerName}</span>
                  {pay === "review" && (
                    <button className="bg-transparent border-0 p-0 cursor-pointer" style={{ color: "var(--color-accent)" }} onClick={() => remove(g.id)}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="font-heading font-extrabold text-xl">{usdt(g.price)}</span>
                <div className="text-[10.5px] tracking-[.12em] opacity-55">USDT</div>
              </div>
            </div>
          ))}
          {!loading && lines.length === 0 && (
            <div className="py-10 text-center opacity-60">
              Nothing here yet. <Link href="/explore">Browse gems</Link>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <>
            <h3 className="label-section !text-xs mt-8 mb-3">Shipping</h3>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="field">
                <label>Recipient</label>
                <input className="input" defaultValue={session?.user?.name ?? ""} />
              </div>
              <div className="field">
                <label>Destination</label>
                <input className="input" placeholder="City, country" />
              </div>
              <div className="field">
                <label>Carrier</label>
                <input className="input" defaultValue="FedEx Priority — insured to 25,000 USDT" />
              </div>
              <div className="field">
                <label>Declared value</label>
                <input className="input" readOnly value={`${usdt(subtotal)} USDT`} />
              </div>
            </div>
          </>
        )}
      </section>

      <aside className="px-7 pt-6.5 pb-16 relative">
        <h2 className="label-section !text-xs mb-4">Order summary</h2>
        <div className="text-[13.5px] flex flex-col gap-2.5 border-t pt-3.5" style={{ borderColor: "var(--color-divider)" }}>
          <div className="flex justify-between">
            <span className="opacity-65">Subtotal</span>
            <span className="font-semibold">{usdt(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-65">Insured shipping</span>
            <span className="font-semibold">{usdt(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-65">Escrow &amp; network fee</span>
            <span className="font-semibold">{usdt(escrowFee)}</span>
          </div>
          <div className="flex justify-between opacity-65">
            <span>Buyer protection</span>
            <span>Included</span>
          </div>
        </div>
        <div className="flex justify-between items-end border-t-2 border-b-2 py-4 my-4" style={{ borderColor: "var(--color-divider)" }}>
          <span className="text-xs tracking-[.12em] uppercase opacity-65">Total</span>
          <span>
            <span className="font-heading font-extrabold text-[34px] tracking-[-0.02em]">{usdt(total)}</span> <span className="text-xs tracking-[.12em] opacity-60">USDT</span>
          </span>
        </div>

        <div className="label-micro mb-2.5">Network</div>
        <div className="w-full mb-5">
          <Seg
            value={network}
            onChange={setNetwork}
            options={[
              { label: "TRC20", value: "TRC20" as Network },
              { label: "ERC20", value: "ERC20" as Network },
              { label: "BEP20", value: "BEP20" as Network },
            ]}
          />
        </div>

        {error && (
          <div className="text-xs mb-3" style={{ color: "var(--color-accent)" }}>
            {error}
          </div>
        )}

        {pay === "review" && (
          <div>
            <button className="btn btn-primary w-full justify-between text-left" style={{ padding: "16px 20px" }} disabled={lines.length === 0} onClick={placeOrder}>
              PAY WITH USDT <span>→</span>
            </button>
            <div className="text-[11.5px] opacity-60 leading-relaxed mt-3">Funds go to RavanaGems escrow, not to the sellers. Released only after you confirm each parcel.</div>
          </div>
        )}

        {pay === "pending" && (
          <div className="p-4.5" style={{ border: "2px solid var(--color-accent)" }}>
            <div className="flex justify-between items-baseline mb-3.5">
              <span className="text-[11px] tracking-[.14em] uppercase font-semibold" style={{ color: "var(--color-accent)" }}>
                Awaiting transfer
              </span>
            </div>
            <div className="label-micro mb-1">Send exactly</div>
            <div className="font-heading font-extrabold text-[22px] mb-2.5">{usdt(total)} USDT</div>
            <div className="label-micro mb-1">{network} address</div>
            <div className="text-xs break-all leading-relaxed p-2" style={{ background: "var(--color-surface)" }}>
              {placedOrders.length === 1 ? "One address per order — see order page" : `${placedOrders.length} orders created, one address each`}
            </div>
            <div className="note my-3.5">
              Custody is not yet connected, so no real transfer is expected. Confirming below simulates the chain watcher seeing your deposit and funds the escrow.
            </div>
            <button className="btn btn-primary w-full text-left" style={{ padding: "14px 18px" }} onClick={confirmFunding}>
              I&apos;VE SENT THE PAYMENT
            </button>
          </div>
        )}

        {pay === "done" && (
          <div className="p-4.5" style={{ border: "2px solid var(--color-accent)" }}>
            <div className="flex gap-2 items-center mb-3">
              <Check size={18} strokeWidth={3} color="var(--color-accent)" />
              <span className="font-heading font-extrabold text-[17px]">Escrow funded</span>
            </div>
            <div className="text-[12.5px] leading-relaxed opacity-80 mb-3.5">
              {placedOrders.length} {placedOrders.length === 1 ? "order is" : "orders are"} funded and the {placedOrders.length === 1 ? "seller has" : "sellers have"} been cleared to ship.
            </div>
            {placedOrders.map((o) => (
              <Link key={o.id} href={`/escrow/${o.id}`} className="btn btn-primary w-full text-left block mb-2">
                TRACK ORDER · {usdt(o.amount)} USDT
              </Link>
            ))}
          </div>
        )}
      </aside>
    </main>
  );
}
