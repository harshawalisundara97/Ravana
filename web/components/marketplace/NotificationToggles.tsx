"use client";
import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";

const ITEMS = [
  { label: "Offers & counters", locked: false, defaultOn: true },
  { label: "Auction outbid & ending", locked: true, defaultOn: true },
  { label: "Order & escrow events", locked: true, defaultOn: true },
  { label: "Price drops on saved gems", locked: false, defaultOn: false },
  { label: "New gems from followed sellers", locked: false, defaultOn: true },
];

export function NotificationToggles() {
  const [state, setState] = useState(() => Object.fromEntries(ITEMS.map((i) => [i.label, i.defaultOn])));

  return (
    <div className="text-[13px]">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex justify-between items-center py-3 border-t" style={{ borderColor: "var(--color-divider)" }}>
          <span>{item.label}</span>
          <Toggle on={state[item.label]} onChange={(v) => !item.locked && setState((s) => ({ ...s, [item.label]: v }))} />
        </div>
      ))}
    </div>
  );
}
