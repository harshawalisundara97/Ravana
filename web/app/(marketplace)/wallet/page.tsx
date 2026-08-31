import { walletTransactions } from "@/lib/data";
import { usdt } from "@/lib/format";

export default function WalletPage() {
  return (
    <main className="px-8" style={{ padding: "26px 32px 60px" }}>
      <div className="flex justify-between items-end gap-5 flex-wrap mb-5">
        <div>
          <h1 className="mb-1.5">Wallet</h1>
          <div className="text-[13px] opacity-60">USDT only · TRC20 at launch, ERC20 and BEP20 in review</div>
        </div>
        <span className="tag tag-accent" style={{ fontWeight: 600 }}>
          WITHDRAWAL ADDRESS VERIFIED
        </span>
      </div>

      <div className="grid grid-cols-4 border-t-2 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
        {[
          ["Available", "1,240.00", false],
          ["In escrow", "2,895.00", true],
          ["Clearing", "0.00", false],
          ["Lifetime withdrawn", "14,820.00", false],
        ].map(([label, val, accent], i) => (
          <div key={label as string} className="py-5" style={{ paddingLeft: i === 0 ? 0 : 20, paddingRight: 20, borderRight: i < 3 ? "1px solid var(--color-divider)" : undefined }}>
            <div className="label-micro mb-1.5">{label}</div>
            <div className="font-heading font-extrabold text-[30px]" style={{ color: accent ? "var(--color-accent)" : undefined }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-9 mt-7.5">
        <div>
          <h3 className="label-section !text-xs mb-3.5">Deposit</h3>
          <div className="p-4.5 flex gap-4.5 items-start" style={{ border: "1px solid var(--color-divider)" }}>
            <div className="w-[120px] h-[120px] flex-none p-2.5 bg-white" style={{ border: "1px solid var(--color-divider)" }}>
              <div className="w-full h-full" style={{ backgroundImage: "repeating-conic-gradient(#201e1d 0% 25%, #fff 0% 50%)", backgroundSize: "10px 10px" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="label-micro mb-1">Your TRC20 deposit address</div>
              <div className="text-[12.5px] break-all p-2.5 mb-3" style={{ background: "var(--color-surface)" }}>
                TR8vN2xC5kQ9pL4mW7bJ1dY6sF3aH0eZq
              </div>
              <div className="text-xs opacity-65 leading-relaxed">Permanent address. Deposits credit after 19 confirmations, usually under two minutes. Sending any other token loses the funds.</div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="label-section !text-xs mb-3.5">Withdraw</h3>
          <div className="p-4.5" style={{ border: "2px solid var(--color-accent)" }}>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="field">
                <label>Amount (USDT)</label>
                <input className="input" defaultValue="1,000.00" />
              </div>
              <div className="field">
                <label>Network</label>
                <input className="input" defaultValue="TRC20" />
              </div>
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <label>To address</label>
                <input className="input" defaultValue="TXk9mQ4pV2sB7hL1nR6yD3wZ8cF5aJ0eUt" />
              </div>
            </div>
            <div className="text-[13px] flex flex-col gap-2 mt-3.5 pt-3 border-t" style={{ borderColor: "var(--color-divider)" }}>
              <div className="flex justify-between">
                <span className="opacity-65">Network fee</span>
                <span className="font-semibold">1.00</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-65">Arrives</span>
                <span className="font-semibold">999.00 USDT · ~1h</span>
              </div>
            </div>
            <button className="btn btn-primary w-full text-left mt-3.5">WITHDRAW 1,000.00 USDT</button>
            <div className="text-[11.5px] opacity-60 leading-relaxed mt-2.5">A new address triggers a 24-hour security hold and a manual review.</div>
          </div>
        </div>
      </div>

      <h3 className="label-section !text-xs mt-8 mb-3">Transactions</h3>
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
          {walletTransactions.map((w) => (
            <tr key={w.id}>
              <td>{new Date(w.createdAt).toISOString().slice(0, 10)}</td>
              <td className="capitalize">{w.type}</td>
              <td className="text-[11.5px]">{w.txHash ?? "—"}</td>
              <td>{w.network}</td>
              <td>{w.amount > 0 ? "+" : ""}{usdt(w.amount)}</td>
              <td>
                <span className="tag tag-neutral">{w.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
