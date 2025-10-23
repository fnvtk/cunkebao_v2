"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  Smartphone,
  MessageCircle,
  Users,
  BookOpen,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Wallet,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // 模拟用户数据
  const userData = {
    name: "张三",
    phone: "138****8888",
    avatar: "/placeholder.svg?height=80&width=80",
    level: "VIP会员",
    stats: {
      devices: 12,
      wechatAccounts: 24,
      trafficPool: 1847,
      contentLibrary: 156,
      aiModels: 12,
    },
  }

  useEffect(() => {
    // 模拟加载
    setTimeout(() => setLoading(false), 500)
  }, [])

  // 主要功能列表
  const mainFeatures = [
    {
      id: "devices",
      icon: <Smartphone className="h-6 w-6 text-blue-600" />,
      title: "设备管理",
      description: "管理所有设备和状态",
      value: userData.stats.devices,
      color: "bg-blue-50",
      route: "/profile/devices",
    },
    {
      id: "wechat",
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      title: "微信号管理",
      description: "管理微信账号和好友",
      value: userData.stats.wechatAccounts,
      color: "bg-green-50",
      route: "/wechat-accounts",
    },
    {
      id: "traffic",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "流量池",
      description: "查看和管理客户分组",
      value: userData.stats.trafficPool,
      color: "bg-purple-50",
      route: "/profile/traffic-pool",
    },
    {
      id: "content",
      icon: <BookOpen className="h-6 w-6 text-orange-600" />,
      title: "内容库",
      description: "管理营销内容素材",
      value: userData.stats.contentLibrary,
      color: "bg-orange-50",
      route: "/content",
    },
  ]

  // 其他功能列表
  const otherFeatures = [
    {
      id: "billing",
      icon: <Wallet className="h-5 w-5 text-cyan-600" />,
      title: "算力管理",
      description: "查看算力使用和购买套餐",
      route: "/profile/billing",
    },
    {
      id: "settings",
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      title: "设置",
      description: "账号和系统设置",
      route: "/profile/settings",
    },
    {
      id: "notifications",
      icon: <Bell className="h-5 w-5 text-yellow-600" />,
      title: "通知中心",
      description: "查看系统通知和消息",
      route: "/profile/notifications",
    },
    {
      id: "help",
      icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
      title: "帮助与反馈",
      description: "使用帮助和问题反馈",
      route: "/profile/help",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">我的</h1>
          </div>
        </div>
      </div>

      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback className="text-2xl bg-white text-blue-600">{userData.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-white">
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs">{userData.level}</span>
            </div>
            <p className="text-white/90 text-sm">{userData.phone}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => router.push("/profile/edit")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 主要功能区 */}
      <div className="p-4 space-y-3">
        <div className="text-sm font-medium text-gray-900 px-1">核心功能</div>
        {mainFeatures.map((feature) => (
          <Card
            key={feature.id}
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => router.push(feature.route)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-blue-600">{feature.value}</span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 其他功能区 */}
      <div className="p-4 space-y-3">
        <div className="text-sm font-medium text-gray-900 px-1">其他功能</div>
        <Card>
          <CardContent className="p-0">
            {otherFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  index !== otherFeatures.length - 1 ? "border-b" : ""
                }`}
                onClick={() => router.push(feature.route)}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{feature.title}</div>
                  <div className="text-sm text-gray-500">{feature.description}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 退出登录 */}
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
          onClick={() => {
            // 这里添加退出登录逻辑
            router.push("/login")
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>
    </div>
  )
}
