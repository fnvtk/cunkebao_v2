"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Zap,
  BarChart3,
  Calendar,
  HelpCircle,
  TrendingUp,
  Download,
  RefreshCw,
  CreditCard,
  Shield,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

// 模拟算力数据 - 保持1位小数
const mockComputingPowerData = {
  remainingPower: 9303.5,
  totalPower: 15000.0,
  yesterdayConsumedPower: 160.6,
  todayConsumedPower: 86.4,
  weeklyAverage: 142.3,
  monthlyTotal: 4267.8,
  efficiency: 87.5,
  predictedDays: 65,
}

// AI服务类型配置 - 整合到消费记录中
const aiServiceTypes = {
  chat: { name: "智能对话", icon: "💬", color: "text-blue-600", bgColor: "bg-blue-50" },
  content: { name: "内容生成", icon: "✍️", color: "text-green-600", bgColor: "bg-green-50" },
  analysis: { name: "数据分析", icon: "📊", color: "text-purple-600", bgColor: "bg-purple-50" },
  automation: { name: "自动化", icon: "🤖", color: "text-orange-600", bgColor: "bg-orange-50" },
}

// 模拟算力消费记录 - 增加更多详细信息
const mockConsumptionRecords = [
  {
    id: 1,
    serviceType: "chat",
    businessType: "智能客服",
    callModel: "GPT4oMini",
    consumedPower: 2.2,
    remainingPower: 9303.5,
    time: "2025/2/22 17:02:00",
    duration: "0.8s",
    tokens: 1240,
    success: true,
    department: "销售部",
    operator: "张小明",
  },
  {
    id: 2,
    serviceType: "content",
    businessType: "内容创作",
    callModel: "GPT5",
    consumedPower: 1.7,
    remainingPower: 9305.7,
    time: "2025/2/22 17:02:00",
    duration: "1.2s",
    tokens: 890,
    success: true,
    department: "市场部",
    operator: "李小红",
  },
  {
    id: 3,
    serviceType: "analysis",
    businessType: "用户分析",
    callModel: "GPT4oMini",
    consumedPower: 2.3,
    remainingPower: 9307.4,
    time: "2025/2/22 15:43:00",
    duration: "2.1s",
    tokens: 1560,
    success: true,
    department: "运营部",
    operator: "王小强",
  },
  {
    id: 4,
    serviceType: "automation",
    businessType: "自动回复",
    callModel: "GPT4oMini",
    consumedPower: 0.8,
    remainingPower: 9308.2,
    time: "2025/2/22 14:25:00",
    duration: "0.5s",
    tokens: 420,
    success: false,
    department: "客服部",
    operator: "赵小丽",
  },
]

// 更新后的算力充值套餐 - 增加更多细节
const mockPowerPackages = [
  {
    id: "basic",
    name: "基础算力包",
    description: "适合个人用户日常使用",
    power: 1000,
    price: 98,
    originalPrice: 200,
    discount: 51,
    popular: false,
    features: ["基础AI对话", "内容生成", "7x24技术支持"],
    validDays: "永久有效",
    avgCostPerPower: 0.098,
  },
  {
    id: "standard",
    name: "标准算力包",
    description: "适合小团队批量使用",
    power: 7500,
    price: 598,
    originalPrice: 1500,
    discount: 60,
    popular: true,
    features: ["全功能AI服务", "优先技术支持", "使用统计报告", "API接入"],
    validDays: "永久有效",
    avgCostPerPower: 0.08,
  },
  {
    id: "premium",
    name: "高级算力包",
    description: "适合企业级大规模使用",
    power: 250000,
    price: 19800,
    originalPrice: 50000,
    discount: 60,
    popular: false,
    features: ["企业级AI服务", "专属客服", "定制化方案", "SLA保障", "数据安全认证"],
    validDays: "永久有效",
    avgCostPerPower: 0.079,
  },
]

export default function BillingPage() {
  const router = useRouter()
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedWechat, setSelectedWechat] = useState("")
  const [selectedVersion, setSelectedVersion] = useState("")
  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [selectedServiceType, setSelectedServiceType] = useState("")

  const handlePurchasePower = (packageId: string) => {
    console.log("购买算力包:", packageId)
  }

  const handleExportRecords = () => {
    console.log("导出消费记录")
  }

  const handleRefreshData = () => {
    console.log("刷新数据")
  }

  // 计算使用率
  const usageRate =
    ((mockComputingPowerData.totalPower - mockComputingPowerData.remainingPower) / mockComputingPowerData.totalPower) *
    100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 - 优化小图标显示 */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-blue-500" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">算力管理中心</h1>
              <p className="text-xs text-gray-500">Computing Power Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* 优化算力显示 - 使用小图标 */}
            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-md">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-sm font-medium text-blue-700">{mockComputingPowerData.remainingPower}</span>
              <span className="text-xs text-blue-500">算力</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefreshData}>
              <RefreshCw className="h-3 w-3 mr-1" />
              <span className="text-xs">刷新</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* 算力概览仪表板 - 重构移动端样式 */}
        <div className="space-y-4">
          {/* 主要统计卡片 - 重新设计为更紧凑的移动端样式 */}
          <div className="space-y-3">
            {/* 剩余算力卡片 - 主要展示 */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-blue-100 text-sm font-medium mb-1">剩余算力</p>
                    <p className="text-3xl font-bold mb-1">{mockComputingPowerData.remainingPower}</p>
                    <p className="text-blue-100 text-xs">总计 {mockComputingPowerData.totalPower}</p>
                  </div>
                  <div className="bg-white/20 rounded-full p-2">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={usageRate} className="h-1.5 bg-blue-400" />
                  <p className="text-blue-100 text-xs mt-1">使用率 {usageRate.toFixed(1)}%</p>
                </div>
              </CardContent>
            </Card>

            {/* 其他统计 - 2x2网格布局 */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-white/20 rounded-full p-1.5">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-green-100 text-xs font-medium mb-1">今日消耗</p>
                    <p className="text-2xl font-bold">{mockComputingPowerData.todayConsumedPower}</p>
                    <p className="text-green-100 text-xs">周均 {mockComputingPowerData.weeklyAverage}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-white/20 rounded-full p-1.5">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs font-medium mb-1">使用效率</p>
                    <p className="text-2xl font-bold">{mockComputingPowerData.efficiency}%</p>
                    <p className="text-purple-100 text-xs">本月优秀</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-white/20 rounded-full p-1.5">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-orange-100 text-xs font-medium mb-1">预计可用</p>
                    <p className="text-2xl font-bold">{mockComputingPowerData.predictedDays}</p>
                    <p className="text-orange-100 text-xs">天</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-600 to-gray-700 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-white/20 rounded-full p-1.5">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-100 text-xs font-medium mb-1">昨日消耗</p>
                    <p className="text-2xl font-bold">{mockComputingPowerData.yesterdayConsumedPower}</p>
                    <p className="text-gray-100 text-xs">月总 {mockComputingPowerData.monthlyTotal}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 算力预警提示 */}
          {mockComputingPowerData.remainingPower < 1000 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-sm">
                您的算力余额不足1000，建议及时充值以确保服务正常使用。
                <Button variant="link" className="text-orange-600 p-0 ml-2 h-auto text-sm">
                  立即充值
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 标签页内容 - 移动端优化 */}
        <Tabs defaultValue="records" className="w-full">
          <div className="mb-4">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="records" className="text-sm">
                消费记录
              </TabsTrigger>
              <TabsTrigger value="purchase" className="text-sm">
                购买算力
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 算力消费记录 - 移动端优化 */}
          <TabsContent value="records" className="space-y-4">
            {/* 筛选和操作栏 - 移动端简化 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">筛选条件</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExportRecords}>
                      <Download className="h-3 w-3 mr-1" />
                      <span className="text-xs">导出</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block font-medium">部门</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="全部部门" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部部门</SelectItem>
                        <SelectItem value="sales">销售部</SelectItem>
                        <SelectItem value="marketing">市场部</SelectItem>
                        <SelectItem value="operation">运营部</SelectItem>
                        <SelectItem value="service">客服部</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-1 block font-medium">AI模型</label>
                    <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="全部模型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部模型</SelectItem>
                        <SelectItem value="gpt4mini">GPT4oMini</SelectItem>
                        <SelectItem value="gpt5">GPT5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-1 block font-medium">服务类型</label>
                    <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="全部服务" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部服务</SelectItem>
                        <SelectItem value="chat">智能对话</SelectItem>
                        <SelectItem value="content">内容生成</SelectItem>
                        <SelectItem value="analysis">数据分析</SelectItem>
                        <SelectItem value="automation">自动化</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full h-8 text-xs">查询记录</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 服务类型说明卡片 - 移动端优化 */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-3 w-3 text-blue-600" />
                  <h4 className="text-sm font-medium text-blue-800">AI服务类型说明</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(aiServiceTypes).map(([key, service]) => (
                    <div key={key} className="flex items-center space-x-1 text-xs">
                      <span className="text-sm">{service.icon}</span>
                      <span className={service.color}>{service.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-2.5 w-2.5 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {key === "chat" && "1-5算力/次 - AI聊天、客服回复"}
                              {key === "content" && "3-10算力/次 - 内容生成、文案创作"}
                              {key === "analysis" && "5-15算力/次 - 数据分析、用户画像"}
                              {key === "automation" && "2-8算力/次 - 自动回复、批量处理"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 算力消费记录表格 - 移动端优化 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span>消费明细</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-blue-600 text-xs">
                    共 {mockConsumptionRecords.length} 条
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockConsumptionRecords.map((record) => {
                    const serviceConfig = aiServiceTypes[record.serviceType as keyof typeof aiServiceTypes]
                    return (
                      <Card key={record.id} className="border border-gray-200">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className={`${serviceConfig.bgColor} rounded-full p-1`}>
                                <span className="text-sm">{serviceConfig.icon}</span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-1 mb-1">
                                  <h4 className="text-sm font-medium text-gray-900">{record.businessType}</h4>
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {record.callModel}
                                  </Badge>
                                  {record.success ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                  )}
                                </div>
                                <div className="text-xs text-gray-600">
                                  <div>
                                    {record.department} · {record.operator}
                                  </div>
                                  <div>
                                    {record.time} · 耗时 {record.duration}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-base font-bold text-red-600">-{record.consumedPower}</div>
                              <div className="text-xs text-gray-500">剩余 {record.remainingPower}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Token</div>
                              <div className="text-sm font-medium">{record.tokens.toLocaleString()}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">类型</div>
                              <div className={`text-sm font-medium ${serviceConfig.color}`}>{serviceConfig.name}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">状态</div>
                              <div
                                className={`text-sm font-medium ${record.success ? "text-green-600" : "text-red-600"}`}
                              >
                                {record.success ? "成功" : "失败"}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* 分页 - 移动端优化 */}
                <div className="flex justify-center items-center space-x-2 mt-6 pt-4 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    上一页
                  </Button>
                  <div className="flex space-x-1">
                    <Button variant="default" size="sm" className="bg-blue-500 text-xs px-2">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs px-2 bg-transparent">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs px-2 bg-transparent">
                      3
                    </Button>
                    <span className="px-1 text-xs text-gray-500">...</span>
                    <Button variant="outline" size="sm" className="text-xs px-2 bg-transparent">
                      514
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    下一页
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 购买算力 - 移动端优化 */}
          <TabsContent value="purchase" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>算力充值套餐</span>
                  </CardTitle>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Shield className="h-3 w-3" />
                    <span>安全保障</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPowerPackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className={`border-2 transition-all ${
                        pkg.popular ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50" : "border-gray-200"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-base font-bold text-gray-900">{pkg.name}</h4>
                              {pkg.popular && (
                                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                  🔥 推荐
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                {pkg.discount}% OFF
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>

                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-1">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="font-bold text-blue-600 text-sm">
                                  {pkg.power.toLocaleString()} 算力
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-600">{pkg.validDays}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {pkg.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="text-right ml-4">
                            <div className="mb-2">
                              <div className="flex items-baseline space-x-1">
                                <span className="text-xl font-bold text-red-600">¥{pkg.price.toLocaleString()}</span>
                                <span className="text-sm text-gray-400 line-through">
                                  ¥{pkg.originalPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-xs text-green-600 font-medium">
                                节省 ¥{(pkg.originalPrice - pkg.price).toLocaleString()}
                              </div>
                            </div>

                            <div className="text-xs text-gray-500 mb-3">¥{pkg.avgCostPerPower.toFixed(3)}/算力</div>

                            <Button
                              size="sm"
                              className={`w-full ${
                                pkg.popular
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                  : "bg-blue-500 hover:bg-blue-600"
                              } text-white text-xs`}
                              onClick={() => handlePurchasePower(pkg.id)}
                            >
                              <CreditCard className="h-3 w-3 mr-1" />
                              立即购买
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 自定义购买算力 - 移动端优化 */}
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-4">
                <div className="text-center mb-4">
                  <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-gray-900 mb-1">自定义算力包</h4>
                  <p className="text-sm text-gray-600">根据您的实际需求，灵活购买算力</p>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-2 text-center">
                    购买范围：50-50000元 (1元=10算力) | 永久有效
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="请输入购买金额"
                        min="50"
                        max="50000"
                        className="w-full px-3 py-2 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-medium"
                      />
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white px-4 text-xs">
                      立即购买
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 支付保障说明 - 移动端优化 */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-green-800 mb-2">安全保障承诺</h4>
                    <div className="grid grid-cols-1 gap-2 text-xs text-green-700">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>算力永不过期，随时使用</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>透明计费，每次调用可查</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>7x24小时技术支持</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>企业级数据安全保障</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
