"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

// 场景数据类型定义
interface ScenarioData {
  id: string
  name: string
  icon: string
  todayCount: number
  growthRate: number
  status: "active" | "inactive"
  description: string
}

// 静态场景数据 - 匹配version1的数据
const staticScenarios: ScenarioData[] = [
  {
    id: "haibao",
    name: "海报获客",
    icon: "🎨",
    todayCount: 167,
    growthRate: 10.2,
    status: "active",
    description: "通过海报推广获取潜在客户",
  },
  {
    id: "order",
    name: "订单获客",
    icon: "📋",
    todayCount: 112,
    growthRate: 7.8,
    status: "active",
    description: "订单场景下的客户获取",
  },
  {
    id: "douyin",
    name: "抖音获客",
    icon: "🎵",
    todayCount: 156,
    growthRate: 12.5,
    status: "active",
    description: "抖音平台客户获取与转化",
  },
  {
    id: "xiaohongshu",
    name: "小红书获客",
    icon: "📖",
    todayCount: 89,
    growthRate: 8.3,
    status: "active",
    description: "小红书平台营销获客",
  },
  {
    id: "phone",
    name: "电话获客",
    icon: "📞",
    todayCount: 42,
    growthRate: 15.8,
    status: "active",
    description: "通过电话外呼进行客户获取",
  },
  {
    id: "gongzhonghao",
    name: "公众号获客",
    icon: "💚",
    todayCount: 234,
    growthRate: 15.7,
    status: "active",
    description: "微信公众号营销获客",
  },
  {
    id: "weixinqun",
    name: "微信群获客",
    icon: "💬",
    todayCount: 145,
    growthRate: 11.2,
    status: "active",
    description: "微信群营销和客户获取",
  },
  {
    id: "payment",
    name: "付款码获客",
    icon: "💳",
    todayCount: 78,
    growthRate: 9.5,
    status: "active",
    description: "支付场景下的客户获取",
  },
  {
    id: "api",
    name: "API获客",
    icon: "🔗",
    todayCount: 198,
    growthRate: 14.3,
    status: "active",
    description: "通过API接口进行客户获取",
  },
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
        // 模拟短暂加载时间
        await new Promise((resolve) => setTimeout(resolve, 300))
        setScenarios(staticScenarios)
      } catch (err) {
        console.error("场景数据加载异常:", err)
        setScenarios(staticScenarios)
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

  // 处理新建计划
  const handleNewPlan = () => {
    router.push("/plans/new")
  }

  // 处理返回
  const handleBack = () => {
    router.back()
  }

  // 计算总获客数
  const totalAcquisitions = scenarios.reduce((sum, s) => sum + s.todayCount, 0)

  // 计算活跃场景数
  const activeScenarios = scenarios.filter((s) => s.status === "active").length

  // 计算平均增长率
  const averageGrowthRate =
    scenarios.length > 0 ? (scenarios.reduce((sum, s) => sum + s.growthRate, 0) / scenarios.length).toFixed(1) : "0.0"

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-sm text-gray-600">正在加载场景数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3 flex-1">
            <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">场景获客</h1>
              <p className="text-sm text-gray-500 mt-0.5">选择获客场景，开始您的营销之旅</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleNewPlan}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 h-10 font-medium"
          >
            + 新建计划
          </Button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="px-4 pb-24">
        {/* 数据概览 */}
        <div className="bg-white rounded-2xl p-6 mt-4 shadow-sm">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalAcquisitions}</div>
              <div className="text-sm text-gray-600">今日总获客</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{activeScenarios}</div>
              <div className="text-sm text-gray-600">活跃场景</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{averageGrowthRate}%</div>
              <div className="text-sm text-gray-600">平均增长</div>
            </div>
          </div>
        </div>

        {/* 常规获客场景 */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">常规获客场景</h2>
          <div className="grid grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 relative"
                onClick={() => handleScenarioClick(scenario.id)}
              >
                {/* 状态指示器 */}
                <div className="absolute top-4 left-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${scenario.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                  />
                </div>

                <div className="flex flex-col items-center text-center pt-3">
                  {/* 场景图标 */}
                  <div className="text-5xl mb-3">{scenario.icon}</div>

                  {/* 场景名称 */}
                  <h3 className="text-base font-bold text-gray-900 mb-2">{scenario.name}</h3>

                  {/* 场景描述 */}
                  <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.5rem] mb-3">{scenario.description}</p>

                  {/* 数据展示 */}
                  <div className="w-full space-y-2">
                    <div className="text-sm text-gray-600">
                      今日: <span className="text-base font-bold text-blue-600">{scenario.todayCount}</span>
                    </div>
                    <div className="flex items-center justify-center text-sm font-semibold text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />+{scenario.growthRate}%
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
