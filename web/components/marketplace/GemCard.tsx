import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Gem } from "@/lib/types";
import { getSeller } from "@/lib/data";
import { usdt } from "@/lib/format";
import { PhotoPlate, CaptionChip } from "./PhotoPlate";

export function GemCard({ gem }: { gem: Gem }) {
  const seller = getSeller(gem.sellerId);
  return (
    <Link href={`/gems/${gem.id}`} className="flex flex-col text-left no-underline" style={{ color: "var(--color-text)" }}>
      <PhotoPlate
        src={gem.photos[0]}
        caption={
          gem.auction ? (
            <CaptionChip>Lot {gem.auction.lotNumber} of {gem.auction.lotsTotal}</CaptionChip>
          ) : gem.status === "sold" ? (
            <CaptionChip>Sold</CaptionChip>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-1.5 p-3.5 sm:p-4">
        <h3 className="text-[16px] font-extrabold leading-tight m-0">{gem.title}</h3>
        <p className="text-xs opacity-60 m-0">
          {gem.carat} ct · {gem.origin} · {gem.cut}
        </p>
        <p className="m-0">
          <span className="text-[18px] font-extrabold">{usdt(gem.price)}</span>{" "}
          <span className="text-[11px] tracking-wider opacity-55">USDT</span>
        </p>
        {seller && (
          <p className="flex items-center gap-1 text-[11.5px] opacity-70 m-0">
            <ShieldCheck size={13} strokeWidth={2.4} /> {seller.name}
          </p>
        )}
      </div>
    </Link>
  );
}
