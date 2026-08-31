import type { Gem } from "@/lib/types";
import { GemCard } from "./GemCard";

export function GemGrid({ gems, cols = 4 }: { gems: Gem[]; cols?: number }) {
  return (
    <div
      className="grid divide-x divide-y"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        borderColor: "var(--color-divider)",
      }}
    >
      {gems.map((g) => (
        <div key={g.id} style={{ borderRight: "1px solid var(--color-divider)", borderBottom: "1px solid var(--color-divider)" }}>
          <GemCard gem={g} />
        </div>
      ))}
    </div>
  );
}
