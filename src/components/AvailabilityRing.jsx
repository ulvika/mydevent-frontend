export default function AvailabilityRing({ percent = 0, className }) {
  const radius = 14
  const stroke = 3

  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI

  const remaining = Math.max(0, percent)
  const progress = circumference - (remaining / 100) * circumference

  let color = "#16a34a"
  if (remaining <= 10) color = "#dc2626"
  else if (remaining <= 30) color = "#f59e0b"

  return (
    <svg viewBox="0 0 28 28" className={className}>
      {/* background ring */}
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx="14"
        cy="14"
      />

      {/* progress ring */}
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        strokeLinecap="round"
        r={normalizedRadius}
        cx="14"
        cy="14"
        transform="rotate(-90 14 14)"
      />

      {/* percentage text */}
      <text
        x="14"
        y="14"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7"
        fontWeight="600"
        fill={color}
      >
        {remaining}%
      </text>
    </svg>
  )
}
