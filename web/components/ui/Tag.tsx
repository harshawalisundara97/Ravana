import clsx from "clsx";
import type { ReactNode } from "react";

export function Tag({ children, variant = "neutral", className }: { children: ReactNode; variant?: "accent" | "neutral" | "outline"; className?: string }) {
  return <span className={clsx("tag", `tag-${variant}`, className)}>{children}</span>;
}
