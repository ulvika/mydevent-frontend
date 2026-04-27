import { useState } from "react"

export default function AddDog({ onAdded }) {
  const [dogId, setDogId] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState(null)

  const handleAdd = async () => {
    setError(null)

    const token = localStorage.getItem("token")

    const res = await fetch(`${import.meta.env.VITE_API_URL}/dogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ dogId, name })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Failed")
      return
    }

    setDogId("")
    setName("")
    onAdded?.()
  }

  return (
    <div className="space-y-2">
      <input
        placeholder="Dog ID (NOxxxxx/yy)"
        value={dogId}
        onChange={e => setDogId(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Name (optional)"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        onClick={handleAdd}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Add dog
      </button>
    </div>
  )
}