"use client";
import clsx from "clsx";

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={clsx("toggle", on && "is-on")} onClick={() => onChange(!on)}>
      <span className="knob" />
    </button>
  );
}
