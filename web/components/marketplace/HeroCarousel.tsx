"use client";
import { useEffect, useState } from "react";
import type { Gem } from "@/lib/types";
import { CaptionChip } from "./PhotoPlate";

export function HeroCarousel({ slides }: { slides: Gem[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden bg-neutral-900" style={{ minHeight: 520 }}>
      <div className="absolute inset-0 flex transition-transform duration-[800ms] ease-[cubic-bezier(.4,0,.2,1)]" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {slides.map((g) => (
          <span key={g.id} className="flex-none w-full h-full bg-cover bg-center grayscale-photo" style={{ backgroundImage: `url(${g.photos[0]})` }} />
        ))}
      </div>
      <div className="absolute top-4 right-5 flex gap-[5px]">
        {slides.map((g, i) => (
          <span key={g.id} className="w-3.5 h-[3px]" style={{ background: i === idx ? "var(--color-accent)" : "rgba(255,255,255,.4)" }} />
        ))}
      </div>
      <div
        className="absolute left-0 bottom-0 right-0 flex justify-between items-end px-5 py-4 text-[10.5px] tracking-wider uppercase text-[#f8f4f4]"
        style={{ background: "linear-gradient(transparent, rgba(32,30,29,.65))" }}
      >
        <span>{slides[idx].title}</span>
        <span>{slides[idx].marketplaceId}</span>
      </div>
    </div>
  );
}
