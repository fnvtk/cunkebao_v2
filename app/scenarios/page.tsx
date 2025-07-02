"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, Phone, Users, Camera, ImageIcon } from "lucide-react"

// 场景获客数据类型定义
interface ScenarioData {
  id: string
  name: string
  icon: React.ReactNode
  todayCount: number
  growthRate: number
  type: "regular" | "ai"
}

export default function ScenariosPage() {
  const router = useRouter()
  const [scenarios, setScenarios] = useState<ScenarioData[]>([])
  const [loading, setLoading] = useState(true)

  // 初始化场景数据
  useEffect(() => {
    const initScenarios = () => {
      const scenarioData: ScenarioData[] = [
        {
          id: "phone",
          name: "手机号获客",
          icon: <Phone className="h-8 w-8 text-blue-500" />,
          todayCount: 156,
          growthRate: 12.5,
          type: "regular",
        },
        {
          id: "weixinqun",
          name: "微信群获客",
          icon: <Users className="h-8 w-8 text-green-500" />,
          todayCount: 89,
          growthRate: 8.3,
          type: "regular",
        },
        {
          id: "douyin",
          name: "抖音获客",
          icon: <Camera className="h-8 w-8 text-red-500" />,
          todayCount: 234,
          growthRate: 15.7,
          type: "ai",
        },
        {
          id: "haibao",
          name: "海报获客",
          icon: <ImageIcon className="h-8 w-8 text-purple-500" />,
          todayCount: 67,
          growthRate: 5.2,
          type: "ai",
        },
      ]
      setScenarios(scenarioData)
      setLoading(false)
    }

    initScenarios()
  }, [])

  // 处理新建计划
  const handleNewPlan = () => {
    router.push("/plans/new")
  }

  // 处理场景新建
  const handleScenarioNew = (scenarioId: string) => {
    router.push(`/plans/new?scenario=${scenarioId}`)
  }

  // 处理返回
  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  // 分组场景数据
  const regularScenarios = scenarios.filter((s) => s.type === "regular")
  const aiScenarios = scenarios.filter((s) => s.type === "ai")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">场景获客</h1>
          </div>
          <Button size="sm" onClick={handleNewPlan} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="h-4 w-4 mr-1" />
            新建计划
          </Button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4 space-y-6">
        {/* 常规获客场景 */}
        <div>
          <h2 className="text-base font-medium text-gray-900 mb-3">常规获客</h2>
          <div className="grid grid-cols-2 gap-3">
            {regularScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="bg-white hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleScenarioNew(scenario.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="flex-shrink-0">{scenario.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{scenario.name}</h3>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          今日获客: <span className="font-medium text-gray-900">{scenario.todayCount}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          增长率:{" "}
                          <span
                            className={`font-medium ${scenario.growthRate > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {scenario.growthRate > 0 ? "+" : ""}
                            {scenario.growthRate}%
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleScenarioNew(scenario.id)
                      }}
                    >
                      新建
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI智能获客 */}
        <div>
          <h2 className="text-base font-medium text-gray-900 mb-3">AI智能获客</h2>
          <div className="grid grid-cols-2 gap-3">
            {aiScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="bg-white hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleScenarioNew(scenario.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="flex-shrink-0">{scenario.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{scenario.name}</h3>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          今日获客: <span className="font-medium text-gray-900">{scenario.todayCount}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          增长率:{" "}
                          <span
                            className={`font-medium ${scenario.growthRate > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {scenario.growthRate > 0 ? "+" : ""}
                            {scenario.growthRate}%
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleScenarioNew(scenario.id)
                      }}
                    >
                      新建
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
