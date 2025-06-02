"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Battery, Smartphone, Users } from "lucide-react"
import type { Device } from "@/types/device"

interface DeviceTableProps {
  devices: Device[]
  selectedDevices: string[]
  onSelectDevice: (deviceId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onDeviceClick: (deviceId: string) => void
}

export function DeviceTable({
  devices,
  selectedDevices,
  onSelectDevice,
  onSelectAll,
  onDeviceClick,
}: DeviceTableProps) {
  const allSelected = devices.length > 0 && selectedDevices.length === devices.length

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox checked={allSelected} onCheckedChange={(checked) => onSelectAll(!!checked)} />
            </TableHead>
            <TableHead>设备信息</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>微信账号</TableHead>
            <TableHead>好友数</TableHead>
            <TableHead>今日添加</TableHead>
            <TableHead>加友状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow
              key={device.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onDeviceClick(device.id)}
            >
              <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedDevices.includes(device.id)}
                  onCheckedChange={(checked) => onSelectDevice(device.id, !!checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{device.name}</div>
                    <div className="text-xs text-gray-500">IMEI-{device.imei}</div>
                    {device.remark && <div className="text-xs text-gray-500">备注: {device.remark}</div>}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Badge variant={device.status === "online" ? "success" : "secondary"}>
                    {device.status === "online" ? "在线" : "离线"}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Battery className={`h-4 w-4 ${device.battery < 20 ? "text-red-500" : "text-green-500"}`} />
                    <span className="text-xs">{device.battery}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{device.wechatId}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{device.friendCount}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">+{device.todayAdded}</div>
              </TableCell>
              <TableCell>
                <Badge variant={device.addFriendStatus === "normal" ? "success" : "destructive"}>
                  {device.addFriendStatus === "normal" ? "正常" : "异常"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
