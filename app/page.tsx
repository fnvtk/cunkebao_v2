"use client"

import { Card } from "@/components/ui/card"
import { Smartphone, Users, Activity, MessageSquare, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// 导入Chart.js
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

// API接口定义
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ckbapi.quwanzhi.com"

// 统一的API请求客户端
async function apiRequest<T>(url: string): Promise<T> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("ckb_token") : null
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    console.log("发送API请求:", url)

    const response = await fetch(url, {
      method: "GET",
      headers,
      mode: "cors",
    })

    console.log("API响应状态:", response.status, response.statusText)

    // 检查响应头的Content-Type
    const contentType = response.headers.get("content-type")
    console.log("响应Content-Type:", contentType)

    if (!response.ok) {
      // 如果是401未授权，清除本地存储
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("ckb_token")
          localStorage.removeItem("ckb_user")
        }
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // 检查是否是JSON响应
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.log("非JSON响应内容:", text.substring(0, 200))
      throw new Error("服务器返回了非JSON格式的数据，可能是HTML错误页面")
    }

    const data = await response.json()
    console.log("API响应数据:", data)

    // 检查业务状态码
    if (data.code && data.code !== 200 && data.code !== 0) {
      throw new Error(data.message || "请求失败")
    }

    return data.data || data
  } catch (error) {
    console.error("API请求失败:", error)
    throw error
  }
}

export default function Home() {
  const router = useRouter()
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // 统一设备数据
  const [stats, setStats] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    totalWechatAccounts: 0,
    onlineWechatAccounts: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState("")

  useEffect(() => {
    // 获取统计数据
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setApiError("")

        // 检查是否有token
        const token = localStorage.getItem("ckb_token")
        if (!token) {
          console.log("未找到登录token，使用默认数据")
          setStats({
            totalDevices: 42,
            onlineDevices: 35,
            totalWechatAccounts: 42,
            onlineWechatAccounts: 35,
          })
          setIsLoading(false)
          return
        }

        // 尝试请求API数据
        try {
          // 并行请求多个接口
          const [deviceStatsResult, wechatStatsResult] = await Promise.allSettled([
            apiRequest(`${API_BASE_URL}/v1/dashboard/device-stats`),
            apiRequest(`${API_BASE_URL}/v1/dashboard/wechat-stats`),
          ])

          const newStats = { ...stats }

          // 处理设备统计数据
          if (deviceStatsResult.status === "fulfilled") {
            const deviceData = deviceStatsResult.value as any
            newStats.totalDevices = deviceData.total || 0
            newStats.onlineDevices = deviceData.online || 0
          } else {
            console.warn("设备统计API失败:", deviceStatsResult.reason)
          }

          // 处理微信号统计数据
          if (wechatStatsResult.status === "fulfilled") {
            const wechatData = wechatStatsResult.value as any
            newStats.totalWechatAccounts = wechatData.total || 0
            newStats.onlineWechatAccounts = wechatData.active || 0
          } else {
            console.warn("微信号统计API失败:", wechatStatsResult.reason)
          }

          setStats(newStats)
        } catch (apiError) {
          console.warn("API请求失败，使用默认数据:", apiError)
          setApiError(apiError instanceof Error ? apiError.message : "API连接失败")

          // 使用默认数据
          setStats({
            totalDevices: 42,
            onlineDevices: 35,
            totalWechatAccounts: 42,
            onlineWechatAccounts: 35,
          })
        }
      } catch (error) {
        console.error("获取统计数据失败:", error)
        setApiError(error instanceof Error ? error.message : "数据加载失败")

        // 使用默认数据
        setStats({
          totalDevices: 42,
          onlineDevices: 35,
          totalWechatAccounts: 42,
          onlineWechatAccounts: 35,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // 定时刷新数据（每30秒）
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // 使用Chart.js创建图表
  useEffect(() => {
    if (chartRef.current && !isLoading) {
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
  }, [isLoading])

  const handleDevicesClick = () => {
    router.push("/profile/devices")
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

  // 今日数据统计
  const todayStats = [
    {
      title: "朋友圈同步",
      value: "12",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "text-purple-600",
      path: "/workspace/moments-sync",
    },
    {
      title: "群发任务",
      value: "8",
      icon: <Users className="h-4 w-4" />,
      color: "text-orange-600",
      path: "/workspace/group-push",
    },
    {
      title: "获客转化",
      value: "85%",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-green-600",
      path: "/scenarios",
    },
    {
      title: "系统活跃度",
      value: "98%",
      icon: <Activity className="h-4 w-4" />,
      color: "text-blue-600",
      path: "/workspace",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex-1 pb-16 bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-semibold text-blue-600">存客宝</h1>
          </div>
        </header>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-3 bg-white animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 pb-16 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-semibold text-blue-600">存客宝</h1>
          {apiError && (
            <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">API连接异常，显示默认数据</div>
          )}
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
              <Progress
                value={
                  stats.totalWechatAccounts > 0 ? (stats.onlineWechatAccounts / stats.totalWechatAccounts) * 100 : 0
                }
                className="h-1"
              />
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

        {/* 今日数据统计 */}
        <Card className="p-4 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold">今日数据</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {todayStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => stat.path && router.push(stat.path)}
              >
                <div className={`p-2 rounded-full bg-white ${stat.color}`}>{stat.icon}</div>
                <div>
                  <div className="text-lg font-semibold">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.title}</div>
                </div>
              </div>
            ))}
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
