"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Plus, Search, Filter, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// 设备数据类型定义
interface Device {
  id: string
  name: string
  imei: string
  wechatId: string
  friendCount: number
  todayAdded: number
  status: "online" | "offline"
  type: "android" | "ios"
  lastActive: string
  createTime: string
}

interface DeviceStats {
  total: number
  online: number
  offline: number
}

// API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ckbapi.quwanzhi.com"

// 统一的API请求客户端
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const token = localStorage.getItem("ckb_token")
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...((options.headers as Record<string, string>) || {}),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("服务器返回了非JSON格式的数据")
    }

    const data = await response.json()

    if (data.code && data.code !== 200 && data.code !== 0) {
      throw new Error(data.message || "请求失败")
    }

    return data.data || data
  } catch (error) {
    console.error("API请求失败:", error)
    throw error
  }
}

export default function DevicesPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [stats, setStats] = useState<DeviceStats>({ total: 0, online: 0, offline: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline">("all")
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "android" as "android" | "ios",
    ip: "",
    remark: "",
  })

  // 加载设备列表
  const loadDevices = async (page = 1) => {
    try {
      setIsLoading(true)

      // 并行请求设备列表和统计数据
      const [devicesResult, statsResult] = await Promise.allSettled([
        apiRequest<{
          devices: Device[]
          total: number
          page: number
          totalPages: number
        }>(`${API_BASE_URL}/v1/devices?page=${page}&limit=10&search=${searchTerm}&status=${statusFilter}`),
        apiRequest<DeviceStats>(`${API_BASE_URL}/v1/devices/stats`),
      ])

      // 处理设备列表数据
      if (devicesResult.status === "fulfilled") {
        setDevices(devicesResult.value.devices || [])
        setCurrentPage(devicesResult.value.page || 1)
        setTotalPages(devicesResult.value.totalPages || 1)
      } else {
        console.warn("获取设备列表失败:", devicesResult.reason)
        // 使用模拟数据
        const mockDevices: Device[] = [
          {
            id: "1",
            name: "设备 1",
            imei: "sd123123",
            wechatId: "wxid_qc924n67",
            friendCount: 649,
            todayAdded: 43,
            status: "online",
            type: "android",
            lastActive: "2024-01-07 14:30:00",
            createTime: "2024-01-01 10:00:00",
          },
          {
            id: "2",
            name: "设备 2",
            imei: "sd123124",
            wechatId: "wxid_kwjazkzd",
            friendCount: 124,
            todayAdded: 34,
            status: "online",
            type: "android",
            lastActive: "2024-01-07 14:25:00",
            createTime: "2024-01-02 11:00:00",
          },
          {
            id: "3",
            name: "设备 3",
            imei: "sd123125",
            wechatId: "wxid_6t25lkdf",
            friendCount: 295,
            todayAdded: 5,
            status: "online",
            type: "ios",
            lastActive: "2024-01-07 14:20:00",
            createTime: "2024-01-03 09:30:00",
          },
          {
            id: "4",
            name: "设备 4",
            imei: "sd123126",
            wechatId: "wxid_tvbojpy2",
            friendCount: 864,
            todayAdded: 36,
            status: "online",
            type: "android",
            lastActive: "2024-01-07 14:15:00",
            createTime: "2024-01-04 08:00:00",
          },
          {
            id: "5",
            name: "设备 5",
            imei: "sd123127",
            wechatId: "wxid_8qi6bqqi",
            friendCount: 426,
            todayAdded: 12,
            status: "online",
            type: "android",
            lastActive: "2024-01-07 14:10:00",
            createTime: "2024-01-05 10:30:00",
          },
          {
            id: "6",
            name: "设备 6",
            imei: "sd123128",
            wechatId: "wxid_icuybkc0",
            friendCount: 882,
            todayAdded: 15,
            status: "offline",
            type: "ios",
            lastActive: "2024-01-07 12:00:00",
            createTime: "2024-01-06 14:00:00",
          },
          {
            id: "7",
            name: "设备 7",
            imei: "sd123129",
            wechatId: "wxid_17hf7xl",
            friendCount: 133,
            todayAdded: 28,
            status: "online",
            type: "android",
            lastActive: "2024-01-07 14:05:00",
            createTime: "2024-01-07 09:00:00",
          },
          {
            id: "8",
            name: "设备 8",
            imei: "sd123130",
            wechatId: "wxid_ame2tiyd",
            friendCount: 600,
            todayAdded: 22,
            status: "online",
            type: "android",
            lastActive: "2024-01-07 14:00:00",
            createTime: "2024-01-08 11:30:00",
          },
          {
            id: "9",
            name: "设备 9",
            imei: "sd123131",
            wechatId: "wxid_gjrimgjk",
            friendCount: 19,
            todayAdded: 30,
            status: "online",
            type: "ios",
            lastActive: "2024-01-07 13:55:00",
            createTime: "2024-01-09 10:00:00",
          },
          {
            id: "10",
            name: "设备 10",
            imei: "sd123132",
            wechatId: "wxid_g37f8e0j",
            friendCount: 58,
            todayAdded: 6,
            status: "online",
            type: "android",
            lastActive: "2024-01-07 13:50:00",
            createTime: "2024-01-10 12:00:00",
          },
        ]
        setDevices(mockDevices)
        setTotalPages(5)
      }

      // 处理统计数据
      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value)
      } else {
        console.warn("获取设备统计失败:", statsResult.reason)
        setStats({ total: 50, online: 40, offline: 10 })
      }
    } catch (error) {
      console.error("加载设备数据失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载设备数据，请检查网络连接",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 添加设备
  const handleAddDevice = async () => {
    if (!newDevice.name.trim()) {
      toast({
        title: "参数错误",
        description: "请填写设备名称",
        variant: "destructive",
      })
      return
    }

    if (!newDevice.ip.trim()) {
      toast({
        title: "参数错误",
        description: "请填写设备IP地址",
        variant: "destructive",
      })
      return
    }

    try {
      await apiRequest(`${API_BASE_URL}/v1/devices`, {
        method: "POST",
        body: JSON.stringify({
          name: newDevice.name.trim(),
          type: newDevice.type,
          ip: newDevice.ip.trim(),
          remark: newDevice.remark.trim(),
        }),
      })

      toast({
        title: "添加成功",
        description: "设备已成功添加",
      })

      setIsAddDialogOpen(false)
      setNewDevice({ name: "", type: "android", ip: "", remark: "" })
      loadDevices(1) // 重新加载第一页
    } catch (error) {
      console.error("添加设备失败:", error)
      toast({
        title: "添加失败",
        description: error instanceof Error ? error.message : "添加设备失败，请重试",
        variant: "destructive",
      })
    }
  }

  // 批量删除设备
  const handleBatchDelete = async () => {
    if (selectedDevices.length === 0) {
      toast({
        title: "请选择设备",
        description: "请先选择要删除的设备",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`确定要删除选中的 ${selectedDevices.length} 个设备吗？此操作不可撤销。`)) {
      return
    }

    try {
      await apiRequest(`${API_BASE_URL}/v1/devices/batch`, {
        method: "DELETE",
        body: JSON.stringify({ deviceIds: selectedDevices }),
      })

      toast({
        title: "删除成功",
        description: `已成功删除 ${selectedDevices.length} 个设备`,
      })

      setSelectedDevices([])
      loadDevices(currentPage) // 重新加载当前页
    } catch (error) {
      console.error("批量删除设备失败:", error)
      toast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "批量删除设备失败，请重试",
        variant: "destructive",
      })
    }
  }

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // 重置到第一页
    // 延迟搜索以避免频繁请求
    const timeoutId = setTimeout(() => {
      loadDevices(1)
    }, 500)
    return () => clearTimeout(timeoutId)
  }

  // 状态筛选处理
  const handleStatusFilter = (value: "all" | "online" | "offline") => {
    setStatusFilter(value)
    setCurrentPage(1) // 重置到第一页
    loadDevices(1)
  }

  useEffect(() => {
    loadDevices()
  }, [])

  // 过滤设备（客户端过滤作为备选）
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.wechatId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || device.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDevices(filteredDevices.map((d) => d.id))
    } else {
      setSelectedDevices([])
    }
  }

  // 单个设备选择
  const handleSelectDevice = (deviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices((prev) => [...prev, deviceId])
    } else {
      setSelectedDevices((prev) => prev.filter((id) => id !== deviceId))
    }
  }

  const isAllSelected = filteredDevices.length > 0 && selectedDevices.length === filteredDevices.length

  return (
    <div className="flex-1 pb-16 bg-gray-50 min-h-screen">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">设备管理</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2">
                <Plus className="w-4 h-4 mr-2" />
                添加设备
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>添加新设备</DialogTitle>
                <DialogDescription>请填写设备信息以添加到系统中</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="device-name">设备名称 *</Label>
                  <Input
                    id="device-name"
                    placeholder="请输入设备名称"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="device-type">设备类型</Label>
                  <Select
                    value={newDevice.type}
                    onValueChange={(value: "android" | "ios") => setNewDevice({ ...newDevice, type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="android">Android</SelectItem>
                      <SelectItem value="ios">iOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="device-ip">IP地址 *</Label>
                  <Input
                    id="device-ip"
                    placeholder="请输入设备IP地址"
                    value={newDevice.ip}
                    onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="device-remark">备注</Label>
                  <Input
                    id="device-remark"
                    placeholder="请输入备注信息（可选）"
                    value={newDevice.remark}
                    onChange={(e) => setNewDevice({ ...newDevice, remark: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddDevice} className="bg-blue-500 hover:bg-blue-600">
                    添加
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">总设备数</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.online}</div>
              <div className="text-sm text-gray-600 mt-1">在线设备</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.offline}</div>
              <div className="text-sm text-gray-600 mt-1">离线设备</div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索设备IMEI/微信"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadDevices(currentPage)}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 筛选和批量操作 */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="online">在线</SelectItem>
                    <SelectItem value="offline">离线</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} className="rounded" />
                  <span className="text-sm text-gray-600">全选</span>
                </div>
              </div>

              {selectedDevices.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBatchDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  删除
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 设备列表 */}
        <div className="space-y-3">
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <Card key={i} className="bg-white shadow-sm animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            : filteredDevices.map((device) => (
                <Card key={device.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedDevices.includes(device.id)}
                        onCheckedChange={(checked) => handleSelectDevice(device.id, !!checked)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{device.name}</h3>
                          <Badge
                            variant={device.status === "online" ? "default" : "secondary"}
                            className={
                              device.status === "online"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {device.status === "online" ? "在线" : "离线"}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>IMEI: {device.imei}</div>
                          <div>微信号: {device.wechatId}</div>
                          <div className="flex items-center justify-between">
                            <span>好友数: {device.friendCount}</span>
                            <span className="text-green-600">今日新增: +{device.todayAdded}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

          {!isLoading && filteredDevices.length === 0 && (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500 mb-4">没有找到匹配的设备</div>
                <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加设备
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDevices(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
            >
              上一页
            </Button>
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDevices(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
