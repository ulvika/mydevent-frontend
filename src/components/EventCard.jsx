import { useState } from "react"
import AvailabilityRing from "./AvailabilityRing"

import {
  ArrowTopRightOnSquareIcon,
  TrophyIcon,
  CalendarDaysIcon,
  NoSymbolIcon
} from "@heroicons/react/24/outline"

import { ClockIcon } from "@heroicons/react/24/outline"
import {
  StarIcon as StarSolid,
  BellIcon as BellSolid
} from "@heroicons/react/24/solid"

import {
  StarIcon as StarOutline,
  BellIcon as BellOutline
} from "@heroicons/react/24/outline"



export default function EventCard({ event, onRefresh, listView }) {
  const now = new Date()
  const sellDate = new Date(event.start_sell)

  const diffMs = sellDate - now
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  const remaining = Math.max(0, 100 - Math.round(event.total_percentage))

  const hasRestrictions = event.restrictions > 0

  let saleState = "FUTURE"
  const saleOpen = saleState === "OPEN"
  const soldOut = saleOpen && hasRestrictions && remaining === 0

  const backgroundColor = event.busy ? "bg-gray-200 grayscale-[20%]" : "bg-white"

  const opacity = event.busy ? "opacity-80" : ""

  

  let progressColor = "text-green-600"

  if (sellDate <= now) {
    saleState = "OPEN"
  } else if (diffDays <= 5) {
    saleState = "SOON"
  }

  const stripeColor =
  event.busy
    ? "border-gray-700"
    : soldOut
    ? "border-red-600"
    : event.status === "PÅMELDT"
    ? "border-blue-600"
    : saleState === "OPEN"
    ? "border-green-500"
    : saleState === "SOON"
    ? "border-yellow-400"
    : "border-gray-400"

  function getEventSizeLabel(restrictions) {
  if (!restrictions || restrictions === 0) return "Ubegrenset"
  if (restrictions <= 200) return "Lite stevne"
  if (restrictions < 450) return "Mellomstor stevne"
  return "Stort stevne"
  }



  

  if (remaining <= 10) progressColor = "text-red-600"
  else if (remaining <= 30) progressColor = "text-yellow-600"

  function formatEventDates(startDate, days) {
  const start = new Date(startDate)

  const end = new Date(start)
  end.setDate(start.getDate() + days - 1)

  const sameMonth = start.getMonth() === end.getMonth()

  if (days === 1) {
    return start.toLocaleDateString("no-NO", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  if (sameMonth) {
    const month = start.toLocaleDateString("no-NO", { month: "short" })
    return `${start.getDate()}–${end.getDate()} ${month} ${start.getFullYear()}`
  }

  const startStr = start.toLocaleDateString("no-NO", {
    day: "numeric",
    month: "short"
  })

  const endStr = end.toLocaleDateString("no-NO", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })

  return `${startStr} – ${endStr}`
}

  async function toggleFavorite() {
    const url =
      (event.status === "INTERESSERT" ||  event.status === "PÅMELDT")
        ? "/events/" + event.id + "/interested"
        : "/events/" + event.id + "/interested";

    const method =
      (event.status === "INTERESSERT" ||  event.status === "PÅMELDT") 
      ? "DELETE" 
      : "POST";

    await fetch(`https://api.mydevent.app${url}`, {
    method,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })

    await onRefresh();   
  }

  async function toggleNotification() {
  const method = event.calendar_event_id ? "DELETE" : "POST"

  await fetch(`https://api.mydevent.app/events/${event.id}/notification`, {
  method: "POST",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
})

  await onRefresh()
}

  const handlePameldt = async () => {
    await fetch(`https://api.mydevent.app/events/${event.id}/pameldt`, {
      method: "POST",
      credentials: "include"
    })
    await onRefresh();
  }
  

  return (
    

    <div className={`relative ${backgroundColor} ${opacity} rounded-2xl shadow-sm p-4 border-l-4 active:scale-[0.99] transition ${stripeColor} space-y-3`}>

      <div className="flex items-center gap-2 min-w-0">

      {event.busy ? (
        <div className="relative flex-shrink-0">
          <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
          <NoSymbolIcon className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
        </div>
      ) : (
        <TrophyIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
      )}

      <h2 className="font-semibold text-lg truncate">
        {event.name}
        {event.isNew && (
        <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
          NYTT
        </span>
      )}
        </h2>

    </div>


      <div className="absolute -top-1 right-1 flex items-center gap-3">
      <div className="absolute -top-1 right-1 flex gap-2">

    <a
      href={`https://ag.devent.no/public/event/${event.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500"
    >
    <ArrowTopRightOnSquareIcon className="w-6 h-6" />
    </a>


      {/* Favorite */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite()
        }}
      className="p-2 cursor-pointer"
      >
        {(event.status === "INTERESSERT" || event.status === "PÅMELDT") ? (
          <StarSolid className="w-6 h-6 text-yellow-400 hover:scale-120 active:scale-125 transition transform duration-200"/>
        ) : (
          <StarOutline className="w-6 h-6 text-gray-400 hover:scale-120 active:scale-125 transition transform duration-150" />
        )}
      </button>

      {/* Notification */}
      {(event.status === "INTERESSERT" || event.status === "PÅMELDT") && (
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite()
        }}
      className="p-2 cursor-pointer"
      >
        {event.calendar_event_id ? (
          <BellSolid className="w-6 h-6 text-blue-500 hover:scale-120 active:scale-125 transition transform duration-200" />
        ) : (
          <BellOutline className="w-6 h-6 text-gray-400 hover:scale-120 active:scale-125 transition transform duration-150" />
        )}
      </button>
    )}
</div>
      {/* Availability ring */}
      {saleOpen && event.restrictions > 0 && (
        <AvailabilityRing percent={remaining} />
      )}

    </div>

    <p className="text-sm font-medium text-gray-700">
      {formatEventDates(event.start_date, event.days)}
    </p>

    { listView && (
      <div className="m-0 p-0">


    <p className="text-sm text-gray-500">
      {event.club}
    </p>

 

    {saleOpen && hasRestrictions && !soldOut && (
    <p className={`text-sm ${progressColor}`}>
        {getEventSizeLabel(event.restrictions)} • {remaining}% ledig
      </p>
    )}

    {saleOpen && hasRestrictions && soldOut && (
      <p className="text-red-600 font-semibold">
        {getEventSizeLabel(event.restrictions)} • FULLTEGNET
      </p>
    )}

    {!saleOpen && (
      <p className="text-sm text-gray-500">
        {getEventSizeLabel(event.restrictions)}
      </p>
    )}

      {saleState === "OPEN" && event.status !== "PÅMELDT" &&  !soldOut && (
        <p className="text-green-600 font-medium">SALG ER ÅPENT</p>
      )}

      {saleState === "SOON" && (
        <p className="flex items-center gap-1 text-yellow-600 font-medium">
          <ClockIcon className="w-4 h-4 animate-pulse"/>
          Åpner om {Math.ceil(diffDays)} dag{diffDays > 1 ? "er" : ""}
        </p>
      )}

      {saleState === "FUTURE" && (
        <p className="text-gray-500 text-sm">
          Åpner {sellDate.toLocaleString()}
        </p>
      )}

      

      </div>
    )}

    {event.status === "PÅMELDT" && (
        <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          PÅMELDT
        </span>
      )}

      {/* Action Buttons */}
      {event.status === "INTERESSERT" && (
      <div className="pt-2">
        <button
          onClick={handlePameldt}
          className="mt-2 w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
        >
          PÅMELDT?
        </button>
      </div>
    )}
    </div>
  )
}



