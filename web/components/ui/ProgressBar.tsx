export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}
