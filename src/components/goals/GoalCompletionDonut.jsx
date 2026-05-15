/**
 * Small ring showing % of goal target funded (allocated / target).
 * @param {{
 *   percent: number,
 *   accent?: string,
 *   size?: number,
 * }} props
 */
export function GoalCompletionDonut({ percent, accent = 'teal', size = 36 }) {
  const pct = Math.min(100, Math.max(0, Number(percent) || 0))
  const stroke = 3
  const r = (size - stroke) / 2
  const cx = size / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct / 100)
  const isGold = String(accent).toLowerCase() === 'gold'
  const ringClass = isGold ? 'text-accent-gold' : 'text-primary'

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(pct)}% of goal completed`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          className="text-surface-1"
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          className={ringClass}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="font-dm-mono pointer-events-none absolute inset-0 flex items-center justify-center text-[9px] font-bold leading-none tabular-nums text-ink">
        {Math.round(pct)}%
      </span>
    </div>
  )
}
