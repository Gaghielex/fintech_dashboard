import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { formatMoney } from '../../utils/formatCurrency.js'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-canvas/90 px-3 py-2 text-xs backdrop-blur-sm">
      <p className="font-dm-sans text-ink-muted">{payload[0].payload.label}</p>
      <p className="font-dm-mono mt-0.5 font-bold text-primary">
        {formatMoney(payload[0].value, 'AUD', { maxFractionDigits: 0 })}
      </p>
    </div>
  )
}

function YAxisTick({ y, payload }) {
  return (
    <text
      x={0}
      y={y}
      fill="#8b949e"
      fontSize={10}
      textAnchor="start"
      dominantBaseline="middle"
    >
      {`$${(payload.value / 1000).toFixed(0)}k`}
    </text>
  )
}

export function NetWorthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00c896" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#00c896" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#8b949e', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={<YAxisTick />}
          axisLine={false}
          tickLine={false}
          width={52}
          domain={[0, 'auto']}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#00c896"
          strokeWidth={2}
          fill="url(#netWorthGradient)"
          dot={{ fill: '#00c896', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#00c896', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
