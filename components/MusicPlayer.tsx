"use client"

import React, { useState, useRef, useEffect } from "react"
import type { Song } from "../types/music"
import { ProgressBar } from "./ProgressBar"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"

interface MusicPlayerProps {
  playlist: Song[]
}

export function MusicPlayer({ playlist }: MusicPlayerProps) {
  console.log('MusicPlayer received playlist:', playlist)

  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Make sure we have a valid currentSongIndex
  useEffect(() => {
    if (currentSongIndex >= playlist.length) {
      setCurrentSongIndex(0)
    }
  }, [playlist.length, currentSongIndex])

  const currentSong = playlist[currentSongIndex]
  console.log('Current song:', currentSong)

  // Reset audio state when song changes and autoplay
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      audioRef.current.play()
        .catch(err => console.log("Autoplay failed:", err))
    }
  }, [currentSongIndex])

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleSongEnd)

      // Auto-play when song changes
      if (isPlaying) {
        audio.play().catch(err => console.log("Playback failed:", err))
      }
    }
    return () => {
      if (audioRef.current) {
        const audio = audioRef.current
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleSongEnd)
      }
    }
  }, [currentSongIndex, isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSongEnd = () => {
    console.log('Song ended, playing next')
    handleNext()
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    console.log('Next song clicked. Current index:', currentSongIndex, 'Playlist length:', playlist.length)
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= playlist.length ? 0 : nextIndex
    })
  }

  const handlePrevious = () => {
    console.log('Previous song clicked. Current index:', currentSongIndex)
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = prevIndex - 1
      return nextIndex < 0 ? playlist.length - 1 : nextIndex
    })
  }

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return // Ignore if typing in an input

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) handlePrevious()
          break
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) handleNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, []) // Add necessary dependencies

  // Add volume control
  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolume(newVolume)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <img 
          src={currentSong?.cover || "/placeholder.svg"} 
          alt={`${currentSong?.album || 'Album'} cover`} 
          className="w-full sm:w-24 h-24 rounded-lg object-cover mb-4 sm:mb-0"
        />
        <div className="flex-grow text-center sm:text-left">
          <h2 className="text-xl font-bold truncate">{currentSong?.title}</h2>
          <p className="text-gray-600 truncate">{currentSong?.artist}</p>
          <p className="text-gray-500 truncate">{currentSong?.album}</p>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentSong?.audio}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleSongEnd}
      />

      <div className="mt-6 space-y-4">
        <ProgressBar 
          currentTime={currentTime} 
          duration={duration} 
          onSeek={handleSeek}
        />
        
        <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
          {/* Center play controls */}
          <div className="flex justify-center space-x-4 order-2 sm:order-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePrevious}
              title="Previous (Ctrl + ←)"
            >
              <SkipBack className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Button 
              onClick={togglePlay}
              size="icon"
              title="Play/Pause (Space)"
              className="mx-2"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Play className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNext}
              title="Next (Ctrl + →)"
            >
              <SkipForward className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>

          {/* Volume control */}
          <div className="relative order-1 sm:order-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowVolumeControl(!showVolumeControl)}
              className="relative"
            >
              {volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            
            {showVolumeControl && (
              <div className="absolute bottom-full left-0 sm:left-auto sm:right-0 mb-2 bg-white p-2 rounded-lg shadow-lg flex items-center space-x-2 z-10">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-24"
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                  className="ml-2"
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlist section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Playlist</h3>
        <div className="space-y-2">
          {playlist.map((song, index) => (
            <div 
              key={song.id}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${index === currentSongIndex ? 'bg-gray-100' : ''}`}
              onClick={() => setCurrentSongIndex(index)}
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={song.cover || "/placeholder.svg"} 
                  alt={`${song.album} cover`} 
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


