"use client";
import clsx from "clsx";

export function Seg<T extends string>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="seg">
      {options.map((opt) => (
        <button key={opt.value} type="button" className={clsx("seg-opt", opt.value === value && "is-active")} onClick={() => onChange(opt.value)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
