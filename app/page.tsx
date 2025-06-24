"use client"

import { Card } from "@/components/ui/card"
import { Smartphone, Users, Activity, MessageCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// 导入Chart.js
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

export default function Home() {
  const router = useRouter()
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // 统一设备数据
  const [stats, setStats] = useState({
    totalDevices: 42,
    onlineDevices: 35,
    totalWechatAccounts: 42,
    onlineWechatAccounts: 35,
  })

  useEffect(() => {
    // 模拟API调用
    const fetchStats = async () => {
      // 这里应该是实际的API调用
      const mockStats = {
        totalDevices: 42,
        onlineDevices: 35,
        totalWechatAccounts: 42,
        onlineWechatAccounts: 35,
      }
      setStats(mockStats)
    }
    fetchStats()
  }, [])

  // 使用Chart.js创建图表
  useEffect(() => {
    if (chartRef.current) {
      // 如果已经有图表实例，先销毁它
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      // 创建新的图表实例
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          datasets: [
            {
              label: "获客数量",
              data: [120, 150, 180, 200, 230, 210, 190],
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: "rgba(59, 130, 246, 1)",
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              titleColor: "#333",
              bodyColor: "#666",
              borderColor: "#ddd",
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                label: (context) => `获客数量: ${context.parsed.y}`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
          },
        },
      })
    }

    // 组件卸载时清理图表实例
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  const handleDevicesClick = () => {
    router.push("/devices")
  }

  const handleWechatClick = () => {
    router.push("/wechat-accounts")
  }

  const scenarioFeatures = [
    {
      id: "douyin",
      name: "抖音获客",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QR8ManuDplYTySUJsY4mymiZkDYnQ9.png",
      color: "bg-blue-100 text-blue-600",
      value: 156,
      growth: 12,
    },
    {
      id: "xiaohongshu",
      name: "小红书获客",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yvnMxpoBUzcvEkr8DfvHgPHEo1kmQ3.png",
      color: "bg-red-100 text-red-600",
      value: 89,
      growth: 8,
    },
    {
      id: "gongzhonghao",
      name: "公众号获客",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Gsg0CMf5tsZb41mioszdjqU1WmsRxW.png",
      color: "bg-green-100 text-green-600",
      value: 234,
      growth: 15,
    },
    {
      id: "haibao",
      name: "海报获客",
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-x92XJgXy4MI7moNYlA1EAes2FqDxMH.png",
      color: "bg-orange-100 text-orange-600",
      value: 167,
      growth: 10,
    },
  ]

  return (
    <div className="flex-1 pb-16 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-semibold text-blue-600">存客宝</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-white hover:shadow-md transition-all cursor-pointer" onClick={handleDevicesClick}>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">设备数量</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">{stats.totalDevices}</span>
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-white hover:shadow-md transition-all cursor-pointer" onClick={handleWechatClick}>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">微信号数量</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">{stats.totalWechatAccounts}</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-white">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">在线微信号</span>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-blue-600">{stats.onlineWechatAccounts}</span>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <Progress value={(stats.onlineWechatAccounts / stats.totalWechatAccounts) * 100} className="h-1" />
            </div>
          </Card>
        </div>

        {/* 场景获客统计 */}
        <Card className="p-4 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold">场景获客统计</h2>
          </div>
          <div className="flex justify-between">
            {scenarioFeatures
              .sort((a, b) => b.value - a.value)
              .slice(0, 4) // 只显示前4个
              .map((scenario) => (
                <Link href={`/scenarios/${scenario.id}`} key={scenario.id} className="block flex-1">
                  <div className="flex flex-col items-center text-center space-y-1">
                    <div className={`w-10 h-10 rounded-full ${scenario.color} flex items-center justify-center`}>
                      <img src={scenario.icon || "/placeholder.svg"} alt={scenario.name} className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-medium">{scenario.value}</div>
                    <div className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      {scenario.name}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </Card>

        {/* 我的今日数据 */}
        <Card className="p-4 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold">工作台任务统计</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => router.push("/workspace/moments-sync")}
            >
              <div className="p-2 rounded-full bg-white text-purple-600">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold">12</div>
                <div className="text-xs text-gray-500">朋友圈同步</div>
              </div>
            </div>
            <div
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => router.push("/workspace/group-push")}
            >
              <div className="p-2 rounded-full bg-white text-orange-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold">8</div>
                <div className="text-xs text-gray-500">群发任务</div>
              </div>
            </div>
            <div
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => router.push("/scenarios")}
            >
              <div className="p-2 rounded-full bg-white text-green-600">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold">85%</div>
                <div className="text-xs text-gray-500">获客转化</div>
              </div>
            </div>
            <div
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => router.push("/workspace")}
            >
              <div className="p-2 rounded-full bg-white text-blue-600">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold">98%</div>
                <div className="text-xs text-gray-500">系统活跃度</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 每日获客趋势 */}
        <Card className="p-4 bg-white">
          <h2 className="text-base font-semibold mb-3">每日获客趋势</h2>
          <div className="w-full h-48 relative">
            <canvas ref={chartRef} />
          </div>
        </Card>
      </div>
    </div>
  )
}
