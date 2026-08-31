"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Gem } from "@/lib/types";
import { usdt } from "@/lib/format";
import { Seg } from "@/components/ui/Seg";

const STATUS_LABEL: Record<Gem["status"], string> = { live: "Live", in_review: "In review", reserved: "Reserved", draft: "Draft", sold: "Sold" };
const STATUS_CLASS: Record<Gem["status"], string> = { live: "tag-accent", in_review: "tag-outline", reserved: "tag-outline", draft: "tag-neutral", sold: "tag-neutral" };

type Filter = "all" | Gem["status"];

export function MyGemsClient({ gems }: { gems: Gem[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    let list = gems;
    if (filter !== "all") list = list.filter((g) => g.status === filter);
    if (query) list = list.filter((g) => g.title.toLowerCase().includes(query.toLowerCase()) || g.marketplaceId.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [gems, filter, query]);

  const live = gems.filter((g) => g.status === "live").length;
  const review = gems.filter((g) => g.status === "in_review").length;
  const draft = gems.filter((g) => g.status === "draft").length;

  return (
    <div>
      <div className="flex justify-between items-end gap-5 mb-4.5 flex-wrap">
        <div>
          <h1 className="mb-1.5">My gems</h1>
          <div className="text-[13px] opacity-60">
            {gems.length} listings · {review} in review · {draft} draft
          </div>
        </div>
        <Link href="/sell" className="btn btn-primary" style={{ padding: "13px 20px" }}>
          ADD A GEM
        </Link>
      </div>

      <div className="flex gap-3.5 items-center py-3.5 border-t-2 border-b flex-wrap" style={{ borderColor: "var(--color-divider)" }}>
        <input className="input" style={{ maxWidth: 260 }} placeholder="Search my gems" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Seg
          value={filter}
          onChange={setFilter}
          options={[
            { label: "All", value: "all" as Filter },
            { label: "Live", value: "live" as Filter },
            { label: "In review", value: "in_review" as Filter },
            { label: "Draft", value: "draft" as Filter },
            { label: "Sold", value: "sold" as Filter },
          ]}
        />
        <span className="ml-auto flex gap-2.5 text-[12.5px]">
          <button className="btn btn-secondary" style={{ padding: "9px 14px" }}>
            FEATURE SELECTED
          </button>
          <button className="btn btn-secondary" style={{ padding: "9px 14px" }}>
            EDIT PRICES
          </button>
          <button className="btn btn-secondary" style={{ padding: "9px 14px" }}>
            END LISTING
          </button>
        </span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 34 }}></th>
            <th>Gem</th>
            <th>Marketplace ID</th>
            <th>Price</th>
            <th>Views</th>
            <th>Offers</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.slice(0, 8).map((g) => (
            <tr key={g.id}>
              <td>
                <span className="w-3.5 h-3.5 block" style={{ border: "1px solid var(--color-divider)" }} />
              </td>
              <td>
                <span className="flex items-center gap-2.5">
                  <span className="w-10 h-10 flex-none bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${g.photos[0]})` }} />
                  <span>
                    <span className="font-semibold block">{g.title}</span>
                    <span className="text-[11.5px] opacity-55">{g.carat} ct</span>
                  </span>
                </span>
              </td>
              <td className="text-xs opacity-70">{g.marketplaceId}</td>
              <td className="font-semibold">{usdt(g.price)}</td>
              <td>{g.views}</td>
              <td>{g.offers}</td>
              <td>
                <span className={`tag ${STATUS_CLASS[g.status]}`}>{STATUS_LABEL[g.status]}</span>
              </td>
              <td>
                <Link href={`/gems/${g.id}`} className="text-[12.5px] font-semibold no-underline" style={{ color: "var(--color-accent)" }}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center py-4.5 text-[12.5px]">
        <span className="opacity-60">
          Showing 1–{Math.min(8, filtered.length)} of {gems.length}
        </span>
        <span className="flex gap-2">
          <button className="btn btn-secondary" style={{ padding: "8px 13px" }}>
            PREVIOUS
          </button>
          <button className="btn btn-secondary" style={{ padding: "8px 13px" }}>
            NEXT
          </button>
        </span>
      </div>
    </div>
  );
}
