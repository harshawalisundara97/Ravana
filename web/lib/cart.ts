"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  gemIds: string[];
  add: (gemId: string) => void;
  remove: (gemId: string) => void;
  clear: () => void;
}

// Cart lives in the browser only — it holds gem ids, never prices, so a
// stale or tampered cart can't affect what an order actually costs. The
// server re-reads every stone's real price when the order is created.
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      gemIds: [],
      add: (gemId) => set((s) => (s.gemIds.includes(gemId) ? s : { gemIds: [...s.gemIds, gemId] })),
      remove: (gemId) => set((s) => ({ gemIds: s.gemIds.filter((id) => id !== gemId) })),
      clear: () => set({ gemIds: [] }),
    }),
    { name: "ravanagems-cart" }
  )
);
