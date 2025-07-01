"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  RefreshCw,
  Smartphone,
  Battery,
  Users,
  Activity,
  MapPin,
  Trash2,
  Edit,
  MoreHorizontal,
  ChevronLeft,
  Loader2,
  Signal,
  Wifi,
  WifiOff,
  Circle,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { DeviceFilter } from "@/app/components/common/DeviceFilter"
import { AddDeviceDialog } from "@/app/components/common/AddDeviceDialog"
import { StatCard } from "@/app/components/common/StatCard"
import BottomNav from "@/app/components/BottomNav"
import type { Device, DeviceFilterParams } from "@/types/device"
import { cn } from "@/lib/utils"

export default function DevicesPage() {
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [filters, setFilters] = useState<DeviceFilterParams>({})
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const devicesPerPage = 10

  // 加载设备数据
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true)
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 800))
        const mockDevices: Device[] = Array.from({ length: 50 }, (_, i) => ({
          id: `device-${i + 1}`,
          name: `设备${i + 1}`,
          imei: `sd1231${i + 23}`,
          type: i % 2 === 0 ? "android" : "ios",
          status: i < 40 ? "online" : i < 45 ? "offline" : "busy",
          wechatId: `wx${Math.random().toString(36).substring(2, 8)}`,
          friendCount: Math.floor(Math.random() * 1000) + 100,
          battery: Math.floor(Math.random() * 100) + 1,
          lastActive: i < 5 ? "刚刚" : i < 10 ? "5分钟前" : i < 15 ? "1小时前" : "2小时前",
          addFriendStatus: Math.random() > 0.2 ? "normal" : "abnormal",
          remark: i % 3 === 0 ? `备注${i + 1}` : undefined,
          model: i % 3 === 0 ? "iPhone14" : i % 3 === 1 ? "S23" : "Mi13",
          category: i % 4 === 0 ? "acquisition" : i % 4 === 1 ? "maintenance" : i % 4 === 2 ? "testing" : "backup",
          todayAdded: Math.floor(Math.random() * 50),
          totalTasks: Math.floor(Math.random() * 100) + 10,
          completedTasks: Math.floor(Math.random() * 80) + 5,
          activePlans: i < 30 ? [`plan-${i + 1}`] : [],
          planNames: i < 30 ? [`计划${i + 1}`] : [],
          tags: i % 2 === 0 ? ["高效"] : i % 3 === 0 ? ["测试"] : undefined,
          location: i % 3 === 0 ? "北京" : i % 3 === 1 ? "上海" : "深圳",
          operator: `员工${(i % 5) + 1}`,
        }))
        setDevices(mockDevices)
      } catch (error) {
        console.error("获取设备失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
  }, [])

  // 简化的统计数据
  const stats = {
    totalDevices: devices.length,
    onlineDevices: devices.filter((d) => d.status === "online").length,
    offlineDevices: devices.filter((d) => d.status === "offline").length,
    busyDevices: devices.filter((d) => d.status === "busy").length,
  }

  // 过滤设备
  const filteredDevices = devices.filter((device) => {
    // 关键词搜索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      const matchesKeyword =
        device.name.toLowerCase().includes(keyword) ||
        device.imei.toLowerCase().includes(keyword) ||
        device.wechatId.toLowerCase().includes(keyword) ||
        (device.remark && device.remark.toLowerCase().includes(keyword)) ||
        (device.model && device.model.toLowerCase().includes(keyword))

      if (!matchesKeyword) return false
    }

    if (filters.status?.length && !filters.status.includes(device.status)) return false
    if (filters.type?.length && !filters.type.includes(device.type)) return false
    if (filters.category?.length && device.category && !filters.category.includes(device.category)) return false
    if (filters.models?.length && device.model && !filters.models.includes(device.model)) return false

    if (filters.batteryRange) {
      const [min, max] = filters.batteryRange
      if (device.battery < min || device.battery > max) return false
    }

    if (filters.friendCountRange) {
      const [min, max] = filters.friendCountRange
      if (device.friendCount < min || device.friendCount > max) return false
    }

    if (filters.tags?.length && device.tags) {
      const hasMatchingTag = filters.tags.some((tag) => device.tags?.includes(tag))
      if (!hasMatchingTag) return false
    }

    if (filters.hasActivePlans !== undefined) {
      const hasActivePlans = device.activePlans && device.activePlans.length > 0
      if (filters.hasActivePlans !== hasActivePlans) return false
    }

    return true
  })

  // 分页数据
  const paginatedDevices = filteredDevices.slice((currentPage - 1) * devicesPerPage, currentPage * devicesPerPage)

  // 获取可用的型号和标签
  const availableModels = [...new Set(devices.map((d) => d.model).filter(Boolean))]
  const availableTags = [...new Set(devices.flatMap((d) => d.tags || []))]

  const handleDeviceClick = (deviceId: string) => {
    router.push(`/devices/${deviceId}`)
  }

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevices((prev) => (prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]))
  }

  const handleSelectAll = () => {
    if (selectedDevices.length === paginatedDevices.length) {
      setSelectedDevices([])
    } else {
      setSelectedDevices(paginatedDevices.map((d) => d.id))
    }
  }

  const handleBatchDelete = () => {
    if (selectedDevices.length === 0) {
      toast({
        title: "请选择设备",
        description: "您需要选择至少一个设备来执行批量删除操作",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "批量删除成功",
      description: `已删除 ${selectedDevices.length} 个设备`,
    })
    setSelectedDevices([])
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "刷新成功",
        description: "设备列表已更新",
      })
    }, 800)
  }

  const handleDeviceAdded = (newDevice: Device) => {
    setDevices([newDevice, ...devices])
  }

  // 获取信号强度图标
  const getSignalIcon = (battery: number, status: string) => {
    if (status === "offline") return <WifiOff className="h-3 w-3 text-gray-400" />
    if (battery > 70) return <Signal className="h-3 w-3 text-green-500" />
    if (battery > 30) return <Wifi className="h-3 w-3 text-yellow-500" />
    return <Signal className="h-3 w-3 text-red-500" />
  }

  // 简化的设备卡片组件 - 移动端优化
  const DeviceCard = ({ device }: { device: Device }) => {
    const isSelected = selectedDevices.includes(device.id)

    return (
      <Card
        className={cn(
          "p-3 cursor-pointer transition-all duration-200 hover:shadow-md",
          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50",
        )}
        onClick={() => handleDeviceClick(device.id)}
      >
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => handleDeviceSelect(device.id)}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-blue-500"
          />

          <div className="flex-1 min-w-0">
            {/* 第一行：设备名称和状态 */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-sm truncate max-w-[120px]">{device.name}</h3>
                <div className="flex items-center space-x-1">
                  {getSignalIcon(device.battery, device.status)}
                  <Circle
                    className={cn(
                      "w-2 h-2 fill-current",
                      device.status === "online"
                        ? "text-green-500"
                        : device.status === "busy"
                          ? "text-yellow-500"
                          : "text-gray-400",
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Smartphone className={cn("h-3 w-3", device.type === "android" ? "text-green-500" : "text-gray-500")} />
                <span className="text-xs text-gray-500">{device.model}</span>
              </div>
            </div>

            {/* 第二行：IMEI和微信号 */}
            <div className="text-xs text-gray-600 space-y-0.5">
              <div className="truncate">IMEI: {device.imei}</div>
              <div className="truncate">微信: {device.wechatId}</div>
            </div>

            {/* 第三行：关键数据 */}
            <div className="flex items-center justify-between mt-2 text-xs">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Battery
                    className={cn(
                      "h-3 w-3",
                      device.battery > 50 ? "text-green-500" : device.battery > 20 ? "text-yellow-500" : "text-red-500",
                    )}
                  />
                  <span>{device.battery}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-blue-500" />
                  <span>{device.friendCount > 999 ? "999+" : device.friendCount}</span>
                </div>
                {device.todayAdded !== undefined && device.todayAdded > 0 && (
                  <div className="flex items-center space-x-1">
                    <Plus className="h-3 w-3 text-green-500" />
                    <span>{device.todayAdded}</span>
                  </div>
                )}
              </div>
              <span className="text-gray-500">{device.lastActive}</span>
            </div>

            {/* 第四行：活跃计划和标签 */}
            {(device.activePlans?.length || device.tags?.length) && (
              <div className="flex items-center justify-between mt-2">
                {/*device.activePlans && device.activePlans.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600">{device.activePlans.length}个计划</span>
                  </div>
                )*/}
                {device.activePlans && device.activePlans.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{device.activePlans.length}</span>
                  </div>
                )}
                {/*device.tags && device.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {device.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={tag}
                        className={cn(
                          "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                          index === 0 ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                    {device.tags.length > 2 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        +{device.tags.length - 2}
                      </span>
                    )}
                  </div>
                )*/}
                {device.tags && device.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {device.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={tag}
                        className="inline-block px-1 py-0.5 rounded-sm text-xs bg-gray-100 text-gray-600 border"
                      >
                        {tag}
                      </span>
                    ))}
                    {device.tags.length > 2 && (
                      <span className="inline-block px-1 py-0.5 rounded-sm text-xs bg-gray-50 text-gray-500 border">
                        +{device.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 位置和操作员 - 仅在有数据时显示 */}
            {(device.location || device.operator) && (
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                {device.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{device.location}</span>
                  </div>
                )}
                {device.operator && <span>{device.operator}</span>}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                // 编辑设备
              }}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                // 更多操作
              }}
              className="h-6 w-6 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen pb-16">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">设备管理</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* 简化的统计卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="总数" value={stats.totalDevices} icon={<Smartphone className="h-4 w-4" />} />
          <StatCard
            title="在线"
            value={stats.onlineDevices}
            icon={<Activity className="h-4 w-4" />}
            valueColor="text-green-600"
          />
        </div>

        <Tabs defaultValue="list" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list">列表</TabsTrigger>
              <TabsTrigger value="filter">筛选</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              {selectedDevices.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  删除({selectedDevices.length})
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {paginatedDevices.length}/{filteredDevices.length}
                {selectedDevices.length > 0 && <span className="text-blue-600 ml-2">已选{selectedDevices.length}</span>}
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={paginatedDevices.length === 0}>
                {selectedDevices.length === paginatedDevices.length && paginatedDevices.length > 0 ? "取消" : "全选"}
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                <span>加载中...</span>
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Smartphone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>未找到设备</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setFilters({})}>
                  清除筛选
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-2">
                  {paginatedDevices.map((device) => (
                    <DeviceCard key={device.id} device={device} />
                  ))}
                </div>

                {/* 分页 */}
                {filteredDevices.length > devicesPerPage && (
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      上一页
                    </Button>
                    <span className="text-sm text-gray-500">
                      {currentPage}/{Math.ceil(filteredDevices.length / devicesPerPage)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(Math.ceil(filteredDevices.length / devicesPerPage), prev + 1))
                      }
                      disabled={currentPage >= Math.ceil(filteredDevices.length / devicesPerPage)}
                    >
                      下一页
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="filter">
            <DeviceFilter
              filters={filters}
              onFiltersChange={setFilters}
              availableModels={availableModels}
              availableTags={availableTags}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddDeviceDialog open={showAddDialog} onOpenChange={setShowAddDialog} onDeviceAdded={handleDeviceAdded} />

      <BottomNav />
    </div>
  )
}
