"use client"

import { useEffect, useState } from "react"
import { MusicPlayer } from "../components/MusicPlayer"
import type { Song } from "../types/music"

export default function Home() {
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
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
        setPlaylist(data)
        setCurrentSong(data[0]) // Set initial song
      } catch (error) {
        console.error('Error fetching playlist:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch playlist')
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylist()
  }, [])

  const handleSongChange = (song: Song) => {
    setCurrentSong(song)
  }

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background GIF with overlay */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Dark overlay */}
        {currentSong && (
          <img
            src={currentSong.background}
            alt="Background"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <main className="relative z-20 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <MusicPlayer 
          playlist={playlist} 
          onSongChange={handleSongChange}
        />
      </main>
    </div>
  )
}
