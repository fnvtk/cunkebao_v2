"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  Clock,
  ThumbsUp,
  Calendar,
  Settings,
  Target,
  MapPin,
  User,
  Bell,
  Info,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UserProfile {
  id: string
  name: string
  avatar: string
  region?: string
  tags?: string[]
  lastActive?: string
}

interface TimeRange {
  start: string
  end: string
}

export default function AutoLikePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  // 通用设置
  const [enableAutoLike, setEnableAutoLike] = useState(true)
  const [likeInterval, setLikeInterval] = useState(5)
  const [maxLikesPerDay, setMaxLikesPerDay] = useState(50)
  const [likeOldContent, setLikeOldContent] = useState(false)
  const [contentTypes, setContentTypes] = useState<string[]>(["moments"])
  const [userGroup, setUserGroup] = useState("all")

  // 定时点赞设置
  const [enableScheduledLike, setEnableScheduledLike] = useState(true)
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{ start: "06:00", end: "08:00" }])
  const [likeQuantity, setLikeQuantity] = useState(20)

  // 指定人点赞设置
  const [enableTargetedLike, setEnableTargetedLike] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // 地区和标签点赞设置
  const [enableRegionTagLike, setEnableRegionTagLike] = useState(false)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 统计数据
  const [deviceCount, setDeviceCount] = useState(10)
  const [totalLikesGiven, setTotalLikesGiven] = useState(0)
  const [totalInteractions, setTotalInteractions] = useState(0)

  // 计算Y轴最大值
  const yAxisMax = deviceCount * 20

  // 模拟数据
  const [trendData] = useState([
    { date: "周一", likes: Math.floor(Math.random() * yAxisMax * 0.8) },
    { date: "周二", likes: Math.floor(Math.random() * yAxisMax * 0.8) },
    { date: "周三", likes: Math.floor(Math.random() * yAxisMax * 0.8) },
    { date: "周四", likes: Math.floor(Math.random() * yAxisMax * 0.8) },
    { date: "周五", likes: Math.floor(Math.random() * yAxisMax * 0.8) },
    { date: "周六", likes: Math.floor(Math.random() * yAxisMax * 0.8) },
    { date: "周日", likes: Math.floor(Math.random() * yAxisMax * 0.8) },
  ])

  // 模拟用户数据
  const userProfiles: UserProfile[] = Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    name: `用户${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    region: ["北京", "上海", "广州", "深圳", "杭州"][Math.floor(Math.random() * 5)],
    tags: ["活跃", "潜在客户", "高价值", "新用户"][Math.floor(Math.random() * 4)].split(" "),
    lastActive: `${Math.floor(Math.random() * 24)}小时前`,
  }))

  // 地区和标签数据
  const regions = ["北京", "上海", "广州", "深圳", "杭州", "成都", "重庆", "武汉", "南京", "西安"]
  const tags = ["活跃用户", "潜在客户", "高价值客户", "新用户", "老客户", "VIP", "企业客户", "个人用户"]

  // 模拟获取设备数量
  useEffect(() => {
    const fetchDeviceCount = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDeviceCount(10)
      setTotalLikesGiven(Math.floor(Math.random() * 1000))
      setTotalInteractions(Math.floor(Math.random() * 2000))
    }

    fetchDeviceCount()
  }, [])

  // 添加时间范围
  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { start: "12:00", end: "14:00" }])
  }

  // 删除时间范围
  const removeTimeRange = (index: number) => {
    const newRanges = [...timeRanges]
    newRanges.splice(index, 1)
    setTimeRanges(newRanges)
  }

  // 更新时间范围
  const updateTimeRange = (index: number, field: "start" | "end", value: string) => {
    const newRanges = [...timeRanges]
    newRanges[index][field] = value
    setTimeRanges(newRanges)
  }

  // 过滤用户
  const filteredUsers = userProfiles.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.region && user.region.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // 切换用户选择
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // 切换地区选择
  const toggleRegionSelection = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter((r) => r !== region))
    } else {
      setSelectedRegions([...selectedRegions, region])
    }
  }

  // 切换标签选择
  const toggleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // 切换内容类型
  const toggleContentType = (type: string) => {
    if (contentTypes.includes(type)) {
      setContentTypes(contentTypes.filter((t) => t !== type))
    } else {
      setContentTypes([...contentTypes, type])
    }
  }

  // 启动任务
  const handleStart = () => {
    setIsRunning(true)
    // 模拟进度更新
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)
      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsRunning(false)
      }
    }, 500)
  }

  // 停止任务
  const handleStop = () => {
    setIsRunning(false)
  }

  // 保存设置
  const handleSaveSettings = () => {
    // 这里应该是保存设置的API调用
    alert("设置已保存")
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-2 text-lg font-medium">朋友圈自动点赞</h1>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-1" />
                    帮助
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">自动点赞功能可以帮助您提高与好友的互动，增加曝光率。</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={isRunning ? handleStop : handleStart}
            >
              {isRunning ? "停止任务" : "启动任务"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧设置面板 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                点赞设置
              </CardTitle>
              <CardDescription>配置自动点赞的各项参数，满足您的个性化需求</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="general" className="flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">通用设置</span>
                    <span className="sm:hidden">通用</span>
                  </TabsTrigger>
                  <TabsTrigger value="scheduled" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">定时点赞</span>
                    <span className="sm:hidden">定时</span>
                  </TabsTrigger>
                  <TabsTrigger value="targeted" className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">指定人点赞</span>
                    <span className="sm:hidden">指定</span>
                  </TabsTrigger>
                  <TabsTrigger value="region" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">地区标签</span>
                    <span className="sm:hidden">地区</span>
                  </TabsTrigger>
                </TabsList>

                {/* 通用设置 */}
                <TabsContent value="general" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor="enableAutoLike" className="font-medium">
                        启用自动点赞
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">开启后系统将根据设置自动为朋友圈点赞</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch id="enableAutoLike" checked={enableAutoLike} onCheckedChange={setEnableAutoLike} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="likeInterval" className="font-medium">
                        点赞间隔（分钟）
                      </Label>
                      <span className="text-sm text-gray-500">{likeInterval}分钟</span>
                    </div>
                    <Slider
                      id="likeInterval"
                      min={1}
                      max={60}
                      step={1}
                      value={[likeInterval]}
                      onValueChange={(value) => setLikeInterval(value[0])}
                      disabled={!enableAutoLike}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maxLikesPerDay" className="font-medium">
                        每日最大点赞数
                      </Label>
                      <span className="text-sm text-gray-500">{maxLikesPerDay}个</span>
                    </div>
                    <Slider
                      id="maxLikesPerDay"
                      min={10}
                      max={200}
                      step={10}
                      value={[maxLikesPerDay]}
                      onValueChange={(value) => setMaxLikesPerDay(value[0])}
                      disabled={!enableAutoLike}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="likeOldContent" className="font-medium">
                      点赞历史内容
                    </Label>
                    <Switch
                      id="likeOldContent"
                      checked={likeOldContent}
                      onCheckedChange={setLikeOldContent}
                      disabled={!enableAutoLike}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">点赞内容类型</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: "moments", label: "朋友圈" },
                        { id: "comments", label: "评论" },
                        { id: "articles", label: "公众号文章" },
                        { id: "videos", label: "视频" },
                        { id: "images", label: "图片" },
                        { id: "links", label: "链接" },
                      ].map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`content-${type.id}`}
                            checked={contentTypes.includes(type.id)}
                            onCheckedChange={() => toggleContentType(type.id)}
                            disabled={!enableAutoLike}
                          />
                          <Label htmlFor={`content-${type.id}`} className="text-sm">
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userGroup" className="font-medium">
                      用户群体
                    </Label>
                    <Select value={userGroup} onValueChange={setUserGroup} disabled={!enableAutoLike}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择用户群体" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有用户</SelectItem>
                        <SelectItem value="active">活跃用户</SelectItem>
                        <SelectItem value="new">新用户</SelectItem>
                        <SelectItem value="inactive">不活跃用户</SelectItem>
                        <SelectItem value="vip">VIP用户</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* 定时点赞 */}
                <TabsContent value="scheduled" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor="enableScheduledLike" className="font-medium">
                        启用定时点赞
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">在指定时间段内自动点赞朋友圈内容</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch
                      id="enableScheduledLike"
                      checked={enableScheduledLike}
                      onCheckedChange={setEnableScheduledLike}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">点赞时间段</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addTimeRange}
                        disabled={!enableScheduledLike || timeRanges.length >= 5}
                      >
                        添加时间段
                      </Button>
                    </div>

                    {timeRanges.map((range, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={range.start}
                          onChange={(e) => updateTimeRange(index, "start", e.target.value)}
                          className="w-32"
                          disabled={!enableScheduledLike}
                        />
                        <span>至</span>
                        <Input
                          type="time"
                          value={range.end}
                          onChange={(e) => updateTimeRange(index, "end", e.target.value)}
                          className="w-32"
                          disabled={!enableScheduledLike}
                        />
                        {timeRanges.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTimeRange(index)}
                            disabled={!enableScheduledLike}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-red-500"
                            >
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="likeQuantity" className="font-medium">
                        每个时间段点赞数量
                      </Label>
                      <span className="text-sm text-gray-500">{likeQuantity}个</span>
                    </div>
                    <Slider
                      id="likeQuantity"
                      min={5}
                      max={100}
                      step={5}
                      value={[likeQuantity]}
                      onValueChange={(value) => setLikeQuantity(value[0])}
                      disabled={!enableScheduledLike}
                    />
                  </div>
                </TabsContent>

                {/* 指定人点赞 */}
                <TabsContent value="targeted" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor="enableTargetedLike" className="font-medium">
                        启用指定人点赞
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">为指定的好友自动点赞，无论他们何时发布内容</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch
                      id="enableTargetedLike"
                      checked={enableTargetedLike}
                      onCheckedChange={setEnableTargetedLike}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="searchUsers" className="font-medium">
                        搜索好友
                      </Label>
                      <Badge variant="outline">{selectedUsers.length}人已选择</Badge>
                    </div>
                    <Input
                      id="searchUsers"
                      placeholder="输入好友名称或地区搜索"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={!enableTargetedLike}
                    />
                  </div>

                  <ScrollArea className="h-64 border rounded-md">
                    <div className="p-2 space-y-2">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center justify-between p-2 rounded-md ${
                            selectedUsers.includes(user.id) ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">
                                {user.region} · 最近活跃: {user.lastActive}
                              </p>
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => toggleUserSelection(user.id)}
                            disabled={!enableTargetedLike}
                          />
                        </div>
                      ))}
                      {filteredUsers.length === 0 && (
                        <div className="text-center py-4 text-gray-500">未找到匹配的好友</div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* 地区标签点赞 */}
                <TabsContent value="region" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor="enableRegionTagLike" className="font-medium">
                        启用地区标签点赞
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">根据好友的地区和标签进行有针对性的点赞</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch
                      id="enableRegionTagLike"
                      checked={enableRegionTagLike}
                      onCheckedChange={setEnableRegionTagLike}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">选择地区</Label>
                    <div className="flex flex-wrap gap-2">
                      {regions.map((region) => (
                        <Badge
                          key={region}
                          variant={selectedRegions.includes(region) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleRegionSelection(region)}
                        >
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">选择标签</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTagSelection(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings}>保存设置</Button>
            </CardFooter>
          </Card>

          {/* 任务状态卡片 */}
          {isRunning && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  任务进行中
                </CardTitle>
                <CardDescription>自动点赞任务正在执行，您可以随时暂停或停止</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>进度: {progress}%</span>
                    <span>预计剩余时间: {Math.ceil((100 - progress) / 10) * 0.5}分钟</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">今日已点赞</p>
                      <p className="text-xl font-bold">{Math.floor((progress * maxLikesPerDay) / 100)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">目标点赞</p>
                      <p className="text-xl font-bold">{maxLikesPerDay}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">完成率</p>
                      <p className="text-xl font-bold">{progress}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleStop}>
                  暂停任务
                </Button>
                <Button variant="destructive" onClick={handleStop}>
                  停止任务
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* 右侧统计面板 */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <ThumbsUp className="h-5 w-5 mr-2" />
                点赞统计
              </CardTitle>
              <CardDescription>查看自动点赞功能的效果和数据分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, yAxisMax]} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="likes" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">总点赞数</p>
                  <p className="text-2xl font-bold">{totalLikesGiven}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">互动次数</p>
                  <p className="text-2xl font-bold">{totalInteractions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2" />
                活跃好友
              </CardTitle>
              <CardDescription>最近活跃且互动频繁的好友</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {userProfiles.slice(0, 8).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">
                            {user.region} · 最近活跃: {user.lastActive}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.floor(Math.random() * 50) + 10}次互动
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                点赞日历
              </CardTitle>
              <CardDescription>查看每日点赞数量和效果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
                  <div key={day} className="text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 28 }).map((_, i) => {
                  const likesCount = Math.floor(Math.random() * maxLikesPerDay)
                  let bgColor = "bg-gray-100"
                  if (likesCount > maxLikesPerDay * 0.7) bgColor = "bg-green-500"
                  else if (likesCount > maxLikesPerDay * 0.4) bgColor = "bg-green-300"
                  else if (likesCount > maxLikesPerDay * 0.1) bgColor = "bg-green-100"

                  return (
                    <div key={i} className={`aspect-square rounded-sm ${bgColor} flex items-center justify-center`}>
                      <span className="text-xs">{i + 1}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>较少</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                </div>
                <span>较多</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

