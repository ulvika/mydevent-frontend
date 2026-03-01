export default function EventCard({ event }) {
  const now = new Date()
  const sellDate = new Date(event.start_sell)

  const diffMs = sellDate - now
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  let saleState = "FUTURE"

  if (sellDate <= now) {
    saleState = "OPEN"
  } else if (diffDays <= 5) {
    saleState = "SOON"
  }

  const stripeColor =
    saleState === "OPEN"
      ? "border-green-500"
      : saleState === "SOON"
      ? "border-yellow-400"
      : "border-gray-200"

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-4 border-l-4 ${stripeColor} space-y-2`}>
      <h2 className="font-semibold">{event.name}</h2>
      <p className="text-sm text-gray-500">{event.club}</p>

      {saleState === "OPEN" && (
        <p className="text-green-600 font-medium">SALE OPEN</p>
      )}

      {saleState === "SOON" && (
        <p className="text-yellow-600 font-medium">
          Opens in {Math.ceil(diffDays)} days
        </p>
      )}

      {saleState === "FUTURE" && (
        <p className="text-gray-500 text-sm">
          Opens {sellDate.toLocaleString()}
        </p>
      )}

      {event.status && (
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
          event.status === "PÅMELDT"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {event.status}
        </span>
      )}
    </div>
  )
}