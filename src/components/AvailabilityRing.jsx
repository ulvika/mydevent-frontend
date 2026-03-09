export default function AvailabilityRing({ percent }) {
  const radius = 14
  const stroke = 3

  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI

  const remaining = Math.max(0, percent)
  const progress = circumference - (remaining / 100) * circumference

  let color = "#16a34a"   // green

  if (remaining <= 10) color = "#dc2626"
  else if (remaining <= 30) color = "#f59e0b"

  return (
    <svg height={radius * 2} width={radius * 2}>
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