"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Device {
  id: string
  name: string
  imei: string
  status: "online" | "offline"
  wechatId: string
  friendCount: number
  battery: number
  avatar?: string
}

interface DeviceSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDevices: string[]
  onSelect: (deviceIds: string[]) => void
  excludeUsedDevices?: boolean
  planId?: string
}

export function DeviceSelectionDialog({
  open,
  onOpenChange,
  selectedDevices,
  onSelect,
  excludeUsedDevices = false,
  planId,
}: DeviceSelectionDialogProps) {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<string[]>(selectedDevices || [])
  const [currentPage, setCurrentPage] = useState(1)
  const devicesPerPage = 5

  useEffect(() => {
    const fetchDevices = async () => {
      // 模拟API调用获取设备列表
      const mockDevices: Device[] = Array.from({ length: 20 }, (_, i) => ({
        id: `device-${i + 1}`,
        name: `设备 ${i + 1}`,
        imei: `sd${123123 + i}`,
        status: Math.random() > 0.2 ? "online" : "offline",
        wechatId: `wxid_${Math.random().toString(36).substr(2, 8)}`,
        friendCount: Math.floor(Math.random() * 1000),
        battery: Math.floor(Math.random() * 100),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (i + 1),
      }))

      if (excludeUsedDevices && planId) {
        const availableDevices = mockDevices.filter((device) => !device.id.includes("-even"))
        setDevices(availableDevices)
        setFilteredDevices(availableDevices)
      } else {
        setDevices(mockDevices)
        setFilteredDevices(mockDevices)
      }
    }

    if (open) {
      fetchDevices()
      setSelected(selectedDevices || [])
    }
  }, [open, selectedDevices, excludeUsedDevices, planId])

  useEffect(() => {
    const filtered = devices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.imei.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.wechatId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || device.status === statusFilter
      return matchesSearch && matchesStatus
    })
    setFilteredDevices(filtered)
    setCurrentPage(1)
  }, [searchQuery, statusFilter, devices])

  const handleSelect = (deviceId: string) => {
    let newSelected: string[]

    if (selected.includes(deviceId)) {
      // 如果已选中，则取消选择
      newSelected = selected.filter((id) => id !== deviceId)
    } else {
      // 如果未选中，检查是否超过限制
      if (selected.length >= 5) {
        toast({
          title: "选择超出限制",
          description: "最多可选择5个设备",
          variant: "destructive",
        })
        return
      }
      newSelected = [...selected, deviceId]
    }

    setSelected(newSelected)
    onSelect(newSelected) // 直接触发选择回调
  }

  const handleRefresh = () => {
    const refreshedDevices = devices.map((device) => ({
      ...device,
      status: Math.random() > 0.2 ? "online" : "offline",
      battery: Math.floor(Math.random() * 100),
    }))
    setDevices(refreshedDevices)
    setFilteredDevices(refreshedDevices)
  }

  // 分页逻辑
  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage)
  const startIndex = (currentPage - 1) * devicesPerPage
  const currentDevices = filteredDevices.slice(startIndex, startIndex + devicesPerPage)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>选择设备</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索设备IMEI/备注/微信号"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="online">在线</SelectItem>
                <SelectItem value="offline">离线</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500">已选择 {selected.length}/5 个设备</div>
          </div>

          <div className="space-y-2">
            {currentDevices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">暂无符合条件的设备</div>
            ) : (
              currentDevices.map((device) => (
                <Card
                  key={device.id}
                  className={`p-3 hover:shadow-md transition-shadow cursor-pointer ${
                    selected.includes(device.id) ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelect(device.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium truncate">{device.name}</div>
                        <Badge variant={device.status === "online" ? "success" : "secondary"}>
                          {device.status === "online" ? "在线" : "离线"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">IMEI: {device.imei}</div>
                      <div className="text-sm text-gray-500">微信号: {device.wechatId}</div>
                      <div className="flex items-center justify-between mt-1 text-sm">
                        <span className="text-gray-500">好友数: {device.friendCount}</span>
                        <span className="text-gray-500">电量: {device.battery}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <span className="flex items-center px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

