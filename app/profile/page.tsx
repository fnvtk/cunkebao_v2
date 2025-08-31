"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Smartphone, Users, Layers, FolderOpen, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 模拟用户数据 - 保持与整个项目一致
const mockUserData = {
  name: "卡若",
  role: "管理员",
  balance: 1288.5,
  lastLogin: "2025/7/29 20:33:11",
  avatar: "/placeholder.svg?height=60&width=60",
}

// 模拟统计数据 - 与其他页面保持一致
const mockStats = {
  devices: 8, // 设备总数
  wechatAccounts: 17, // 微信号总数
  trafficPool: 999, // 流量池用户数
  contentLibrary: 999, // 内容库数量
}

export default function ProfilePage() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const menuItems = [
    {
      id: "devices",
      title: "设备管理",
      description: "管理您的设备和微信账号",
      icon: <Smartphone className="h-6 w-6 text-blue-500" />,
      count: mockStats.devices,
      path: "/devices",
    },
    {
      id: "wechat",
      title: "微信号管理",
      description: "管理微信账号和好友",
      icon: <Users className="h-6 w-6 text-green-500" />,
      count: mockStats.wechatAccounts,
      path: "/wechat-accounts",
    },
    {
      id: "traffic",
      title: "流量池",
      description: "管理用户流量池和分组",
      icon: <Layers className="h-6 w-6 text-purple-500" />,
      count: mockStats.trafficPool,
      path: "/traffic-pool",
    },
    {
      id: "content",
      title: "内容库",
      description: "管理营销内容和素材",
      icon: <FolderOpen className="h-6 w-6 text-orange-500" />,
      count: mockStats.contentLibrary,
      path: "/content",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 text-blue-500" />
            </Button>
            <h1 className="ml-2 text-lg font-medium text-blue-500">我的</h1>
          </div>
        </div>
      </header>

      {/* 用户信息卡片 */}
      <div className="p-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mockUserData.avatar || "/placeholder.svg"} alt={mockUserData.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                    {mockUserData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-medium text-gray-900">{mockUserData.name}</h2>
                    <Badge className="bg-orange-100 text-orange-600 text-xs">{mockUserData.role}</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      余额: <span className="text-green-600 font-medium">¥{mockUserData.balance}</span>
                    </span>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 h-7"
                      onClick={() => handleNavigation("/profile/billing")}
                    >
                      充值
                    </Button>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleNavigation("/profile/settings")}>
                <Settings className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
            <div className="mt-3 pt-3 border-t text-xs text-gray-500">最近登录: {mockUserData.lastLogin}</div>
          </CardContent>
        </Card>
      </div>

      {/* 功能菜单 */}
      <div className="px-4 space-y-3">
        {menuItems.map((item) => (
          <Card
            key={item.id}
            className="bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleNavigation(item.path)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">{item.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-600">{item.count}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
