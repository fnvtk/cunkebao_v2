"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DeviceSelectionDialog } from "@/app/components/device-selection-dialog"
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FriendRequestSettingsProps {
  formData: any
  onChange: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

// 招呼语模板
const greetingTemplates = [
  "你好，请通过",
  "你好,了解XX,请通过",
  "你好，我是XX产品的客服请通过",
  "你好，感谢关注我们的产品",
  "你好，很高兴为您服务",
]

// 备注类型选项
const remarkTypes = [
  { value: "phone", label: "手机号" },
  { value: "nickname", label: "昵称" },
  { value: "source", label: "来源" },
]

export function FriendRequestSettings({ formData, onChange, onNext, onPrev }: FriendRequestSettingsProps) {
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)

  // 使用useEffect设置默认值
  useEffect(() => {
    if (!formData.greeting) {
      onChange({
        ...formData,
        greeting: "你好，请通过",
        remarkType: "phone", // 默认选择手机号
        maxDailyFriends: 20,
        addFriendInterval: 1,
      })
    }
  }, [formData, formData.greeting, onChange])

  const handleDeviceSelect = (deviceIds: string[]) => {
    onChange({
      ...formData,
      selectedDevices: deviceIds,
    })
  }

  const handleTemplateSelect = (template: string) => {
    onChange({ ...formData, greeting: template })
    setIsTemplateDialogOpen(false)
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <Label className="text-base">选择设备</Label>
          <Button variant="outline" className="w-full mt-2 justify-between" onClick={() => setIsDeviceDialogOpen(true)}>
            {formData.selectedDevices?.length ? `已选择 ${formData.selectedDevices.length} 个设备` : "选择设备"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Label className="text-base">好友备注</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>设置添加好友时的备注格式</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={formData.remarkType || "phone"}
            onValueChange={(value) => onChange({ ...formData, remarkType: value })}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="选择备注类型" />
            </SelectTrigger>
            <SelectContent>
              {remarkTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.remarkType && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="text-gray-500 mb-1">备注格式预览：</div>
              {formData.remarkType === "phone" && "138****1234"}
              {formData.remarkType === "nickname" && "小红书用户2851"}
              {formData.remarkType === "source" && "抖音直播"}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label className="text-base">招呼语</Label>
            <Button variant="ghost" size="sm" onClick={() => setIsTemplateDialogOpen(true)} className="text-blue-500">
              <MessageSquare className="h-4 w-4 mr-2" />
              参考模板
            </Button>
          </div>
          <Input
            value={formData.greeting}
            onChange={(e) => onChange({ ...formData, greeting: e.target.value })}
            placeholder="请输入招呼语"
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Label className="text-base">每个设备每日最大添加数量</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>为了账号安全，建议每个设备每日添加不超过20个好友</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-2">
            <Input
              type="number"
              value={formData.maxDailyFriends || 20}
              onChange={(e) => onChange({ ...formData, maxDailyFriends: Number(e.target.value) })}
              max={20}
              min={1}
              className="w-32"
            />
          </div>
        </div>

        <div>
          <Label className="text-base">添加间隔</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              type="number"
              value={formData.addFriendInterval || 1}
              onChange={(e) => onChange({ ...formData, addFriendInterval: Number(e.target.value) })}
              className="w-32"
            />
            <span>分钟</span>
          </div>
        </div>

        <div>
          <Label className="text-base">允许加人的时间段</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              type="time"
              value={formData.addFriendTimeStart || "09:00"}
              onChange={(e) => onChange({ ...formData, addFriendTimeStart: e.target.value })}
              className="w-32"
            />
            <span>至</span>
            <Input
              type="time"
              value={formData.addFriendTimeEnd || "18:00"}
              onChange={(e) => onChange({ ...formData, addFriendTimeEnd: e.target.value })}
              className="w-32"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            上一步
          </Button>
          <Button onClick={onNext}>下一步</Button>
        </div>
      </div>

      <DeviceSelectionDialog
        open={isDeviceDialogOpen}
        onOpenChange={setIsDeviceDialogOpen}
        selectedDevices={formData.selectedDevices || []}
        onSelect={handleDeviceSelect}
        excludeUsedDevices={true}
      />

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>招呼语模板</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {greetingTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4"
                onClick={() => handleTemplateSelect(template)}
              >
                {template}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

