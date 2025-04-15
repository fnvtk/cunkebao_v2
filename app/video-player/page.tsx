"use client"

import { FourSplitVideoPlayer } from "@/components/video-player/four-split-player"

export default function VideoPlayerPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">四分屏视频播放器</h1>
      <FourSplitVideoPlayer />
    </div>
  )
}

