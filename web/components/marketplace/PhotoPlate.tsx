import clsx from "clsx";
import type { ReactNode } from "react";

export function PhotoPlate({ src, grayscale = true, caption, className, aspect = "aspect-square" }: { src: string; grayscale?: boolean; caption?: ReactNode; className?: string; aspect?: string }) {
  return (
    <div className={clsx("relative w-full overflow-hidden flex items-end", aspect, className)}>
      <div className={clsx("absolute inset-0 bg-cover bg-center", grayscale && "grayscale-photo")} style={{ backgroundImage: `url(${src})`, backgroundColor: "#2d2b2b" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(32,30,29,.55) 0%, rgba(32,30,29,.12) 26%, rgba(32,30,29,0) 48%)" }} />
      {caption && <div className="relative z-10 p-3">{caption}</div>}
    </div>
  );
}

export function CaptionChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex uppercase text-[10px] tracking-wider font-semibold px-[7px] py-[3px]"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {children}
    </span>
  );
}
