"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Copy, QrCode } from "lucide-react"

interface PlanSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
}

export function PlanSettingsDialog({ open, onOpenChange, planId }: PlanSettingsDialogProps) {
  const [rewardType, setRewardType] = useState<"disabled" | "onSubmit" | "onApprove">("onSubmit")
  const [rewardAmount, setRewardAmount] = useState("5.00")
  const [selectedWorker, setSelectedWorker] = useState("")

  // 生成订单填写链接
  const orderFormUrl =
    typeof window !== "undefined" ? `${window.location.origin}/orders/submit/${planId}` : `/orders/submit/${planId}`

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(url)
      toast({
        title: "链接已复制",
        description: "已将链接复制到剪贴板",
      })
    }
  }

  const handleSave = () => {
    // 这里添加保存设置的逻辑
    toast({
      title: "设置已保存",
      description: "获客计划设置已更新",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>获客计划设置</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label>何时收益</Label>
            <RadioGroup value={rewardType} onValueChange={(value: any) => setRewardType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disabled" id="disabled" />
                <Label htmlFor="disabled">禁用</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onSubmit" id="onSubmit" />
                <Label htmlFor="onSubmit">表单录入时</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onApprove" id="onApprove" />
                <Label htmlFor="onApprove">好友通过时</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>每条收益</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRewardAmount((prev) => (Number(prev) - 1).toFixed(2))}
              >
                -
              </Button>
              <Input
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                className="w-24 text-center"
                step="0.01"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRewardAmount((prev) => (Number(prev) + 1).toFixed(2))}
              >
                +
              </Button>
              <span className="text-gray-500">元</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>兼职者</Label>
            <div className="flex space-x-2">
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker1">小清</SelectItem>
                  <SelectItem value="worker2">梁玉娟</SelectItem>
                  <SelectItem value="worker3">谢金板</SelectItem>
                  <SelectItem value="worker4">李翔瑶</SelectItem>
                  <SelectItem value="worker5">陈泊峰</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">添加</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Web入口</Label>
            <div className="flex items-center space-x-2">
              <Input value={orderFormUrl} readOnly />
              <Button variant="outline" size="icon" onClick={() => handleCopyLink(orderFormUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>小程序入口</Label>
            <div className="flex flex-col items-center p-4 border rounded-md">
              <QrCode className="w-32 h-32 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center">扫描二维码或复制链接访问订单填写页面</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCopyLink(orderFormUrl)}>
                <Copy className="h-4 w-4 mr-2" />
                复制链接
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

