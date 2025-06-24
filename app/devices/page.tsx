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
          name: `设备 ${i + 1}`,
          imei: `sd1231${i + 23}`,
          type: i % 2 === 0 ? "android" : "ios",
          status: i < 40 ? "online" : i < 45 ? "offline" : "busy",
          wechatId: `wxid_${Math.random().toString(36).substring(7)}`,
          friendCount: Math.floor(Math.random() * 1000) + 100,
          battery: Math.floor(Math.random() * 100) + 1,
          lastActive: i < 5 ? "刚刚" : i < 10 ? "5分钟前" : i < 15 ? "1小时前" : "2小时前",
          addFriendStatus: Math.random() > 0.2 ? "normal" : "abnormal",
          remark: `设备备注 ${i + 1}`,
          model: i % 3 === 0 ? "iPhone 14" : i % 3 === 1 ? "Samsung S23" : "Xiaomi 13",
          category: i % 4 === 0 ? "acquisition" : i % 4 === 1 ? "maintenance" : i % 4 === 2 ? "testing" : "backup",
          todayAdded: Math.floor(Math.random() * 50),
          totalTasks: Math.floor(Math.random() * 100) + 10,
          completedTasks: Math.floor(Math.random() * 80) + 5,
          activePlans: i < 30 ? [`plan-${i + 1}`, `plan-${i + 2}`] : [],
          planNames: i < 30 ? [`计划 ${i + 1}`, `计划 ${i + 2}`] : [],
          tags: i % 2 === 0 ? ["高效", "稳定"] : ["测试", "备用"],
          location: i % 3 === 0 ? "北京" : i % 3 === 1 ? "上海" : "深圳",
          operator: `操作员${(i % 5) + 1}`,
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

  // 简化的设备卡片组件 - 优化标签设计
  const DeviceCard = ({ device }: { device: Device }) => {
    const isSelected = selectedDevices.includes(device.id)

    return (
      <Card
        className={cn(
          "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50",
        )}
        onClick={() => handleDeviceClick(device.id)}
      >
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleDeviceSelect(device.id)}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium truncate">{device.name}</h3>
                {/* 简化状态标签 - 使用圆点代替Badge */}
                <div className="flex items-center space-x-1">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      device.status === "online"
                        ? "bg-green-500"
                        : device.status === "busy"
                          ? "bg-yellow-500"
                          : "bg-gray-400",
                    )}
                  />
                  <span className="text-xs text-gray-500">
                    {device.status === "online" ? "在线" : device.status === "busy" ? "忙碌" : "离线"}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Smartphone className={cn("h-4 w-4", device.type === "android" ? "text-green-500" : "text-gray-500")} />
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div>IMEI: {device.imei}</div>
              <div>微信号: {device.wechatId}</div>
              {device.remark && <div>备注: {device.remark}</div>}
            </div>

            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Battery
                    className={cn(
                      "h-4 w-4",
                      device.battery > 50 ? "text-green-500" : device.battery > 20 ? "text-yellow-500" : "text-red-500",
                    )}
                  />
                  <span>{device.battery}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{device.friendCount}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">{device.lastActive}</div>
            </div>

            {/* 计划和任务信息 */}
            {device.activePlans && device.activePlans.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <Activity className="h-3 w-3" />
                  <span>活跃计划: {device.activePlans.length}</span>
                </div>
                {device.planNames && (
                  <div className="text-xs text-gray-500 truncate">{device.planNames.join(", ")}</div>
                )}
              </div>
            )}

            {/* 任务完成情况 */}
            {device.totalTasks !== undefined && device.completedTasks !== undefined && (
              <div className="mt-2 text-xs text-gray-500">
                任务完成: {device.completedTasks}/{device.totalTasks}(
                {Math.round((device.completedTasks / device.totalTasks) * 100)}%)
              </div>
            )}

            {/* 简化标签设计 - 使用更小的圆点标签 */}
            {device.tags && device.tags.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex space-x-1">
                  {device.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={tag}
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        index === 0
                          ? "bg-blue-100 text-blue-700"
                          : index === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700",
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                  {device.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{device.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 位置和操作员 - 简化显示 */}
            {(device.location || device.operator) && (
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
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
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                // 更多操作
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
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
              添加设备
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* 简化的统计卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="总设备数" value={stats.totalDevices} icon={<Smartphone className="h-5 w-5" />} />
          <StatCard
            title="在线设备"
            value={stats.onlineDevices}
            icon={<Activity className="h-5 w-5" />}
            valueColor="text-green-600"
          />
        </div>

        <Tabs defaultValue="list" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list">设备列表</TabsTrigger>
              <TabsTrigger value="filter">过滤器</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              {selectedDevices.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  删除 ({selectedDevices.length})
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                显示 {paginatedDevices.length} / {filteredDevices.length} 个设备
                {selectedDevices.length > 0 && (
                  <span className="text-blue-600 ml-2">已选择 {selectedDevices.length} 个</span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={paginatedDevices.length === 0}>
                {selectedDevices.length === paginatedDevices.length && paginatedDevices.length > 0
                  ? "取消全选"
                  : "全选"}
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                <span>正在加载设备列表...</span>
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Smartphone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>未找到匹配的设备</p>
                <Button variant="outline" className="mt-4" onClick={() => setFilters({})}>
                  清除过滤器
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3">
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
                      第 {currentPage} / {Math.ceil(filteredDevices.length / devicesPerPage)} 页
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
