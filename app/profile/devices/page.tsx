"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Battery, Users, Activity, MapPin, Clock, Target, MoreVertical, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WechatAccount {
  id: string
  nickname: string
  wechatId: string
  friendCount: number
  status: "normal" | "abnormal"
  isOnline: boolean
}

interface Device {
  id: string
  name: string
  imei: string
  status: "online" | "offline"
  battery: number
  friendCount: number
  activePlans: number
  planNames: string[]
  taskCompletion: { completed: number; total: number }
  tags: string[]
  location: string
  owner: string
  lastActive: string
  api: string
  wechatAccounts: WechatAccount[]
}

export default function DeviceManagementPage() {
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline">("all")

  useEffect(() => {
    // 模拟API调用
    const mockDevices: Device[] = [
      {
        id: "1",
        name: "设备 1",
        imei: "sd123123",
        status: "online",
        battery: 13,
        friendCount: 866,
        activePlans: 2,
        planNames: ["计划1", "计划2"],
        taskCompletion: { completed: 23, total: 52 },
        tags: ["高效", "稳定"],
        location: "北京",
        owner: "张三",
        lastActive: "刚刚",
        api: "https://api.ckb.com/device1",
        wechatAccounts: [
          {
            id: "1",
            nickname: "老张",
            wechatId: "wxid_abc123",
            friendCount: 523,
            status: "normal",
            isOnline: true,
          },
          {
            id: "2",
            nickname: "老李",
            wechatId: "wxid_xyz789",
            friendCount: 343,
            status: "normal",
            isOnline: false,
          },
        ],
      },
      {
        id: "2",
        name: "设备 2",
        imei: "sd456456",
        status: "online",
        battery: 78,
        friendCount: 1245,
        activePlans: 3,
        planNames: ["计划A", "计划B", "计划C"],
        taskCompletion: { completed: 45, total: 60 },
        tags: ["活跃", "高产"],
        location: "上海",
        owner: "李四",
        lastActive: "5分钟前",
        api: "https://api.ckb.com/device2",
        wechatAccounts: [
          {
            id: "3",
            nickname: "小王",
            wechatId: "wxid_def456",
            friendCount: 678,
            status: "normal",
            isOnline: true,
          },
        ],
      },
      {
        id: "3",
        name: "设备 3",
        imei: "sd789789",
        status: "offline",
        battery: 0,
        friendCount: 432,
        activePlans: 0,
        planNames: [],
        taskCompletion: { completed: 12, total: 30 },
        tags: ["维护中"],
        location: "广州",
        owner: "王五",
        lastActive: "2小时前",
        api: "https://api.ckb.com/device3",
        wechatAccounts: [
          {
            id: "4",
            nickname: "小刘",
            wechatId: "wxid_ghi789",
            friendCount: 432,
            status: "abnormal",
            isOnline: false,
          },
        ],
      },
    ]
    setDevices(mockDevices)
  }, [])

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.wechatAccounts.some((acc) => acc.wechatId.includes(searchTerm))
    const matchesStatus = statusFilter === "all" || device.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getBatteryColor = (battery: number) => {
    if (battery < 20) return "text-red-500"
    if (battery < 50) return "text-yellow-500"
    return "text-green-500"
  }

  const getCompletionPercentage = (completion: { completed: number; total: number }) => {
    return Math.round((completion.completed / completion.total) * 100)
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-[390px] mx-auto bg-white">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">设备管理</h1>
              <Button size="sm" className="rounded-full">
                <Plus className="w-4 h-4 mr-1" />
                添加设备
              </Button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索设备名、IMEI或微信号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="rounded-full"
              >
                全部
              </Button>
              <Button
                variant={statusFilter === "online" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("online")}
                className="rounded-full"
              >
                在线
              </Button>
              <Button
                variant={statusFilter === "offline" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("offline")}
                className="rounded-full"
              >
                离线
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {filteredDevices.map((device) => (
            <Card
              key={device.id}
              className="p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/devices/${device.id}`)}
            >
              {/* 设备名称和状态 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{device.name}</h3>
                  <Badge
                    variant={device.status === "online" ? "success" : "secondary"}
                    className="rounded-full text-xs"
                  >
                    {device.status === "online" ? "在线" : "离线"}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>查看详情</DropdownMenuItem>
                    <DropdownMenuItem>编辑设备</DropdownMenuItem>
                    <DropdownMenuItem>设备设置</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 核心指标一行显示 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  {/* 电量 */}
                  <div className="flex items-center space-x-1">
                    <Battery className={`w-4 h-4 ${getBatteryColor(device.battery)}`} />
                    <span className={`text-sm font-medium ${getBatteryColor(device.battery)}`}>{device.battery}%</span>
                  </div>

                  {/* 好友数 */}
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">{device.friendCount}</span>
                  </div>

                  {/* 活跃计划 */}
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-purple-500">{device.activePlans}</span>
                  </div>

                  {/* 任务完成率 */}
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-500">
                      {getCompletionPercentage(device.taskCompletion)}%
                    </span>
                  </div>
                </div>

                {/* 最后活跃时间 */}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{device.lastActive}</span>
                </div>
              </div>

              {/* 计划名称 */}
              {device.planNames.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">活跃计划:</div>
                  <div className="text-sm text-gray-700">{device.planNames.join(", ")}</div>
                </div>
              )}

              {/* 任务详情 */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">任务完成:</div>
                <div className="text-sm text-gray-700">
                  {device.taskCompletion.completed}/{device.taskCompletion.total}
                  <span className="text-gray-500 ml-1">({getCompletionPercentage(device.taskCompletion)}%)</span>
                </div>
              </div>

              {/* 标签 */}
              {device.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {device.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 底部信息 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{device.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">设备归属: {device.owner}</span>
                </div>
              </div>

              {/* API信息 */}
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">API端点:</div>
                <div className="text-xs font-mono text-gray-700 break-all">{device.api}</div>
              </div>

              {/* 微信账号摘要 */}
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">关联微信账号:</div>
                <div className="space-y-1">
                  {device.wechatAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${account.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                        ></div>
                        <span className="font-medium">{account.nickname}</span>
                        <span className="text-gray-500">({account.wechatId})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{account.friendCount}好友</span>
                        <Badge
                          variant={account.status === "normal" ? "outline" : "destructive"}
                          className="text-xs rounded-full"
                        >
                          {account.status === "normal" ? "正常" : "异常"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          {filteredDevices.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">没有找到匹配的设备</div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                添加新设备
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
