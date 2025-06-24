"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut, ChevronRight, Smartphone, MessageSquare, Database, Layers, Crown, Settings } from "lucide-react"
import BottomNav from "@/app/components/BottomNav"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user] = useState({
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "/placeholder.svg?height=80&width=80",
    role: "管理员",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-20 14:30",
  })

  const [stats] = useState({
    devices: 12,
    wechatAccounts: 25,
    trafficPools: 8,
    contentLibrary: 156,
    todayTasks: 23,
    completedTasks: 18,
  })

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleLogout = () => {
    toast({
      title: "退出登录",
      description: "您已成功退出登录",
    })
    router.push("/login")
  }

  // 我的功能菜单
  const myFeatures = [
    {
      id: "devices",
      title: "设备管理",
      description: "管理您的设备和微信账号",
      icon: <Smartphone className="h-5 w-5" />,
      count: stats.devices,
      path: "/devices",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "wechat",
      title: "微信号管理",
      description: "管理微信账号和好友",
      icon: <MessageSquare className="h-5 w-5" />,
      count: stats.wechatAccounts,
      path: "/wechat-accounts",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "traffic-pools",
      title: "流量池管理",
      description: "管理用户流量池和分组",
      icon: <Layers className="h-5 w-5" />,
      count: stats.trafficPools,
      path: "/traffic-pool",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "content",
      title: "内容库",
      description: "管理营销内容和素材",
      icon: <Database className="h-5 w-5" />,
      count: stats.contentLibrary,
      path: "/content",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="flex-1 bg-gray-50 min-h-screen pb-16">
      <div className="p-4 space-y-6">
        {/* 用户信息卡片 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleNavigation("/profile/notifications")}>
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleNavigation("/profile/settings")}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>加入时间: {user.joinDate}</span>
                  <span>最近登录: {user.lastLogin}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 我的功能 */}
        <Card>
          <CardHeader className="pb-2"></CardHeader>
          <CardContent className="space-y-3">
            {myFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleNavigation(feature.path)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.bgColor} ${feature.color}`}>{feature.icon}</div>
                  <div>
                    <div className="font-medium">{feature.title}</div>
                    <div className="text-sm text-gray-500">{feature.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{feature.count}</Badge>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 退出登录 */}
        <Card>
          <CardContent className="p-4">
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
