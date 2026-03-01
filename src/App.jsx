import { useEffect, useState } from "react"
import EventCard from "./components/EventCard"

export default function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    fetch("https://mydevent-api-vu.fly.dev/me/events", {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          setUnauthorized(true)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data) setEvents(data.events)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <a
          href="https://mydevent-api-vu.fly.dev/auth/google"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Sign in with Google
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <h1 className="text-2xl font-bold">MyDevent</h1>

        {loading && <p>Loading...</p>}

        {!loading && events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}