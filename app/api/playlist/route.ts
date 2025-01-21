import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const playlist = [
    {
      id: "1",
      title: "Drama",
      artist: "My Guy",
      album: "Night Creatures",
      cover: "/images/SD_cover1.png",  // Note the path starts from public
      audio: "/audio/drama.mp3"
    },
    {
      id: "2",
      title: "Holy Moley",
      artist: "My Guy",
      album: "Night Creatures",
      cover: "/images/anothercover.png",
      audio: "/audio/holymoly.mp3"
    },
    {
      id: "3",
      title: "How Could You",
      artist: "My Guy",
      album: "Night Creatures",
      cover: "/images/onecover.png",
      audio: "/audio/howcouldyou.mp3"
    }
    // Add more songs following the same structure
  ]

  console.log('API Route - Sending playlist:', playlist) // Debug log
  
  return NextResponse.json(playlist, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
} 