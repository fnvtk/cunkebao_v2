"use client"

import { useState } from "react"
import { Clock, ChevronLeft, MoreVertical, Copy, Pencil, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { BindDouyinQRCode } from "@/components/BindDouyinQRCode"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { PlanSettingsDialog } from "@/components/acquisition/PlanSettingsDialog"

// 获取渠道中文名称
const getChannelName = (channel: string) => {
  const channelMap: Record<string, string> = {
    douyin: "抖音",
    kuaishou: "快手",
    xiaohongshu: "小红书",
    weibo: "微博",
  }
  return channelMap[channel] || channel
}

interface Task {
  id: string
  name: string
  status: "running" | "paused" | "completed"
  stats: {
    devices: number
    acquired: number
    added: number
  }
  lastUpdated: string
  executionTime: string
  nextExecutionTime: string
  trend: { date: string; customers: number }[]
}

interface DeviceStats {
  active: number
}

export default function ChannelPage({ params }: { params: { channel: string } }) {
  const router = useRouter()
  const channel = params.channel
  const channelName = getChannelName(params.channel)

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: `${channelName}直播获客计划`,
      status: "running",
      stats: {
        devices: 5,
        acquired: 31,
        added: 25,
      },
      lastUpdated: "2024-02-09 15:30",
      executionTime: "2024-02-09 17:24:10",
      nextExecutionTime: "2024-02-09 17:25:36",
      trend: Array.from({ length: 7 }, (_, i) => ({
        date: `2月${String(i + 1)}日`,
        customers: Math.floor(Math.random() * 30) + 30,
      })),
    },
    {
      id: "2",
      name: `${channelName}评论区获客计划`,
      status: "paused",
      stats: {
        devices: 3,
        acquired: 15,
        added: 12,
      },
      lastUpdated: "2024-02-09 14:00",
      executionTime: "2024-02-09 16:30:00",
      nextExecutionTime: "2024-02-09 16:45:00",
      trend: Array.from({ length: 7 }, (_, i) => ({
        date: `2月${String(i + 1)}日`,
        customers: Math.floor(Math.random() * 20) + 20,
      })),
    },
  ])

  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    active: 5,
  })

  const [isPlanSettingsOpen, setIsPlanSettingsOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "running" ? "paused" : "running"
          return { ...task, status: newStatus }
        }
        return task
      }),
    )
  }

  const handleEditPlan = (taskId: string) => {
    console.log(`编辑计划: ${taskId}`)
    console.log(`跳转到: /scenarios/${channel}/edit/${taskId}`)
    router.push(`/scenarios/${channel}/edit/${taskId}`)
  }

  const handleCopyPlan = (taskId: string) => {
    const taskToCopy = tasks.find((task) => task.id === taskId)
    if (taskToCopy) {
      const newTask = {
        ...taskToCopy,
        id: `${Date.now()}`,
        name: `${taskToCopy.name} (副本)`,
        status: "paused" as const,
      }
      setTasks([...tasks, newTask])
      toast({
        title: "计划已复制",
        description: `已成功复制"${taskToCopy.name}"`,
      })
    }
  }

  const handleDeletePlan = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId)
    if (taskToDelete) {
      setTasks(tasks.filter((t) => t.id !== taskId))
      toast({
        title: "计划已删除",
        description: `已成功删除"${taskToDelete.name}"`,
      })
    }
  }

  // 计算通过率
  const calculatePassRate = (acquired: number, added: number) => {
    if (acquired === 0) return 0
    return Math.round((added / acquired) * 100)
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-blue-600">{channelName}获客</h1>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto">
        {tasks.map((task) => {
          const { devices: deviceCount, acquired: acquiredCount, added: addedCount } = task.stats
          const passRate = calculatePassRate(acquiredCount, addedCount)

          return (
            <Card key={task.id} className="p-6 hover:shadow-lg transition-all mb-4 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-lg">{task.name}</h3>
                  <Badge
                    variant={task.status === "running" ? "success" : "secondary"}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setSelectedPlanId(task.id)
                      setIsPlanSettingsOpen(true)
                    }}
                  >
                    {task.status === "running" ? "进行中" : "已暂停"}
                  </Badge>
                  {params.channel === "douyin" && <BindDouyinQRCode />}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full z-10">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-50">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditPlan(task.id)
                      }}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      编辑计划
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyPlan(task.id)
                      }}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制计划
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePlan(task.id)
                      }}
                      className="text-red-600 cursor-pointer hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除计划
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                <Link href={`/scenarios/${channel}/devices`}>
                  <Card className="p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="text-sm text-gray-500 mb-1">设备数</div>
                    <div className="text-2xl font-semibold">{deviceCount}</div>
                  </Card>
                </Link>

                <Link href={`/scenarios/${channel}/acquired`}>
                  <Card className="p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="text-sm text-gray-500 mb-1">已获客</div>
                    <div className="text-2xl font-semibold">{acquiredCount}</div>
                  </Card>
                </Link>

                <Link href={`/scenarios/${channel}/added`}>
                  <Card className="p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="text-sm text-gray-500 mb-1">已添加</div>
                    <div className="text-2xl font-semibold">{addedCount}</div>
                  </Card>
                </Link>

                <Card className="p-2">
                  <div className="text-sm text-gray-500 mb-1">通过率</div>
                  <div className="text-2xl font-semibold">{passRate}%</div>
                </Card>
              </div>

              <div className="h-48 bg-white rounded-lg p-4 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={task.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      name="获客数"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-sm border-t pt-4 text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>上次执行：{task.executionTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>下次执行：{task.nextExecutionTime}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <PlanSettingsDialog open={isPlanSettingsOpen} onOpenChange={setIsPlanSettingsOpen} planId={selectedPlanId} />
    </div>
  )
}

