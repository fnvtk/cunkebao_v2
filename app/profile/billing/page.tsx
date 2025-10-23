"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, RefreshCw, Zap, TrendingUp, Calendar, Filter, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

// 消费记录数据类型
interface ConsumptionRecord {
  id: string
  date: string
  type: string
  description: string
  amount: number
  computePower: number
  status: "completed" | "pending" | "failed"
}

// 模拟消费记录数据
const mockConsumptionRecords: ConsumptionRecord[] = [
  {
    id: "1",
    date: "2025/2/9 14:30:00",
    type: "AI分析",
    description: "客户意向分析处理",
    amount: 28.5,
    computePower: 150,
    status: "completed",
  },
  {
    id: "2",
    date: "2025/2/9 11:20:00",
    type: "内容生成",
    description: "智能文案生成",
    amount: 15.2,
    computePower: 80,
    status: "completed",
  },
  {
    id: "3",
    date: "2025/2/8 16:45:00",
    type: "数据训练",
    description: "模型训练任务",
    amount: 45.8,
    computePower: 240,
    status: "completed",
  },
  {
    id: "4",
    date: "2025/2/8 09:15:00",
    type: "智能推荐",
    description: "个性化推荐算法",
    amount: 12.3,
    computePower: 65,
    status: "completed",
  },
  {
    id: "5",
    date: "2025/2/7 20:30:00",
    type: "语音识别",
    description: "语音转文字处理",
    amount: 8.7,
    computePower: 45,
    status: "pending",
  },
]

// 模拟概览数据
const mockOverviewData = {
  totalBalance: 1288.5,
  totalComputePower: 2850,
  usedComputePower: 1420,
  todayUsage: 285,
  monthlyUsage: 1420,
  growthRate: 15.3,
}

export default function BillingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [consumptionRecords, setConsumptionRecords] = useState<ConsumptionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setConsumptionRecords(mockConsumptionRecords)
    } catch (error) {
      console.error("加载数据失败:", error)
      setConsumptionRecords(mockConsumptionRecords)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 处理返回
  const handleBack = () => {
    router.back()
  }

  // 处理刷新
  const handleRefresh = () => {
    loadData()
  }

  // 跳转到购买页面
  const handlePurchase = () => {
    router.push("/profile/billing/purchase")
  }

  // 获取状态文本和颜色
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return { text: "已完成", color: "bg-green-100 text-green-700" }
      case "pending":
        return { text: "处理中", color: "bg-yellow-100 text-yellow-700" }
      case "failed":
        return { text: "失败", color: "bg-red-100 text-red-700" }
      default:
        return { text: "未知", color: "bg-gray-100 text-gray-700" }
    }
  }

  // 过滤消费记录
  const filteredRecords = consumptionRecords.filter((record) => {
    const typeMatch = filterType === "all" || record.type === filterType
    const statusMatch = filterStatus === "all" || record.status === filterStatus
    return typeMatch && statusMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">算力管理</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="records">消费记录</TabsTrigger>
          </TabsList>

          {/* 概览标签页 */}
          <TabsContent value="overview" className="space-y-4">
            {/* 余额和算力概览 */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">账户余额</p>
                      <p className="text-lg font-bold text-blue-600">¥{mockOverviewData.totalBalance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">总算力</p>
                      <p className="text-lg font-bold text-purple-600">{mockOverviewData.totalComputePower}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 使用情况统计 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">使用情况</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{mockOverviewData.todayUsage}</p>
                    <p className="text-xs text-gray-500">今日使用</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{mockOverviewData.monthlyUsage}</p>
                    <p className="text-xs text-gray-500">本月使用</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {mockOverviewData.totalComputePower - mockOverviewData.usedComputePower}
                    </p>
                    <p className="text-xs text-gray-500">剩余算力</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 快速操作 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handlePurchase}
                    className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    购买算力包
                  </Button>
                  <Button variant="outline" className="h-12 bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    使用记录
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 消费记录标签页 */}
          <TabsContent value="records" className="space-y-4">
            {/* 筛选器 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="AI分析">AI分析</SelectItem>
                      <SelectItem value="内容生成">内容生成</SelectItem>
                      <SelectItem value="数据训练">数据训练</SelectItem>
                      <SelectItem value="智能推荐">智能推荐</SelectItem>
                      <SelectItem value="语音识别">语音识别</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="pending">处理中</SelectItem>
                      <SelectItem value="failed">失败</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 消费记录列表 */}
            <div className="space-y-3">
              {filteredRecords.map((record) => {
                const statusInfo = getStatusInfo(record.status)
                return (
                  <Card key={record.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{record.type}</h3>
                          <Badge className={`${statusInfo.color} text-xs px-2 py-1`}>{statusInfo.text}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">-¥{record.amount}</p>
                          <p className="text-xs text-gray-500">{record.computePower} 算力</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      <p className="text-xs text-gray-400">{record.date}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">暂无符合条件的记录</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
