"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCw, Layers, Zap } from "lucide-react"

export const FourSplitVideoPlayer = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean[]>([false, false, false, false])
  const [isMuted, setIsMuted] = useState<boolean[]>([false, false, false, false])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTab, setCurrentTab] = useState("standard")

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ]

  const containerRef = useRef<HTMLDivElement>(null)

  // 视频源（示例）
  const videoSources = [
    "/placeholder.svg?height=720&width=1280",
    "/placeholder.svg?height=720&width=1280",
    "/placeholder.svg?height=720&width=1280",
    "/placeholder.svg?height=720&width=1280",
  ]

  const togglePlay = (index: number) => {
    const newIsPlaying = [...isPlaying]
    if (videoRefs[index].current) {
      if (isPlaying[index]) {
        videoRefs[index].current?.pause()
      } else {
        videoRefs[index].current?.play()
      }
      newIsPlaying[index] = !newIsPlaying[index]
      setIsPlaying(newIsPlaying)
    }
  }

  const toggleMute = (index: number) => {
    const newIsMuted = [...isMuted]
    if (videoRefs[index].current) {
      videoRefs[index].current.muted = !videoRefs[index].current.muted
      newIsMuted[index] = !newIsMuted[index]
      setIsMuted(newIsMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleVideoClick = (index: number) => {
    setActiveVideo(activeVideo === index ? null : index)
  }

  const refreshVideo = (index: number) => {
    if (videoRefs[index].current) {
      videoRefs[index].current.currentTime = 0
      videoRefs[index].current.play()
      const newIsPlaying = [...isPlaying]
      newIsPlaying[index] = true
      setIsPlaying(newIsPlaying)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div className="flex flex-row h-[calc(100vh-6rem)]" ref={containerRef}>
      {/* 左侧实验性功能菜单 */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
        <h3 className="text-lg font-medium mb-4">实验性功能</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Zap className="mr-2 h-4 w-4" />
            智能分析
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Layers className="mr-2 h-4 w-4" />
            多层检测
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <RotateCw className="mr-2 h-4 w-4" />
            自动轮播
          </Button>
        </div>
        <div className="mt-auto">
          <Button variant="secondary" className="w-full">
            应用实验功能
          </Button>
        </div>
      </div>

      {/* 中间视频区域 */}
      <div className="flex-1 p-4 bg-gray-50">
        <div className={`grid ${activeVideo !== null ? "grid-cols-1" : "grid-cols-2"} gap-4 h-full`}>
          {activeVideo !== null ? (
            <div className="relative">
              <video
                ref={videoRefs[activeVideo]}
                src={videoSources[activeVideo]}
                className="w-full h-full object-cover rounded-md"
                onClick={() => handleVideoClick(activeVideo)}
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/50 text-white p-2 rounded">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => togglePlay(activeVideo)}>
                    {isPlaying[activeVideo] ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => toggleMute(activeVideo)}>
                    {isMuted[activeVideo] ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => refreshVideo(activeVideo)}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            videoSources.map((src, index) => (
              <div key={index} className="relative">
                <video
                  ref={videoRefs[index]}
                  src={src}
                  className="w-full h-full object-cover rounded-md"
                  onClick={() => handleVideoClick(index)}
                />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/50 text-white p-1 rounded text-xs">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white"
                      onClick={() => togglePlay(index)}
                    >
                      {isPlaying[index] ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white"
                      onClick={() => toggleMute(index)}
                    >
                      {isMuted[index] ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    </Button>
                  </div>
                  <span>视频 {index + 1}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 右侧标准菜单 */}
      <div className="w-72 bg-white border-l border-gray-200">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">标准功能</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
          </TabsList>
          <TabsContent value="standard" className="p-4">
            <div className="space-y-4">
              <Card className="p-3">
                <h4 className="font-medium mb-2">视频信息</h4>
                <div className="text-sm space-y-1">
                  <p className="flex justify-between">
                    <span>分辨率:</span> <span>1280x720</span>
                  </p>
                  <p className="flex justify-between">
                    <span>帧率:</span> <span>30fps</span>
                  </p>
                  <p className="flex justify-between">
                    <span>码率:</span> <span>2.5Mbps</span>
                  </p>
                </div>
              </Card>

              <Card className="p-3">
                <h4 className="font-medium mb-2">视频控制</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="w-full">
                    全部播放
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    全部暂停
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    全部静音
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    取消静音
                  </Button>
                </div>
              </Card>

              <Card className="p-3">
                <h4 className="font-medium mb-2">布局选择</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="w-full">
                    四分屏
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    单屏
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <div className="space-y-4">
              <Card className="p-3">
                <h4 className="font-medium mb-2">视频设置</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm">画质</label>
                    <select className="w-full mt-1 rounded-md border border-gray-300 p-1 text-sm">
                      <option>高清 (HD)</option>
                      <option>标清 (SD)</option>
                      <option>自动</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm">缓冲时间</label>
                    <select className="w-full mt-1 rounded-md border border-gray-300 p-1 text-sm">
                      <option>2秒</option>
                      <option>5秒</option>
                      <option>10秒</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <h4 className="font-medium mb-2">界面设置</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">显示控制栏</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">自动隐藏控制栏</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">显示时间戳</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

