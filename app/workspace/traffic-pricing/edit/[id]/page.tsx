"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Tag, MapPin, DollarSign, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

// 模拟数据 - 可用标签
const availableTags = [
  "高消费",
  "企业主",
  "高管",
  "白领",
  "稳定收入",
  "普通用户",
  "学生",
  "年轻人",
  "家庭主妇",
  "退休人员",
  "创业者",
  "自由职业",
  "技术人员",
  "医疗从业者",
  "教育从业者",
]

// 模拟数据 - 可用地区
const availableRegions = [
  "全国",
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "成都",
  "重庆",
  "武汉",
  "西安",
  "南京",
  "天津",
  "苏州",
  "郑州",
  "长沙",
  "东北地区",
  "华北地区",
  "华南地区",
  "西南地区",
]

// 模拟数据 - 定价方案
const pricingData = {
  "1": {
    id: "1",
    name: "高价值客户定价",
    tags: ["高消费", "企业主", "高管"],
    regions: ["北京", "上海", "广州", "深圳"],
    price: 50,
    createdAt: "2025-02-15",
    status: "active",
  },
  "2": {
    id: "2",
    name: "中等价值客户定价",
    tags: ["白领", "稳定收入"],
    regions: ["全国"],
    price: 30,
    createdAt: "2025-02-10",
    status: "active",
  },
  "3": {
    id: "3",
    name: "普通客户定价",
    tags: ["普通用户"],
    regions: ["全国"],
    price: 15,
    createdAt: "2025-01-20",
    status: "active",
  },
  "4": {
    id: "4",
    name: "学生群体定价",
    tags: ["学生", "年轻人"],
    regions: ["全国"],
    price: 10,
    createdAt: "2025-01-15",
    status: "inactive",
  },
}

export default function EditPricingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [pricingName, setPricingName] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [price, setPrice] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [customTag, setCustomTag] = useState("")
  const [customRegion, setCustomRegion] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 模拟加载数据
    if (id && pricingData[id]) {
      const data = pricingData[id]
      setPricingName(data.name)
      setSelectedTags(data.tags)
      setSelectedRegions(data.regions)
      setPrice(data.price.toString())
      setIsActive(data.status === "active")
      setIsLoading(false)
    } else {
      // 如果找不到数据，返回列表页
      router.push("/workspace/traffic-pricing")
    }
  }, [id, router])

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleAddCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags([...selectedTags, customTag])
      setCustomTag("")
    }
  }

  const handleAddRegion = (region: string) => {
    if (!selectedRegions.includes(region)) {
      setSelectedRegions([...selectedRegions, region])
    }
  }

  const handleRemoveRegion = (region: string) => {
    setSelectedRegions(selectedRegions.filter((r) => r !== region))
  }

  const handleAddCustomRegion = () => {
    if (customRegion && !selectedRegions.includes(customRegion)) {
      setSelectedRegions([...selectedRegions, customRegion])
      setCustomRegion("")
    }
  }

  const handleSave = () => {
    // 这里可以添加表单验证
    if (!pricingName || selectedTags.length === 0 || selectedRegions.length === 0 || !price) {
      alert("请填写完整信息")
      return
    }

    // 模拟保存操作
    console.log({
      id,
      name: pricingName,
      tags: selectedTags,
      regions: selectedRegions,
      price: Number.parseFloat(price),
      status: isActive ? "active" : "inactive",
    })

    // 返回列表页
    router.push("/workspace/traffic-pricing")
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight ml-2">编辑流量定价</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>定价信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pricing-name">定价名称</Label>
            <Input
              id="pricing-name"
              placeholder="输入定价方案名称"
              value={pricingName}
              onChange={(e) => setPricingName(e.target.value)}
            />
          </div>

          <Tabs defaultValue="tags">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tags">用户标签</TabsTrigger>
              <TabsTrigger value="regions">适用地区</TabsTrigger>
            </TabsList>
            <TabsContent value="tags" className="space-y-4">
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedTags.map((tag) => (
                  <Badge key={tag} className="flex items-center gap-1 px-3 py-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="添加自定义标签"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddCustomTag()
                    }
                  }}
                />
                <Button onClick={handleAddCustomTag}>
                  <Plus className="h-4 w-4 mr-1" />
                  添加
                </Button>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">常用标签</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="regions" className="space-y-4">
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedRegions.map((region) => (
                  <Badge key={region} className="flex items-center gap-1 px-3 py-1">
                    <MapPin className="h-3 w-3" />
                    {region}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => handleRemoveRegion(region)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="添加自定义地区"
                  value={customRegion}
                  onChange={(e) => setCustomRegion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddCustomRegion()
                    }
                  }}
                />
                <Button onClick={handleAddCustomRegion}>
                  <Plus className="h-4 w-4 mr-1" />
                  添加
                </Button>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">常用地区</h4>
                <div className="flex flex-wrap gap-2">
                  {availableRegions.map((region) => (
                    <Badge
                      key={region}
                      variant={selectedRegions.includes(region) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleAddRegion(region)}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="price">价格设置 (元/人)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                className="pl-9"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="active-status" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="active-status">启用状态</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

