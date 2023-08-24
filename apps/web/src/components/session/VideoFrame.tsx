import React, { useState, useRef, useEffect } from "react"
import { Button } from "components/ui"
import YouTubePlayer from "react-player/youtube"
import { useGlobalContext } from "context/global"
import { useMount } from "react-use"

interface Props {
  id: string
}

const VideoFrame: Component<Props> = ({ id }) => {
  const { isAdmin, handleSocketMessage, sendMessage } = useGlobalContext()

  const [isPlaying, setIsPlaying] = useState(false)

  const videUrl = `https://www.youtube.com/watch?v=${id}`

  const videoRef = useRef<YouTubePlayer | null>(null)

  const handleReady = (config: any) => {
    console.log("Config", config)

    console.log("Player", videoRef.current)
  }

  const handleClick = () => {
    videoRef.current!.seekTo(10)
  }

  const handlePause = () => {
    if (isAdmin) sendMessage("video-pause", { time: videoRef.current!.getCurrentTime() })
  }

  const handlePlay = () => {
    if (isAdmin) sendMessage("video-play", { time: videoRef.current!.getCurrentTime() })
  }

  const handleSeek = (time: number) => {
    if (isAdmin) sendMessage("video-seek", { time })
  }

  useMount(() => {
    if (isAdmin) return

    handleSocketMessage("video-pause", (data: any) => {
      videoRef.current!.seekTo(data.time)
    })
  })

  return (
    <div>
      <YouTubePlayer
        ref={videoRef}
        onReady={handleReady}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        url={videUrl}
        muted={!isAdmin}
        playing={true}
      />
    </div>
  )
}

export default VideoFrame
