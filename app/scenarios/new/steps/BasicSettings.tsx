"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

export interface BasicSettingsProps {
  name: string
  setName: (name: string) => void
  type: string
  setType: (type: string) => void
  startDate: Date | undefined
  setStartDate: (date: Date | undefined) => void
  endDate: Date | undefined
  setEndDate: (date: Date | undefined) => void
}

export function BasicSettings({
  name,
  setName,
  type,
  setType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: BasicSettingsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">场景名称</Label>
            <Input id="name" placeholder="输入场景名称" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="type">场景类型</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="选择场景类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">手机号获客</SelectItem>
                <SelectItem value="wechat">微信获客</SelectItem>
                <SelectItem value="douyin">抖音获客</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label>开始日期</Label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label>结束日期</Label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

