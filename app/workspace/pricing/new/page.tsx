"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/app/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// 模拟标签数据
const tagOptions = [
  { value: "new_user", label: "新用户" },
  { value: "low_activity", label: "低活跃度" },
  { value: "high_spending", label: "高消费" },
  { value: "high_activity", label: "高活跃度" },
  { value: "potential", label: "潜在客户" },
  { value: "purchase_intent", label: "有购买意向" },
  { value: "holiday_consumer", label: "节日消费" },
  { value: "promotion_sensitive", label: "促销敏感" },
  { value: "tech_savvy", label: "科技爱好者" },
  { value: "luxury_buyer", label: "奢侈品买家" },
  { value: "price_sensitive", label: "价格敏感" },
  { value: "brand_loyal", label: "品牌忠诚" },
]

// 模拟区域数据
const regionOptions = [
  { value: "nationwide", label: "全国" },
  { value: "beijing", label: "北京" },
  { value: "shanghai", label: "上海" },
  { value: "guangzhou", label: "广州" },
  { value: "shenzhen", label: "深圳" },
  { value: "hangzhou", label: "杭州" },
  { value: "chengdu", label: "成都" },
  { value: "wuhan", label: "武汉" },
  { value: "east_china", label: "华东地区" },
  { value: "south_china", label: "华南地区" },
  { value: "north_china", label: "华北地区" },
  { value: "central_china", label: "华中地区" },
  { value: "tier_1", label: "一线城市" },
  { value: "tier_2", label: "二线城市" },
  { value: "tier_3", label: "三线城市" },
]

export default function NewPricingPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [price, setPrice] = useState("")
  const [tagsOpen, setTagsOpen] = useState(false)
  const [regionsOpen, setRegionsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 在实际应用中，这里会发送API请求保存数据
    console.log({
      name,
      tags: selectedTags,
      regions: selectedRegions,
      price: Number.parseFloat(price),
    })

    // 返回到列表页
    router.push("/workspace/pricing")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workspace/pricing")} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">新建定价</h1>
          <div className="w-10"></div> {/* 占位，保持标题居中 */}
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 定价名称 */}
          <div className="space-y-2">
            <Label htmlFor="name">定价名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入定价名称"
              required
            />
          </div>

          {/* 流量标签选择 */}
          <div className="space-y-2">
            <Label>流量标签</Label>
            <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={tagsOpen}
                  className="w-full justify-between h-auto min-h-10"
                >
                  {selectedTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1 py-1">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="mr-1">
                          {tagOptions.find((t) => t.value === tag)?.label}
                          <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSelectedTags(selectedTags.filter((t) => t !== tag))
                            }}
                          >
                            ✕
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">选择流量标签</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="搜索标签..." />
                  <CommandList>
                    <CommandEmpty>未找到相关标签</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-60">
                        {tagOptions.map((tag) => (
                          <CommandItem
                            key={tag.value}
                            value={tag.value}
                            onSelect={() => {
                              setSelectedTags(
                                selectedTags.includes(tag.value)
                                  ? selectedTags.filter((t) => t !== tag.value)
                                  : [...selectedTags, tag.value],
                              )
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTags.includes(tag.value) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {tag.label}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* 流量区域选择 */}
          <div className="space-y-2">
            <Label>流量区域</Label>
            <Popover open={regionsOpen} onOpenChange={setRegionsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={regionsOpen}
                  className="w-full justify-between h-auto min-h-10"
                >
                  {selectedRegions.length > 0 ? (
                    <div className="flex flex-wrap gap-1 py-1">
                      {selectedRegions.map((region) => (
                        <Badge key={region} variant="outline" className="mr-1 bg-amber-50">
                          {regionOptions.find((r) => r.value === region)?.label}
                          <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setSelectedRegions(selectedRegions.filter((r) => r !== region))
                            }}
                          >
                            ✕
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">选择流量区域</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="搜索区域..." />
                  <CommandList>
                    <CommandEmpty>未找到相关区域</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-60">
                        {regionOptions.map((region) => (
                          <CommandItem
                            key={region.value}
                            value={region.value}
                            onSelect={() => {
                              setSelectedRegions(
                                selectedRegions.includes(region.value)
                                  ? selectedRegions.filter((r) => r !== region.value)
                                  : [...selectedRegions, region.value],
                              )
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedRegions.includes(region.value) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {region.label}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* 价格输入 */}
          <div className="space-y-2">
            <Label htmlFor="price">价格（元/人次）</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">¥</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="pl-8"
                required
              />
            </div>
          </div>

          {/* 按钮组 */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/workspace/pricing")}>
              取消
            </Button>
            <Button type="submit">确认</Button>
          </div>
        </form>
      </main>
    </div>
  )
}

