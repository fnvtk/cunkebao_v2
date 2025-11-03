"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, RefreshCw, Zap, TrendingUp, Calendar, Filter, ShoppingCart, Package } from "lucide-react"
import { useRouter } from "next/navigation"

interface ConsumptionRecord {
  id: string
  date: string
  type: string
  description: string
  computePower: number
  status: "completed" | "pending" | "failed"
}

const mockConsumptionRecords: ConsumptionRecord[] = [
  {
    id: "1",
    date: "2025/2/9 14:30:00",
    type: "AI助手对话",
    description: "使用AI助手进行客户意向分析",
    computePower: 150,
    status: "completed",
  },
  {
    id: "2",
    date: "2025/2/9 13:45:00",
    type: "智能获客",
    description: "附近的人场景获客任务执行",
    computePower: 185,
    status: "completed",
  },
  {
    id: "3",
    date: "2025/2/9 11:20:00",
    type: "内容生成",
    description: "AI生成朋友圈营销文案",
    computePower: 80,
    status: "completed",
  },
  {
    id: "4",
    date: "2025/2/9 10:15:00",
    type: "数据分析",
    description: "客户行为数据智能分析",
    computePower: 225,
    status: "completed",
  },
  {
    id: "5",
    date: "2025/2/8 16:45:00",
    type: "自动化任务",
    description: "群发消息自动化执行",
    computePower: 99,
    status: "completed",
  },
  {
    id: "6",
    date: "2025/2/8 15:30:00",
    type: "内容优化",
    description: "营销内容AI优化建议",
    computePower: 66,
    status: "completed",
  },
  {
    id: "7",
    date: "2025/2/8 14:20:00",
    type: "智能推荐",
    description: "客户标签智能推荐",
    computePower: 44,
    status: "completed",
  },
  {
    id: "8",
    date: "2025/2/8 09:15:00",
    type: "AI分析",
    description: "目标客户画像分析",
    computePower: 170,
    status: "completed",
  },
  {
    id: "9",
    date: "2025/2/7 20:30:00",
    type: "语音识别",
    description: "客户语音消息转文字",
    computePower: 45,
    status: "pending",
  },
  {
    id: "10",
    date: "2025/2/7 18:45:00",
    type: "图片生成",
    description: "AI生成营销海报",
    computePower: 135,
    status: "completed",
  },
  {
    id: "11",
    date: "2025/2/7 16:20:00",
    type: "智能筛选",
    description: "潜在客户智能筛选",
    computePower: 104,
    status: "completed",
  },
  {
    id: "12",
    date: "2025/2/7 14:10:00",
    type: "自动回复",
    description: "客户消息AI自动回复",
    computePower: 34,
    status: "completed",
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

interface PurchaseRecord {
  id: string
  date: string
  packageName: string
  computePower: number
  amount: number
  paymentMethod: string
  status: "completed" | "pending" | "failed"
}

const mockPurchaseRecords: PurchaseRecord[] = [
  {
    id: "1",
    date: "2025/2/9 10:30:00",
    packageName: "标准算力包",
    computePower: 1000,
    amount: 99,
    paymentMethod: "微信支付",
    status: "completed",
  },
  {
    id: "2",
    date: "2025/2/5 15:20:00",
    packageName: "高级算力包",
    computePower: 3000,
    amount: 268,
    paymentMethod: "支付宝",
    status: "completed",
  },
  {
    id: "3",
    date: "2025/2/1 09:15:00",
    packageName: "基础算力包",
    computePower: 500,
    amount: 50,
    paymentMethod: "微信支付",
    status: "completed",
  },
  {
    id: "4",
    date: "2025/1/28 14:45:00",
    packageName: "企业算力包",
    computePower: 10000,
    amount: 799,
    paymentMethod: "企业转账",
    status: "completed",
  },
  {
    id: "5",
    date: "2025/1/25 11:30:00",
    packageName: "标准算力包",
    computePower: 1000,
    amount: 99,
    paymentMethod: "微信支付",
    status: "completed",
  },
]

export default function BillingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [consumptionRecords, setConsumptionRecords] = useState<ConsumptionRecord[]>([])
  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [purchaseFilterStatus, setPurchaseFilterStatus] = useState("all")

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setConsumptionRecords(mockConsumptionRecords)
      setPurchaseRecords(mockPurchaseRecords)
    } catch (error) {
      console.error("加载数据失败:", error)
      setConsumptionRecords(mockConsumptionRecords)
      setPurchaseRecords(mockPurchaseRecords)
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

  const handleConsumptionRecords = () => {
    router.push("/profile/billing/consumption")
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

  const filteredRecords = consumptionRecords.filter((record) => {
    const typeMatch = filterType === "all" || record.type === filterType
    const statusMatch = filterStatus === "all" || record.status === filterStatus
    return typeMatch && statusMatch
  })

  const filteredPurchaseRecords = purchaseRecords.filter((record) => {
    const statusMatch = purchaseFilterStatus === "all" || record.status === purchaseFilterStatus
    return statusMatch
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
            <TabsTrigger value="records">使用记录</TabsTrigger>
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
                  <Button onClick={handleConsumptionRecords} variant="outline" className="h-12 bg-transparent">
                    <Package className="h-4 w-4 mr-2" />
                    消费记录
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用记录标签页保持不变 */}
          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">筛选条件</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="操作类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="AI助手对话">AI助手对话</SelectItem>
                        <SelectItem value="智能获客">智能获客</SelectItem>
                        <SelectItem value="内容生成">内容生成</SelectItem>
                        <SelectItem value="数据分析">数据分析</SelectItem>
                        <SelectItem value="自动化任务">自动化任务</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="h-9">
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
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{filteredRecords.length}</p>
                    <p className="text-xs text-gray-600">记录总数</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {filteredRecords.reduce((sum, record) => sum + record.computePower, 0)}
                    </p>
                    <p className="text-xs text-gray-600">总消耗算力</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {filteredRecords.map((record) => {
                const statusInfo = getStatusInfo(record.status)
                return (
                  <Card key={record.id} className="bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            {record.type}
                          </Badge>
                          <Badge className={`${statusInfo.color} text-xs px-2 py-1`}>{statusInfo.text}</Badge>
                        </div>
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2">{record.description}</h3>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-purple-600">消耗 {record.computePower} 算力</span>
                        </div>
                        <p className="text-xs text-gray-400">{record.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Calendar className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500 font-medium">暂无符合条件的使用记录</p>
                <p className="text-sm text-gray-400 mt-1">尝试调整筛选条件查看更多记录</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
