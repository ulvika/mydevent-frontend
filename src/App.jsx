import { useEffect, useState } from "react"
import EventCard from "./components/EventCard"

import {
  StarIcon,
  TrophyIcon,
  ClockIcon,
  ShoppingCartIcon,
  ListBulletIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline"

export default function App() {

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)
  const [filter, setFilter] = useState("ALLE")
  const [listView, setListView] = useState(true)
  const [pullStart, setPullStart] = useState(null)
  const [pullDistance, setPullDistance] = useState(0)

const fetchEvents = () => {

  return fetch(´${import.meta.env.VITE_API_URL}/me/events´, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => {
      if (res.status === 401) {
        setUnauthorized(true)
        return null
      }
      return res.json()
    })
    .then(data => {

      if (!data) return

      const cached = JSON.parse(localStorage.getItem("eventsCache") || "[]")

      const cachedIds = new Set(cached.map(e => e.id))

      const eventsWithFlag = data.events.map(e => ({
        ...e,
        isNew: !cachedIds.has(e.id)
      }))

      setEvents(eventsWithFlag)

      localStorage.setItem("eventsCache", JSON.stringify(data.events))
      localStorage.setItem("eventsCacheTime", Date.now())

      setLoading(false) 

    }).catch(err => {
      console.error("Fetch error:", err)
      setLoading(false) })
    }




  useEffect(() => {

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")

  // Save token from login redirect
  if (token) {
    localStorage.setItem("token", token)

    // remove token from URL for security
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const cached = localStorage.getItem("eventsCache")
  const cacheTime = Number(localStorage.getItem("eventsCacheTime"))

  if (cached && cacheTime && Date.now() - cacheTime < 3600000) {
    setEvents(JSON.parse(cached))
    setLoading(false)

    fetchEvents()

  } else {

    setLoading(true)
    fetchEvents()

  }

}, [])


const handleTouchStart = (e) => {
  if (window.scrollY === 0) {
    setPullStart(e.touches[0].clientY)
  }
}

const handleTouchMove = (e) => {
  if (!pullStart) return

  const distance = e.touches[0].clientY - pullStart
  if (distance > 0) {
    setPullDistance(distance)
  }
}

const handleTouchEnd = async () => {
  if (pullDistance > 80) {
    await fetchEvents()
  }

  setPullStart(null)
  setPullDistance(0)
}


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

  const now = new Date()

  const filteredEvents = events.filter(event => {

  const sellDate = new Date(event.start_sell)
  const diffDays = (sellDate - now) / (1000 * 60 * 60 * 24)

      if (filter === "FAVORITTER") {
        return event.status === "INTERESSERT" || event.status === "PÅMELDT"
      }

      if (filter === "STORE") {
        return event.restrictions === 0 || event.restrictions > 450
      }

      if (filter === "SNART") {
        return sellDate > now && diffDays <= 5
      }

      if (filter === "SALG!") {
        return sellDate <= now
      }

  return true
})

if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <img src="/icons/mydevent-1024.png" className="w-48 mb-6 opacity-90"/>
        <p>Laster ned stevner...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="gap-2  space-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 mb-0">
            <img
              src="/icons/mydevent-192.png"
              alt="MyDevent"
              className="w-12 h-12"
            />
        <h1 className="text-xl font-semibold">
          My Devent
        </h1>
        </div>
        <div className="space-x-10 flex-col">
          <button
          onClick={() => setListView(!listView)}
          className="p-2 rounded-lg"
        >
          {listView
            ? <ListBulletIcon className="w-6 h-6"/>
            : <Squares2X2Icon className="w-6 h-6"/>
          }
        </button>
        </div>
      </div>

      <div className="flex gap-x-0.5 overflow-x-auto pb-1 mb-0">

      <button
        onClick={() => setFilter("ALLE")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
        filter === "ALLE" ?  "text-blue-500" : ""
      }`}
      >
        <ListBulletIcon className="w-4 h-4" />
        Alle
      </button>

      <button
        onClick={() => setFilter("FAVORITTER")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
        filter === "FAVORITTER" ?  "text-blue-500" : ""
      }`}
      >
        <StarIcon className="w-4 h-4" />
        Favoritter
      </button>

      <button
        onClick={() => setFilter("STORE")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
        filter === "STORE" ?  "text-blue-500" : ""
      }`}
      >
        <TrophyIcon className="w-4 h-4" />
        Store
      </button>

      <button
        onClick={() => setFilter("SNART")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
        filter === "SNART" ?  "text-blue-500" : ""
        }`}
      >
        <ClockIcon className="w-4 h-4" />
        Snart
      </button>

      <button
        onClick={() => setFilter("SALG!")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
        filter === "SALG!" ?  "text-blue-500" : ""
        }`}
      >
        <ShoppingCartIcon className="w-4 h-4" />
       Salg!
      </button>

    </div>
        </div>

    <div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>

  {pullDistance > 20 && (
    <div className="flex justify-center py-2 text-gray-500 text-sm">
      Oppdaterer...
    </div>
  )}

  <div className="space-y-3">
    {filteredEvents.map(event => (
      <EventCard
        key={event.id}
        event={event}
        onRefresh={fetchEvents}
        listView={listView}
      />
    ))}
  </div>

</div>
  
      </div>

    </div>
  )

  

}

