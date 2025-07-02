"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ChevronLeft, RefreshCw, Plus, MoreVertical, Battery, Users, MapPin, User, Grid3X3, List } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getDevices, getDeviceStats, type Device, type DeviceStats } from "@/lib/api/devices"

export default function DevicesPage() {
  const { toast } = useToast()
  const router = useRouter()

  // 状态管理 - 确保初始值类型正确
  const [devices, setDevices] = useState<Device[]>([]) // 确保初始值是数组
  const [stats, setStats] = useState<DeviceStats>({ total: 0, online: 0, offline: 0, error: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)

  // 加载设备数据
  const loadDevices = async () => {
    try {
      setIsLoading(true)

      // 并行请求设备列表和统计数据
      const [devicesData, statsData] = await Promise.all([getDevices(), getDeviceStats()])

      // 数据安全检查 - 确保devices是数组
      if (Array.isArray(devicesData)) {
        setDevices(devicesData)
      } else {
        console.error("设备数据不是数组格式:", devicesData)
        setDevices([]) // 设置为空数组
        toast({
          title: "数据格式错误",
          description: "设备数据格式不正确，已重置为空列表",
          variant: "destructive",
        })
      }

      // 统计数据安全检查
      if (statsData && typeof statsData === "object") {
        setStats(statsData)
      } else {
        console.error("统计数据格式错误:", statsData)
        setStats({ total: 0, online: 0, offline: 0, error: 0 })
      }
    } catch (error) {
      console.error("加载设备数据失败:", error)

      // 错误处理 - 设置安全的默认值
      setDevices([])
      setStats({ total: 0, online: 0, offline: 0, error: 0 })

      toast({
        title: "加载失败",
        description: "无法加载设备数据，请检查网络连接或稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDevices()

    // 定时刷新设备状态 - 每30秒刷新一次
    const interval = setInterval(loadDevices, 30000)

    // 清理定时器
    return () => clearInterval(interval)
  }, [])

  // 过滤设备 - 添加安全检查
  const filteredDevices = Array.isArray(devices)
    ? devices.filter((device) => {
        if (!device) return false

        const searchLower = searchTerm.toLowerCase()
        return (
          (device.name && device.name.toLowerCase().includes(searchLower)) ||
          (device.imei && device.imei.toLowerCase().includes(searchLower)) ||
          (device.wechatId && device.wechatId.toLowerCase().includes(searchLower))
        )
      })
    : []

  // 处理设备选择
  const handleDeviceSelect = (deviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices((prev) => [...prev, deviceId])
    } else {
      setSelectedDevices((prev) => prev.filter((id) => id !== deviceId))
    }
  }

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([])
    } else {
      setSelectedDevices(filteredDevices.map((device) => device.id))
    }
  }

  // 获取状态指示器颜色
  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-400"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  // 获取设备型号图标
  const getDeviceModelIcon = (model: string) => {
    if (!model) return "📱"

    if (model.includes("iPhone")) {
      return "📱"
    } else if (model.includes("S23")) {
      return "📱"
    } else if (model.includes("Mi")) {
      return "📱"
    }
    return "📱"
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="flex-1 pb-16 bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-medium">设备管理</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" disabled>
                <RefreshCw className="h-4 w-4 animate-spin" />
              </Button>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600" disabled>
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {/* 加载骨架屏 */}
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 pb-16 bg-gray-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">设备管理</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={loadDevices}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* 统计区域 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">总数</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">在线</div>
              <div className="text-2xl font-bold text-green-600">{stats.online}</div>
            </div>
          </Card>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索设备名称、IMEI或微信号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 筛选区域 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                列表
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                网格
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              已选择 {selectedDevices.length}/{filteredDevices.length}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {selectedDevices.length === filteredDevices.length ? "取消全选" : "全选"}
          </Button>
        </div>

        {/* 设备列表 */}
        {filteredDevices.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">{searchTerm ? "没有找到匹配的设备" : "暂无设备数据"}</div>
            {!searchTerm && (
              <Button className="mt-4 bg-transparent" onClick={loadDevices} variant="outline">
                重新加载
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDevices.map((device) => (
              <Card key={device.id} className="p-4">
                <div className="flex items-center space-x-3">
                  {/* 复选框和状态指示器 */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={(checked) => handleDeviceSelect(device.id, !!checked)}
                    />
                    <div className={`w-2 h-2 rounded-full ${getStatusIndicatorColor(device.status)}`}></div>
                  </div>

                  {/* 设备信息 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{device.name || "未命名设备"}</h3>
                        <span className="text-lg">{getDeviceModelIcon(device.model)}</span>
                        <span className="text-sm text-gray-500">{device.model || "未知型号"}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>编辑设备</DropdownMenuItem>
                          <DropdownMenuItem>重启设备</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">删除设备</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div>IMEI: {device.imei || "未知"}</div>
                      <div>微信号: {device.wechatId || "未绑定"}</div>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Battery className="h-4 w-4" />
                          <span>{device.battery || 0}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{device.friendCount || 0}</span>
                        </div>
                        <div className="text-green-600">+{device.todayAdded || 0}</div>
                      </div>
                      <div className="text-xs text-gray-500">{device.lastActiveTime || "未知"}</div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{device.location || "未知位置"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{device.employee || "未分配"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 分页 */}
        {filteredDevices.length > 0 && (
          <div className="flex items-center justify-between py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className="text-sm text-gray-500">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
