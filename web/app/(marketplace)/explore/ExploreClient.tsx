"use client";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import type { Gem, GemType } from "@/lib/types";
import { GemGrid } from "@/components/marketplace/GemGrid";
import { Seg } from "@/components/ui/Seg";

const ALL_TYPES: GemType[] = ["Sapphire", "Ruby", "Emerald", "Spinel", "Garnet", "Tourmaline", "Aquamarine", "Topaz", "Alexandrite", "Chrysoberyl", "Zircon"];
const ORIGINS = ["Sri Lanka", "Myanmar", "Madagascar", "Mozambique", "Tanzania", "Kashmir, India"];

type Sort = "relevance" | "price" | "carat" | "newest";

export function ExploreClient({ gems, initialType }: { gems: Gem[]; initialType?: string }) {
  const [types, setTypes] = useState<Set<string>>(new Set(initialType ? [initialType] : []));
  const [certOnly, setCertOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [origin, setOrigin] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("relevance");
  const [visible, setVisible] = useState(12);

  const filtered = useMemo(() => {
    let list = gems.filter((g) => g.status === "live" || g.status === "reserved");
    if (types.size) list = list.filter((g) => types.has(g.type));
    if (origin) list = list.filter((g) => g.origin === origin);
    if (certOnly) list = list.filter((g) => !!g.certLab);
    if (sort === "price") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "carat") list = [...list].sort((a, b) => b.carat - a.carat);
    if (sort === "newest") list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [gems, types, origin, certOnly, sort]);

  function toggleType(t: string) {
    setTypes((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  }

  return (
    <main className="grid" style={{ gridTemplateColumns: "250px 1fr" }}>
      <aside className="border-r-2 px-5 pt-5.5 pb-16" style={{ borderColor: "var(--color-divider)" }}>
        <div className="flex items-baseline justify-between mb-4.5">
          <h2 className="label-section !text-xs m-0">Filters</h2>
          <button
            className="btn-ghost text-[11px] font-extrabold p-0"
            style={{ fontFamily: "var(--font-heading)" }}
            onClick={() => {
              setTypes(new Set());
              setOrigin(null);
              setCertOnly(false);
              setVerifiedOnly(false);
            }}
          >
            CLEAR
          </button>
        </div>

        <div className="border-t py-3.5" style={{ borderColor: "var(--color-divider)" }}>
          <div className="label-micro mb-2.5">Gem type</div>
          <div className="flex flex-col gap-1.5">
            {ALL_TYPES.map((t) => {
              const count = gems.filter((g) => g.type === t).length;
              const on = types.has(t);
              return (
                <button key={t} onClick={() => toggleType(t)} className="flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer text-[13px] text-left">
                  <span className="w-3.5 h-3.5 flex-none flex items-center justify-center border" style={{ borderColor: "var(--color-divider)", background: on ? "var(--color-accent)" : "transparent" }}>
                    {on && <Check size={10} strokeWidth={3.5} color="#f3f2f2" />}
                  </span>
                  <span className="flex-1">{t}</span>
                  <span className="opacity-45 text-[11.5px]">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t py-3.5" style={{ borderColor: "var(--color-divider)" }}>
          <div className="label-micro mb-2.5">Origin</div>
          <div className="flex flex-wrap gap-1.5">
            {ORIGINS.map((o) => (
              <button key={o} onClick={() => setOrigin(origin === o ? null : o)} className={`tag ${origin === o ? "tag-outline" : "tag-neutral"}`} style={{ cursor: "pointer", border: origin === o ? undefined : "none" }}>
                {o}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t py-3.5" style={{ borderColor: "var(--color-divider)" }}>
          <div className="label-micro mb-2.5">Trust</div>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => setCertOnly((v) => !v)} className="flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer text-[13px]">
              <span className="w-3.5 h-3.5 border flex items-center justify-center" style={{ borderColor: "var(--color-divider)", background: certOnly ? "var(--color-accent)" : "transparent" }}>
                {certOnly && <Check size={10} strokeWidth={3.5} color="#f3f2f2" />}
              </span>
              Lab-certified only
            </button>
            <button onClick={() => setVerifiedOnly((v) => !v)} className="flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer text-[13px]">
              <span className="w-3.5 h-3.5 border flex items-center justify-center" style={{ borderColor: "var(--color-divider)", background: verifiedOnly ? "var(--color-accent)" : "transparent" }}>
                {verifiedOnly && <Check size={10} strokeWidth={3.5} color="#f3f2f2" />}
              </span>
              Verified sellers only
            </button>
          </div>
        </div>
      </aside>

      <section>
        <div className="flex items-end justify-between gap-5 px-8 pt-6 pb-4 border-b-2 flex-wrap" style={{ borderColor: "var(--color-divider)" }}>
          <div>
            <h1 className="mb-1.5">Explore gemstones</h1>
            <div className="text-[13px] opacity-60">
              <span className="font-semibold" style={{ color: "var(--color-accent)" }}>
                {filtered.length}
              </span>{" "}
              stones match your filters
            </div>
          </div>
          <div className="flex gap-3.5 items-center text-[12.5px]">
            <span className="opacity-55">Sort</span>
            <Seg
              value={sort}
              onChange={setSort}
              options={[
                { label: "Relevance", value: "relevance" },
                { label: "Price", value: "price" },
                { label: "Carat", value: "carat" },
                { label: "Newest", value: "newest" },
              ]}
            />
          </div>
        </div>

        <GemGrid gems={filtered.slice(0, visible)} cols={4} />
        {visible < filtered.length && (
          <div className="px-8 py-6.5 flex justify-center">
            <button className="btn btn-secondary" style={{ padding: "13px 26px" }} onClick={() => setVisible((v) => v + 24)}>
              LOAD 24 MORE
            </button>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-8 py-16 text-center opacity-60">
            No stones match these filters.{" "}
            <Link href="/explore" className="underline">
              Clear filters
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
