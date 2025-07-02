"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Plus, RefreshCw, Smartphone, Users, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// 微信号数据类型定义
interface WechatAccount {
  id: string
  nickname: string
  wxid: string
  avatar: string
  status: "online" | "offline" | "error"
  friendCount: number
  todayAdded: number
  deviceName: string
  lastActive: string
  canAddToday: number
  maxAddPerDay: number
}

// 模拟数据
const mockWechatAccounts: WechatAccount[] = [
  {
    id: "1",
    nickname: "卡若-zok7e",
    wxid: "wxid_ilf29mrq",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    friendCount: 4557,
    todayAdded: 7,
    deviceName: "设备1",
    lastActive: "2025/5/17 07:13:14",
    canAddToday: 15,
    maxAddPerDay: 30,
  },
  {
    id: "2",
    nickname: "小美-abc123",
    wxid: "wxid_abc123def",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    friendCount: 3245,
    todayAdded: 12,
    deviceName: "设备2",
    lastActive: "2025/5/17 08:25:33",
    canAddToday: 8,
    maxAddPerDay: 25,
  },
  {
    id: "3",
    nickname: "阿强-xyz789",
    wxid: "wxid_xyz789ghi",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    friendCount: 2156,
    todayAdded: 3,
    deviceName: "设备3",
    lastActive: "2025/5/16 22:45:12",
    canAddToday: 20,
    maxAddPerDay: 20,
  },
]

export default function WechatAccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<WechatAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  // 加载微信号数据
  const loadWechatAccounts = async () => {
    try {
      setLoading(true)
      setError(null)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 使用模拟数据
      setAccounts(mockWechatAccounts)
    } catch (err) {
      console.error("加载微信号失败:", err)
      setError("加载微信号失败，请稍后重试")
      // 使用模拟数据作为降级方案
      setAccounts(mockWechatAccounts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWechatAccounts()
  }, [])

  // 处理搜索
  const filteredAccounts = accounts.filter(
    (account) =>
      account.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.wxid.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 处理返回
  const handleBack = () => {
    router.back()
  }

  // 处理刷新
  const handleRefresh = () => {
    loadWechatAccounts()
  }

  // 处理添加微信号
  const handleAddAccount = () => {
    router.push("/wechat-accounts/new")
  }

  // 处理点击微信号
  const handleAccountClick = (accountId: string) => {
    router.push(`/wechat-accounts/${accountId}`)
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "正常"
      case "offline":
        return "离线"
      case "error":
        return "异常"
      default:
        return "未知"
    }
  }

  // 计算进度百分比
  const getProgressPercentage = (used: number, total: number) => {
    return total > 0 ? Math.min((used / total) * 100, 100) : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">加载微信号中...</p>
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
            <h1 className="text-lg font-medium">微信号</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button size="sm" onClick={handleAddAccount} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4 mr-1" />
              添加微信号
            </Button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索微信号或昵称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Smartphone className="h-4 w-4 text-blue-500 mr-1" />
            </div>
            <div className="text-lg font-semibold">{accounts.length}</div>
            <div className="text-xs text-gray-500">总微信号</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-green-500 mr-1" />
            </div>
            <div className="text-lg font-semibold">{accounts.reduce((sum, acc) => sum + acc.friendCount, 0)}</div>
            <div className="text-xs text-gray-500">总好友数</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageCircle className="h-4 w-4 text-orange-500 mr-1" />
            </div>
            <div className="text-lg font-semibold">{accounts.reduce((sum, acc) => sum + acc.todayAdded, 0)}</div>
            <div className="text-xs text-gray-500">今日新增</div>
          </Card>
        </div>

        {/* 错误提示 */}
        {error && (
          <Card className="p-4 mb-4 border-red-200 bg-red-50">
            <div className="text-red-600 text-sm">{error}</div>
          </Card>
        )}

        {/* 微信号列表 */}
        <div className="space-y-3">
          {filteredAccounts.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-2">{searchTerm ? "未找到匹配的微信号" : "暂无微信号"}</div>
              {!searchTerm && (
                <Button onClick={handleAddAccount} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  添加第一个微信号
                </Button>
              )}
            </Card>
          ) : (
            filteredAccounts.map((account) => (
              <Card
                key={account.id}
                className="p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleAccountClick(account.id)}
              >
                <div className="flex items-center space-x-3">
                  {/* 头像 */}
                  <div className="relative">
                    <img
                      src={account.avatar || "/placeholder.svg"}
                      alt={account.nickname}
                      className="w-12 h-12 rounded-full bg-gray-200"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                        account.status,
                      )}`}
                    />
                  </div>

                  {/* 基本信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium truncate">{account.nickname}</h3>
                      <Badge
                        variant={account.status === "online" ? "default" : "secondary"}
                        className={`text-xs ${
                          account.status === "online"
                            ? "bg-green-100 text-green-700"
                            : account.status === "error"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {getStatusText(account.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">微信号: {account.wxid}</div>

                    {/* 统计信息 */}
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500">好友数量</div>
                        <div className="font-semibold">{account.friendCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">今日新增</div>
                        <div className="font-semibold text-green-600">+{account.todayAdded}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">今日可添加</div>
                        <div className="font-semibold">{account.canAddToday}</div>
                      </div>
                    </div>

                    {/* 进度条 */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>今日添加进度</span>
                        <span>
                          {account.maxAddPerDay - account.canAddToday}/{account.maxAddPerDay}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${getProgressPercentage(
                              account.maxAddPerDay - account.canAddToday,
                              account.maxAddPerDay,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* 设备和时间信息 */}
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>所属设备: {account.deviceName}</span>
                      <span>最后活跃: {account.lastActive}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 底部导航占位 */}
      <div className="h-20"></div>
    </div>
  )
}
