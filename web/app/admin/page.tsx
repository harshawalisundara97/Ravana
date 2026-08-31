const LEDGER_ROWS = [
  { time: "11:06", order: "RG-88104", movement: "Buyer funded escrow", amount: "2,895.00", tag: "Held", cls: "tag-accent" },
  { time: "10:44", order: "RG-88090", movement: "Release to seller", amount: "8,633.00", tag: "Settled", cls: "tag-neutral" },
  { time: "09:58", order: "RG-87720", movement: "Refund to buyer", amount: "1,180.00", tag: "Settled", cls: "tag-neutral" },
  { time: "09:12", order: "RG-86544", movement: "Frozen — dispute opened", amount: "3,300.00", tag: "Frozen", cls: "tag-outline" },
  { time: "08:31", order: "RG-88001", movement: "Buyer funded escrow", amount: "15,400.00", tag: "Held", cls: "tag-accent" },
  { time: "07:50", order: "RG-87994", movement: "Commission collected", amount: "72.50", tag: "Settled", cls: "tag-neutral" },
];

const WITHDRAWALS = [
  { seller: "Ceylon Rare Stones", amount: "8,250.00", address: "TXk9…eUt", risk: "Low", cls: "tag-neutral" },
  { seller: "Mogok House", amount: "41,900.00", address: "TQ4a…m19", risk: "New address", cls: "tag-outline" },
  { seller: "Minas Azul", amount: "2,040.00", address: "TB7p…x02", risk: "Low", cls: "tag-neutral" },
];

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="mb-5">Overview</h1>
      <div className="grid grid-cols-3 border-t-2" style={{ borderColor: "var(--color-divider)" }}>
        {[
          ["GMV, 30 days", "1,284,900", "USDT", false],
          ["Commission earned", "48,912", "USDT", true],
          ["Held in escrow", "2,904,140", "USDT", false],
        ].map(([label, num, unit, accent], i) => (
          <div key={label as string} className="py-4.5" style={{ paddingLeft: i === 0 ? 0 : 18, paddingRight: 18, borderRight: i < 2 ? "1px solid var(--color-divider)" : undefined, borderBottom: "1px solid var(--color-divider)" }}>
            <div className="label-micro mb-1.5">{label}</div>
            <div className="font-heading font-extrabold text-[29px]" style={{ color: accent ? "var(--color-accent)" : undefined }}>
              {num} <span className="text-xs opacity-55">{unit}</span>
            </div>
          </div>
        ))}
        {[
          ["Pending verification", "14", "oldest 9h", false],
          ["Open disputes", "3", "1 past SLA", true],
          ["Withdrawals queued", "21", "184,200 USDT", false],
        ].map(([label, num, note, accent], i) => (
          <div key={label as string} className="py-4.5" style={{ paddingLeft: i === 0 ? 0 : 18, paddingRight: 18, borderRight: i < 2 ? "1px solid var(--color-divider)" : undefined, borderBottom: "2px solid var(--color-divider)" }}>
            <div className="label-micro mb-1.5">{label}</div>
            <div className="font-heading font-extrabold text-[29px]">{num}</div>
            <div className="text-[11px]" style={{ color: accent ? "var(--color-accent)" : undefined, opacity: accent ? 1 : 0.5 }}>
              {note}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-9 mt-7.5" style={{ gridTemplateColumns: "1.35fr 1fr" }}>
        <div>
          <h3 className="label-section !text-xs mb-3">Escrow ledger — latest movements</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Order</th>
                <th>Movement</th>
                <th>Amount</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {LEDGER_ROWS.map((r) => (
                <tr key={r.order + r.time}>
                  <td>{r.time}</td>
                  <td>{r.order}</td>
                  <td>{r.movement}</td>
                  <td>{r.amount}</td>
                  <td>
                    <span className={`tag ${r.cls}`}>{r.tag}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="label-section !text-xs mt-7.5 mb-3">Withdrawal approvals</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Seller</th>
                <th>Amount</th>
                <th>Address</th>
                <th>Risk</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {WITHDRAWALS.map((w) => (
                <tr key={w.seller}>
                  <td>{w.seller}</td>
                  <td>{w.amount}</td>
                  <td className="text-[11.5px]">{w.address}</td>
                  <td>
                    <span className={`tag ${w.cls}`}>{w.risk}</span>
                  </td>
                  <td>
                    <span className="flex gap-2">
                      <button className="btn btn-primary" style={{ padding: "5px 11px", fontSize: 11.5 }}>
                        APPROVE
                      </button>
                      <button className="btn btn-secondary" style={{ padding: "5px 11px", fontSize: 11.5 }}>
                        HOLD
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="label-section !text-xs mb-3">Commission by plan — 30 days</h3>
          <div className="text-[13px] border-t" style={{ borderColor: "var(--color-divider)" }}>
            {[
              ["Free · 5%", "21,410", 44],
              ["Pro · 3%", "19,880", 41],
              ["Business · 2%", "7,622", 15],
            ].map(([label, val, pct]) => (
              <div key={label as string} className="py-3 border-b" style={{ borderColor: "var(--color-divider)" }}>
                <div className="flex justify-between mb-1.5">
                  <span>{label}</span>
                  <span className="font-semibold">{val}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
            <div className="py-3 border-b" style={{ borderColor: "var(--color-divider)" }}>
              <div className="flex justify-between opacity-65">
                <span>Featured listings</span>
                <span className="font-semibold">3,180</span>
              </div>
            </div>
            <div className="py-3 border-b-2" style={{ borderColor: "var(--color-divider)" }}>
              <div className="flex justify-between font-heading font-extrabold">
                <span>Total revenue</span>
                <span>52,092 USDT</span>
              </div>
            </div>
          </div>

          <h3 className="label-section !text-xs mt-7 mb-3">Flags this week</h3>
          <div className="text-[12.5px] flex flex-col">
            {[
              ["Photograph reused across sellers", 4],
              ["Report number not found at lab", 2],
              ["Off-platform payment requested", 6],
              ["Sanctioned-region shipping attempt", 1],
            ].map(([label, count], i, arr) => (
              <div key={label as string} className="flex justify-between py-2.5 border-t" style={{ borderColor: "var(--color-divider)", borderBottom: i === arr.length - 1 ? "1px solid var(--color-divider)" : undefined }}>
                <span>{label}</span>
                <span className="font-semibold" style={{ color: "var(--color-accent)" }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
          <div className="note mt-4.5">Custody, KYC and cross-border gem trade carry real regulatory duties. These screens assume a compliance sign-off exists for each operating jurisdiction.</div>
        </div>
      </div>
    </div>
  );
}
