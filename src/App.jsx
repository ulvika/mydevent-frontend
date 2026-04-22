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

const APP_VERSION = "1.0.2"



export default function App() {

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)
  const [filter, setFilter] = useState("ALLE")
  const [listView, setListView] = useState(true)
  const [pullStart, setPullStart] = useState(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [debugMode, setDebugMode] = useState(false)
  const [tapCount, setTapCount] = useState(0) 

  async function getTokenWithRetry(retries = 5) {
  for (let i = 0; i < retries; i++) {
    const token = localStorage.getItem("token")
    if (token) return token

    await new Promise(r => setTimeout(r, 50))
  }

  return null
}



const fetchEvents = async () => {
  setLoading(true)

  try {
    const token = await getTokenWithRetry()

    if (!token) {
      setUnauthorized(true)
      setLoading(false) 
      return
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/me/events`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })

    if (res.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("eventsCache")
      localStorage.removeItem("eventsCacheTime")

      setUnauthorized(true)
      setEvents([])       // 🔥 clear UI immediately
      setLoading(false)   // 🔥 prevent ghost UI
      return
    }

    const data = await res.json()

    if (!data?.events) return

    let cached = []
    try {
      cached = JSON.parse(localStorage.getItem("eventsCache") || "[]")
    } catch {
      localStorage.removeItem("eventsCache")
    }

    const cachedIds = new Set(cached.map(e => e.id))

    const eventsWithFlag = data.events.map(e => ({
      ...e,
      isNew: !cachedIds.has(e.id)
    }))

    setEvents(eventsWithFlag)

    localStorage.setItem("eventsCache", JSON.stringify(data.events))
    localStorage.setItem("eventsCacheTime", Date.now())

  } catch (err) {
    console.error("Fetch error:", err)
  } finally {
    setLoading(false)   // ✅ ALWAYS runs
  }
}

useEffect(() => {
  if (tapCount === 0) return

  const timer = setTimeout(() => {
    setTapCount(0)
  }, 1500) // 1.5 seconds window

  return () => clearTimeout(timer)
}, [tapCount])

useEffect(() => {
  const saved = localStorage.getItem("debugMode")
  if (saved === "true") setDebugMode(true)
}, [])

useEffect(() => {
  localStorage.setItem("debugMode", debugMode)
}, [debugMode])

  useEffect(() => {

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")

  if (token) {
    localStorage.setItem("token", token)
    
    // 🔥 CRITICAL: delay + hard reload
  setTimeout(() => {
    window.location.href = window.location.pathname
  }, 50)

    return
  }

  // 🔥 VERSION CHECK
  const storedVersion = localStorage.getItem("appVersion")

  if (storedVersion !== APP_VERSION) {
    console.log("App version changed → clearing cache")

    localStorage.removeItem("eventsCache")
    localStorage.removeItem("eventsCacheTime")
    localStorage.setItem("appVersion", APP_VERSION)
  }

  const cached = localStorage.getItem("eventsCache")
  const cacheTime = Number(localStorage.getItem("eventsCacheTime"))

  if (token && cached && cacheTime && Date.now() - cacheTime < 3600000) {
    try {
      setEvents(JSON.parse(cached))
      setLoading(false)
      fetchEvents() // silent refresh
    } catch {
      localStorage.removeItem("eventsCache")
      setLoading(true)
      fetchEvents()
    }
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

  const handleLogout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("eventsCache")
  localStorage.removeItem("eventsCacheTime")

  window.location.reload()
}

const breakToken = () => {
  localStorage.setItem("token", "invalid")
  window.location.reload()
}

const handleLogoTap = () => {
  setTapCount(prev => {
    const next = prev + 1

    if (next >= 5) {
      setDebugMode(true)
      console.log("DEBUG MODE ENABLED")
      return 0
    }

    return next
  })
}

const disableDebug = () => {
  setDebugMode(false)
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
              onClick={handleLogoTap}
            />
        <h1 className="text-xl font-semibold">
          My Devent
        </h1>
        </div>
        <div className="space-x-10 flex-col">
          {debugMode && (
            <div className="space-y-2">
              <button onClick={handleLogout}>
                Logout
              </button>

              <button onClick={breakToken}>
                Break token
              </button>

              <button onClick={disableDebug}>
                Disable debug
              </button>
            </div>
          )}
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

