import { useEffect, useState } from "react"

export default function Settings({ onBack }) {
  const [dogs, setDogs] = useState([])
  const [dogId, setDogId] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("token")

  const fetchDogs = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/dogs`, {
      headers: { Authorization: "Bearer " + token }
    })

    const data = await res.json()
    setDogs(data.dogs || [])
  }

  useEffect(() => {
    fetchDogs()
  }, [])

  // 🎯 Add dog
  const addDog = async () => {
    if (!dogId.trim()) return

    setLoading(true)

    await fetch(`${import.meta.env.VITE_API_URL}/dogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        dogId: dogId.trim(),
        name: name.trim()
      })
    })

    setDogId("")
    setName("")
    setLoading(false)

    fetchDogs()
  }

  // 🎯 Delete dog (FIXED: uses dog_id)
  const deleteDog = async (dogId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/dogs/${dogId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    })

    fetchDogs()
  }

  return (
    <div className="p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack}>←</button>
        <h2 className="font-semibold text-lg">My Dogs</h2>
        <div />
      </div>

      {/* Add dog */}
      <div className="space-y-2">

        <input
          placeholder="Dog ID (required)"
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

        <button
          onClick={addDog}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add dog"}
        </button>
      </div>

      {/* Empty state */}
      {dogs.length === 0 && (
        <div className="text-sm text-gray-500">
          No dogs yet. Add your first dog 👇
        </div>
      )}

      {/* Dogs list */}
      <div className="space-y-2">
        {dogs.map(d => (
          <div
            key={d.dog_id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <div className="font-medium">
                {d.name || "No name"}
              </div>
              <div className="text-xs text-gray-500">
                {d.dog_id}
              </div>
            </div>

            <button
              onClick={() => deleteDog(d.dog_id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}