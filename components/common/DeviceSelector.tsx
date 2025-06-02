"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Smartphone, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Device {
  id: string
  name: string
  status: "online" | "offline" | "busy"
  type: string
  lastActive?: string
}

interface DeviceSelectorProps {
  selectedDevices: string[]
  onDevicesChange: (deviceIds: string[]) => void
  showNextButton?: boolean
  onNext?: () => void
  onPrevious?: () => void
  className?: string
}

export function DeviceSelector({
  selectedDevices,
  onDevicesChange,
  showNextButton = false,
  onNext,
  onPrevious,
  className,
}: DeviceSelectorProps) {
  const [devices, setDevices] = useState<Device[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载设备数据
    setTimeout(() => {
      setDevices([
        { id: "1", name: "设备 001", status: "online", type: "Android" },
        { id: "2", name: "设备 002", status: "online", type: "iOS" },
        { id: "3", name: "设备 003", status: "offline", type: "Android" },
        { id: "4", name: "设备 004", status: "busy", type: "Android" },
        { id: "5", name: "设备 005", status: "online", type: "iOS" },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const filteredDevices = devices.filter((device) => device.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectAll = () => {
    const allOnlineDeviceIds = filteredDevices.filter((d) => d.status === "online").map((d) => d.id)
    onDevicesChange(allOnlineDeviceIds)
  }

  const handleClearAll = () => {
    onDevicesChange([])
  }

  const handleToggleDevice = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      onDevicesChange(selectedDevices.filter((id) => id !== deviceId))
    } else {
      onDevicesChange([...selectedDevices, deviceId])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "offline":
        return "text-gray-400"
      case "busy":
        return "text-yellow-500"
      default:
        return "text-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "在线"
      case "offline":
        return "离线"
      case "busy":
        return "忙碌"
      default:
        return "未知"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载设备中...</div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="搜索设备..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            全选在线
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            清空
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-500">已选择 {selectedDevices.length} 个设备</div>

      <ScrollArea className="h-[400px] border rounded-lg">
        <div className="p-4 space-y-2">
          {filteredDevices.map((device) => (
            <Card
              key={device.id}
              className={cn(
                "cursor-pointer transition-colors",
                selectedDevices.includes(device.id) ? "border-blue-500 bg-blue-50" : "",
                device.status !== "online" ? "opacity-60" : "",
              )}
              onClick={() => device.status === "online" && handleToggleDevice(device.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      disabled={device.status !== "online"}
                      onCheckedChange={() => handleToggleDevice(device.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Smartphone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-gray-500">{device.type}</div>
                    </div>
                  </div>
                  <div className={cn("flex items-center gap-1 text-sm", getStatusColor(device.status))}>
                    {device.status === "online" ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    {getStatusText(device.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {showNextButton && (
        <div className="flex justify-between pt-4">
          {onPrevious && (
            <Button variant="outline" onClick={onPrevious}>
              上一步
            </Button>
          )}
          <Button onClick={onNext} disabled={selectedDevices.length === 0} className="ml-auto">
            下一步
          </Button>
        </div>
      )}
    </div>
  )
}

export default DeviceSelector
