"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Settings, Smartphone, MessageCircle, Database, FolderOpen, ChevronRight, LogOut } from "lucide-react"
import BottomNav from "@/app/components/BottomNav"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // 用户信息
  const userInfo = {
    name: "张三",
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
      count: 12,
      path: "/devices",
      bgColor: "bg-blue-50",
    },
    {
      id: "wechat",
      title: "微信号管理",
      description: "管理微信账号和好友",
      icon: <MessageCircle className="h-5 w-5 text-green-500" />,
      count: 25,
      path: "/wechat-accounts",
      bgColor: "bg-green-50",
    },
    {
      id: "traffic",
      title: "流量池管理",
      description: "管理用户流量池和分组",
      icon: <Database className="h-5 w-5 text-purple-500" />,
      count: 8,
      path: "/traffic-pool",
      bgColor: "bg-purple-50",
    },
    {
      id: "content",
      title: "内容库",
      description: "管理营销内容和素材",
      icon: <FolderOpen className="h-5 w-5 text-orange-500" />,
      count: 156,
      path: "/content",
      bgColor: "bg-orange-50",
    },
  ]

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
                  <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded border">
                    {userInfo.role}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{userInfo.email}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>加入时间: {userInfo.joinDate}</div>
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
            <h3 className="text-lg font-medium mb-4">我的功能</h3>
            <div className="space-y-3">
              {functionModules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleFunctionClick(module.path)}
                >
                  <div className={`p-2 rounded-lg ${module.bgColor} mr-3`}>{module.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{module.title}</div>
                    <div className="text-xs text-gray-500">{module.description}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded border">
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
