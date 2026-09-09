import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { sellerProfiles } from "@/db/schema";
import { getWalletSummary } from "@/lib/queries";
import { usdt, formatDate } from "@/lib/format";

// Per-account balances — never prerender.
export const dynamic = "force-dynamic";

const STATUS_TAG: Record<string, string> = {
  confirmed: "tag-neutral",
  pending: "tag-accent",
  failed: "tag-outline",
};

export default async function WalletPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login?callbackUrl=/wallet");

  const [wallet, [sellerProfile]] = await Promise.all([
    getWalletSummary(userId),
    db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1),
  ]);

  const payoutAddress = sellerProfile?.walletAddress ?? null;

  return (
    <main className="px-8" style={{ padding: "26px 32px 60px" }}>
      <div className="flex justify-between items-end gap-5 flex-wrap mb-5">
        <div>
          <h1 className="mb-1.5">Wallet</h1>
          <div className="text-[13px] opacity-60">USDT only · TRC20, ERC20 and BEP20</div>
        </div>
        <span className={`tag ${payoutAddress ? "tag-accent" : "tag-outline"}`} style={{ fontWeight: 600 }}>
          {payoutAddress ? "PAYOUT ADDRESS ON FILE" : "NO PAYOUT ADDRESS YET"}
        </span>
      </div>

      <div className="grid grid-cols-4 border-t-2 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        {[
          { label: "Available", value: wallet.available, accent: false },
          { label: "In escrow", value: wallet.inEscrow, accent: true },
          { label: "Clearing", value: wallet.clearing, accent: false },
          { label: "Lifetime withdrawn", value: wallet.lifetimeWithdrawn, accent: false },
        ].map((m, i) => (
          <div key={m.label} className="py-5" style={{ paddingLeft: i === 0 ? 0 : 20, paddingRight: 20, borderRight: i < 3 ? "1px solid var(--color-divider)" : undefined }}>
            <div className="label-micro mb-1.5">{m.label}</div>
            <div className="font-heading font-extrabold text-[30px]" style={{ color: m.accent ? "var(--color-accent)" : undefined }}>
              {usdt(m.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-9 mt-7.5">
        <div>
          <h3 className="label-section !text-xs mb-3.5">Deposit</h3>
          <div className="p-4.5" style={{ border: "1px solid var(--color-divider)" }}>
            <div className="label-micro mb-2">Deposit address</div>
            <div className="text-[12.5px] leading-relaxed mb-3 opacity-80">
              Deposit addresses are issued per order at checkout, not held permanently on the account. Custody is not connected yet,
              so no address here can receive real funds.
            </div>
            <div className="note">
              A permanent per-account deposit address arrives with custody (Fireblocks/BitGo), together with the chain watcher that
              credits deposits automatically.
            </div>
          </div>
        </div>

        <div>
          <h3 className="label-section !text-xs mb-3.5">Withdraw</h3>
          <div className="p-4.5" style={{ border: "2px solid var(--color-divider)" }}>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="field">
                <label>Amount (USDT)</label>
                <input className="input" placeholder="0.00" disabled />
              </div>
              <div className="field">
                <label>Network</label>
                <input className="input" defaultValue="TRC20" disabled />
              </div>
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <label>To address</label>
                <input className="input" defaultValue={payoutAddress ?? ""} placeholder="No payout address on file" disabled />
              </div>
            </div>
            <button className="btn btn-primary w-full text-left mt-3.5" disabled>
              WITHDRAW
            </button>
            <div className="note mt-3">
              Withdrawals are disabled until custody is connected — signing and broadcasting a real payout needs the custody provider,
              and the admin approval queue that goes with it.
              {wallet.available > 0 && ` Your ${usdt(wallet.available)} USDT balance is ledger-side and stays available.`}
            </div>
          </div>
        </div>
      </div>

      <h3 className="label-section !text-xs mt-8 mb-3">Transactions</h3>
      {wallet.transactions.length ? (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Reference</th>
              <th>Network</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {wallet.transactions.map((t) => (
              <tr key={t.id}>
                <td>{formatDate(t.createdAt)}</td>
                <td className="capitalize">{t.type.replace(/_/g, " ")}</td>
                <td>{t.reference}</td>
                <td>{t.network ?? "Internal"}</td>
                <td style={{ fontWeight: 600, color: t.amount > 0 ? "var(--color-accent)" : undefined }}>
                  {t.amount > 0 ? "+" : ""}
                  {usdt(t.amount)}
                </td>
                <td>
                  <span className={`tag ${STATUS_TAG[t.status] ?? "tag-neutral"}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="note">No transactions yet. Buying or selling a stone will post entries here.</div>
      )}
    </main>
  );
}
