"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Settings, Smartphone, MessageCircle, Database, FolderOpen, ChevronRight, LogOut } from "lucide-react"
import BottomNav from "@/app/components/BottomNav"
import { toast } from "@/components/ui/use-toast"
import { getDeviceStats } from "@/lib/api/devices"
import { getWechatStats } from "@/lib/api/wechat"
import { getTrafficStats } from "@/lib/api/traffic"
import { getContentStats } from "@/lib/api/content"

export default function ProfilePage() {
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [stats, setStats] = useState({
    devices: 12,
    wechat: 25,
    traffic: 8,
    content: 156,
  })

  // 用户信息
  const userInfo = {
    name: "卡若",
    email: "zhangsan@example.com",
    role: "管理员",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-20 14:30",
  }

  // 功能模块数据
  const functionModules = [
    {
      id: "devices",
      title: "设备管理",
      description: "管理您的设备和微信账号",
      icon: <Smartphone className="h-5 w-5 text-blue-500" />,
      count: stats.devices,
      path: "/profile/devices",
      bgColor: "bg-blue-50",
    },
    {
      id: "wechat",
      title: "微信号管理",
      description: "管理微信账号和好友",
      icon: <MessageCircle className="h-5 w-5 text-green-500" />,
      count: stats.wechat,
      path: "/wechat-accounts",
      bgColor: "bg-green-50",
    },
    {
      id: "traffic",
      title: "流量池",
      description: "管理用户流量池和分组",
      icon: <Database className="h-5 w-5 text-purple-500" />,
      count: stats.traffic,
      path: "/traffic-pool",
      bgColor: "bg-purple-50",
    },
    {
      id: "content",
      title: "内容库",
      description: "管理营销内容和素材",
      icon: <FolderOpen className="h-5 w-5 text-orange-500" />,
      count: stats.content,
      path: "/content",
      bgColor: "bg-orange-50",
    },
  ]

  // 加载统计数据
  const loadStats = async () => {
    try {
      const [deviceStats, wechatStats, trafficStats, contentStats] = await Promise.allSettled([
        getDeviceStats(),
        getWechatStats(),
        getTrafficStats(),
        getContentStats(),
      ])

      setStats({
        devices: deviceStats.status === "fulfilled" ? deviceStats.value.total : 12,
        wechat: wechatStats.status === "fulfilled" ? wechatStats.value.total : 25,
        traffic: trafficStats.status === "fulfilled" ? trafficStats.value.total : 8,
        content: contentStats.status === "fulfilled" ? contentStats.value.total : 156,
      })
    } catch (error) {
      console.error("加载统计数据失败:", error)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleLogout = () => {
    toast({
      title: "退出成功",
      description: "您已安全退出系统",
    })
    router.push("/login")
  }

  const handleFunctionClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen pb-16">
      <div className="p-4 space-y-4">
        {/* 用户信息卡片 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-medium">
                  {userInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-lg font-medium">{userInfo.name}</h2>
                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-medium shadow-sm">
                    {userInfo.role}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{userInfo.email}</p>
                <div className="text-xs text-gray-500">
                  <div>最近登录: {userInfo.lastLogin}</div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 我的功能 */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {functionModules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors w-full"
                  onClick={() => handleFunctionClick(module.path)}
                >
                  <div className={`p-2 rounded-lg ${module.bgColor} mr-3`}>{module.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{module.title}</div>
                    <div className="text-xs text-gray-500">{module.description}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded-full border border-gray-200 font-medium shadow-sm">
                      {module.count}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 退出登录 */}
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          退出登录
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
