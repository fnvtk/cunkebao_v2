"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Smartphone, Users, MessageSquare, ImageIcon, TrendingUp, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// 场景获客数据类型定义
interface ScenarioData {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  stats: {
    totalPlans: number
    activePlans: number
    totalAcquired: number
    todayAcquired: number
  }
  status: "active" | "inactive"
  category: string
}

export default function ScenariosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [scenarios, setScenarios] = useState<ScenarioData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  // 模拟场景数据
  const mockScenarios: ScenarioData[] = [
    {
      id: "phone",
      name: "手机号获客",
      description: "通过手机号码进行精准获客，支持批量导入和智能筛选",
      icon: <Smartphone className="h-6 w-6" />,
      stats: {
        totalPlans: 12,
        activePlans: 8,
        totalAcquired: 2580,
        todayAcquired: 45,
      },
      status: "active",
      category: "通讯获客",
    },
    {
      id: "weixinqun",
      name: "微信群获客",
      description: "通过微信群进行社群营销获客，自动化群管理",
      icon: <Users className="h-6 w-6" />,
      stats: {
        totalPlans: 8,
        activePlans: 6,
        totalAcquired: 1890,
        todayAcquired: 32,
      },
      status: "active",
      category: "社交获客",
    },
    {
      id: "douyin",
      name: "抖音获客",
      description: "抖音平台内容营销和用户获取，支持评论互动",
      icon: <MessageSquare className="h-6 w-6" />,
      stats: {
        totalPlans: 15,
        activePlans: 12,
        totalAcquired: 3420,
        todayAcquired: 78,
      },
      status: "active",
      category: "短视频获客",
    },
    {
      id: "haibao",
      name: "海报获客",
      description: "通过精美海报进行视觉营销获客，支持多平台分发",
      icon: <ImageIcon className="h-6 w-6" />,
      stats: {
        totalPlans: 6,
        activePlans: 4,
        totalAcquired: 1250,
        todayAcquired: 28,
      },
      status: "active",
      category: "内容获客",
    },
  ]

  useEffect(() => {
    // 模拟API调用
    const fetchScenarios = async () => {
      try {
        setLoading(true)
        // 模拟网络延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setScenarios(mockScenarios)
      } catch (error) {
        toast({
          title: "加载失败",
          description: "无法加载场景数据，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchScenarios()
  }, [toast])

  // 处理新建计划
  const handleNewPlan = () => {
    router.push("/plans/new")
  }

  // 处理场景新建
  const handleScenarioNew = (scenarioId: string) => {
    router.push(`/plans/new?scenario=${scenarioId}`)
  }

  // 处理场景查看
  const handleScenarioView = (scenarioId: string) => {
    router.push(`/scenarios/${scenarioId}`)
  }

  // 过滤场景数据
  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || scenario.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // 获取所有分类
  const categories = ["all", ...Array.from(new Set(scenarios.map((s) => s.category)))]

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">场景获客</h1>
            <p className="text-muted-foreground">选择合适的获客场景，开始您的营销之旅</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">场景获客</h1>
          <p className="text-muted-foreground">选择合适的获客场景，开始您的营销之旅</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={handleNewPlan} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="h-4 w-4 mr-1" />
            新建计划
          </Button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索场景..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.slice(1).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 场景卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredScenarios.map((scenario) => (
          <Card key={scenario.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{scenario.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    <Badge variant={scenario.status === "active" ? "default" : "secondary"} className="text-xs">
                      {scenario.status === "active" ? "运行中" : "已停止"}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm">{scenario.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 统计数据 */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">总计划</span>
                  <span className="font-semibold">{scenario.stats.totalPlans}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-gray-600">活跃</span>
                  <span className="font-semibold text-green-600">{scenario.stats.activePlans}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">总获客</span>
                  <span className="font-semibold text-blue-600">{scenario.stats.totalAcquired}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-600">今日</span>
                  <span className="font-semibold text-orange-600">{scenario.stats.todayAcquired}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleScenarioView(scenario.id)}
                >
                  查看详情
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => handleScenarioNew(scenario.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  新建
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredScenarios.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的场景</h3>
          <p className="text-gray-500 mb-4">尝试调整搜索条件或筛选器</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setFilterCategory("all")
            }}
          >
            清除筛选
          </Button>
        </div>
      )}
    </div>
  )
}
