"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Plus, Tag, MapPin, Search, ChevronLeft, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// 模拟数据
const initialPricingData = [
  {
    id: "1",
    name: "高价值客户定价",
    tags: ["高消费", "企业主", "高管"],
    regions: ["北京", "上海", "广州", "深圳"],
    price: 50,
    createdAt: "2025-02-15",
    status: "active",
  },
  {
    id: "2",
    name: "中等价值客户定价",
    tags: ["白领", "稳定收入"],
    regions: ["全国"],
    price: 30,
    createdAt: "2025-02-10",
    status: "active",
  },
  {
    id: "3",
    name: "普通客户定价",
    tags: ["普通用户"],
    regions: ["全国"],
    price: 15,
    createdAt: "2025-01-20",
    status: "active",
  },
  {
    id: "4",
    name: "学生群体定价",
    tags: ["学生", "年轻人"],
    regions: ["全国"],
    price: 10,
    createdAt: "2025-01-15",
    status: "inactive",
  },
]

export default function TrafficPricingPage() {
  const router = useRouter()
  const [pricingData, setPricingData] = useState(initialPricingData)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredData = pricingData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.regions.some((region) => region.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleCreateNewPricing = () => {
    router.push("/workspace/traffic-pricing/new")
  }

  const handleEditPricing = (id: string) => {
    router.push(`/workspace/traffic-pricing/edit/${id}`)
  }

  const handleBack = () => {
    router.push("/workspace")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between border-b pb-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold tracking-tight">流量定价</h2>
        <Button onClick={handleCreateNewPricing}>
          <Plus className="mr-2 h-4 w-4" />
          新建定价
        </Button>
      </div>

      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索定价名称、标签或地区..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((pricing) => (
          <Card
            key={pricing.id}
            className={`border-l-4 ${
              pricing.status === "active" ? "border-l-green-500" : "border-l-gray-300"
            } hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-4">
              <div className="grid grid-cols-12 gap-4">
                {/* 左侧: 名称、标签和地区 */}
                <div className="col-span-12 sm:col-span-7">
                  {/* 名称和状态 */}
                  <div className="flex items-center mb-3">
                    <h3 className="font-medium text-base">{pricing.name}</h3>
                    <Badge variant={pricing.status === "active" ? "default" : "secondary"} className="ml-2">
                      {pricing.status === "active" ? "启用中" : "已停用"}
                    </Badge>
                  </div>

                  {/* 标签 */}
                  <div className="flex items-start mb-2">
                    <div className="flex items-center text-gray-500 mr-2 mt-0.5">
                      <Tag className="h-3.5 w-3.5 mr-1" />
                      <span className="text-sm whitespace-nowrap">标签:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pricing.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 地区 */}
                  <div className="flex items-start">
                    <div className="flex items-center text-gray-500 mr-2 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span className="text-sm whitespace-nowrap">地区:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pricing.regions.map((region, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 右侧: 价格和编辑按钮 */}
                <div className="col-span-12 sm:col-span-5 flex items-center justify-between sm:justify-end sm:space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* 价格 */}
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <span className="text-xl font-bold text-emerald-600">{pricing.price}</span>
                    <span className="text-sm text-gray-500 ml-1">元/人</span>
                  </div>

                  {/* 编辑按钮 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPricing(pricing.id)}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    编辑
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">暂无定价数据</p>
          <Button onClick={handleCreateNewPricing}>
            <Plus className="mr-2 h-4 w-4" />
            创建第一个定价
          </Button>
        </div>
      )}
    </div>
  )
}

