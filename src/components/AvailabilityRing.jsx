export default function AvailabilityRing({ percent, className }) {
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
    <svg className={className} viewBox="0 0 28 28">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />

      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={progress}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
    </svg>
  )
}
