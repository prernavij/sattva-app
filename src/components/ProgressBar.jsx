export default function ProgressBar({ value, max, color = '#3D5240', height = 6, className = '' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className={`rounded-full overflow-hidden bg-black/[.08] ${className}`} style={{ height }}>
      <div
        className="progress-bar-fill h-full rounded-full"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
