"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

// 场景数据类型定义
interface ScenarioData {
  id: string
  name: string
  icon: string
  todayCount: number
  growthRate: number
  status: "active" | "inactive"
  type: "normal" | "ai"
}

// 模拟数据
const mockScenarios: ScenarioData[] = [
  { id: "haibao", name: "海报获客", icon: "🎨", todayCount: 167, growthRate: 10.2, status: "active", type: "normal" },
  { id: "order", name: "订单获客", icon: "📋", todayCount: 112, growthRate: 7.8, status: "active", type: "normal" },
  { id: "douyin", name: "抖音获客", icon: "🎵", todayCount: 156, growthRate: 12.5, status: "active", type: "normal" },
  {
    id: "xiaohongshu",
    name: "小红书获客",
    icon: "📖",
    todayCount: 89,
    growthRate: 8.3,
    status: "active",
    type: "normal",
  },
  { id: "phone", name: "电话获客", icon: "📞", todayCount: 42, growthRate: 15.8, status: "active", type: "normal" },
  {
    id: "gongzhonghao",
    name: "公众号获客",
    icon: "💚",
    todayCount: 234,
    growthRate: 15.7,
    status: "active",
    type: "normal",
  },
  {
    id: "weixinqun",
    name: "微信群获客",
    icon: "💬",
    todayCount: 145,
    growthRate: 11.2,
    status: "active",
    type: "normal",
  },
  { id: "payment", name: "付款码获客", icon: "💳", todayCount: 78, growthRate: 9.5, status: "active", type: "normal" },
  { id: "api", name: "API获客", icon: "🔗", todayCount: 198, growthRate: 14.3, status: "active", type: "normal" },
  { id: "ai-friend", name: "AI智能加友", icon: "🤖", todayCount: 245, growthRate: 18.5, status: "active", type: "ai" },
  { id: "ai-group", name: "AI群引流", icon: "🤖", todayCount: 178, growthRate: 15.2, status: "active", type: "ai" },
  { id: "ai-convert", name: "AI运营转化", icon: "🤖", todayCount: 134, growthRate: 12.8, status: "active", type: "ai" },
]

export default function ScenariosPage() {
  const router = useRouter()
  const [scenarios, setScenarios] = useState<ScenarioData[]>([])
  const [loading, setLoading] = useState(true)

  // 加载场景数据
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        setLoading(true)
        // 模拟API调用延迟
        await new Promise((resolve) => setTimeout(resolve, 500))
        setScenarios(mockScenarios)
      } catch (error) {
        console.error("加载场景数据失败:", error)
        // 使用模拟数据作为降级方案
        setScenarios(mockScenarios)
      } finally {
        setLoading(false)
      }
    }

    loadScenarios()
  }, [])

  // 处理场景点击
  const handleScenarioClick = (scenarioId: string) => {
    router.push(`/scenarios/${scenarioId}`)
  }

  // 处理新建计划 - 跳转到计划创建页面
  const handleNewPlan = () => {
    router.push("/plans/new")
  }

  // 处理特定场景的新建计划
  const handleScenarioNewPlan = (scenarioId: string) => {
    router.push(`/plans/new?scenario=${scenarioId}`)
  }

  // 处理返回
  const handleBack = () => {
    router.back()
  }

  // 格式化增长率显示
  const formatGrowthRate = (rate: number) => {
    return rate > 0 ? `+${rate}%` : `${rate}%`
  }

  // 获取增长率颜色
  const getGrowthColor = (rate: number) => {
    return rate > 0 ? "text-green-500" : rate < 0 ? "text-red-500" : "text-gray-500"
  }

  // 分离常规场景和AI场景
  const normalScenarios = scenarios.filter((s) => s.type === "normal")
  const aiScenarios = scenarios.filter((s) => s.type === "ai")

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">场景获客</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={handleNewPlan} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-1" />
              新建计划
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4 space-y-6">
        {/* 常规获客场景 */}
        <div className="grid grid-cols-2 gap-3">
          {normalScenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="p-4 hover:shadow-md transition-all cursor-pointer bg-white relative group"
              onClick={() => handleScenarioClick(scenario.id)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-2xl mb-1">{scenario.icon}</div>
                <h3 className="font-medium text-sm">{scenario.name}</h3>
                <div className="text-xs text-gray-500">
                  今日: <span className="font-semibold text-gray-900">{scenario.todayCount}</span>
                </div>
                <div className={`text-xs font-medium flex items-center ${getGrowthColor(scenario.growthRate)}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {formatGrowthRate(scenario.growthRate)}
                </div>
              </div>

              {/* 悬浮时显示新建按钮 */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleScenarioNewPlan(scenario.id)
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  新建
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* AI智能获客部分 */}
        {aiScenarios.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="text-blue-500">🤖</div>
              <h2 className="text-lg font-medium">AI智能获客</h2>
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-600">
                Beta
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {aiScenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className="p-4 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-white border-blue-200 relative group"
                  onClick={() => handleScenarioClick(scenario.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl mb-1">{scenario.icon}</div>
                    <h3 className="font-medium text-sm">{scenario.name}</h3>
                    <div className="text-xs text-gray-600">
                      智能分析客户画像，
                      <br />
                      自动优化获客策略
                    </div>
                    <div className="text-xs text-gray-500">
                      今日: <span className="font-semibold text-gray-900">{scenario.todayCount}</span>
                    </div>
                    <div className={`text-xs font-medium flex items-center ${getGrowthColor(scenario.growthRate)}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {formatGrowthRate(scenario.growthRate)}
                    </div>
                  </div>

                  {/* 悬浮时显示新建按钮 */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleScenarioNewPlan(scenario.id)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      新建
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部导航占位 */}
      <div className="h-20"></div>
    </div>
  )
}
