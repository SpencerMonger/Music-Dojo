"use client"

import { useEffect, useState } from "react"
import { MusicPlayer } from "../components/MusicPlayer"
import type { Song } from "../types/music"

export default function Home() {
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/playlist')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Fetched playlist data:', data) // Debug log
        setPlaylist(data)
      } catch (error) {
        console.error('Error fetching playlist:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch playlist')
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylist()
  }, [])

  // Debug logs
  console.log('Current state:', {
    loading,
    error,
    playlistLength: playlist.length,
    playlist
  })

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      Loading playlist...
    </div>
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  }

  if (!playlist.length) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      No songs in playlist
    </div>
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <MusicPlayer playlist={playlist} />
    </main>
  )
}
