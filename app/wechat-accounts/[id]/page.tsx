"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RefreshCw, ArrowRight, Users, Plus, MessageCircle, Settings } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

// 微信号详情数据类型
interface WechatAccountDetail {
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
  groupCount: number
  todayMessages: number
  weeklyStats: {
    date: string
    added: number
    messages: number
  }[]
}

// 模拟数据
const mockAccountDetail: WechatAccountDetail = {
  id: "1",
  nickname: "卡若-zok7e",
  wxid: "wxid_ilf29mrq",
  avatar: "/placeholder.svg?height=80&width=80",
  status: "online",
  friendCount: 4557,
  todayAdded: 7,
  deviceName: "设备1",
  lastActive: "2025/5/17 07:13:14",
  canAddToday: 15,
  maxAddPerDay: 30,
  groupCount: 23,
  todayMessages: 156,
  weeklyStats: [
    { date: "5/11", added: 12, messages: 89 },
    { date: "5/12", added: 8, messages: 134 },
    { date: "5/13", added: 15, messages: 167 },
    { date: "5/14", added: 6, messages: 98 },
    { date: "5/15", added: 11, messages: 145 },
    { date: "5/16", added: 9, messages: 123 },
    { date: "5/17", added: 7, messages: 156 },
  ],
}

export default function WechatAccountDetailPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params.id as string

  const [account, setAccount] = useState<WechatAccountDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载微信号详情
  const loadAccountDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 使用模拟数据
      setAccount(mockAccountDetail)
    } catch (err) {
      console.error("加载微信号详情失败:", err)
      setError("加载失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccountDetail()
  }, [accountId])

  // 处理返回
  const handleBack = () => {
    router.back()
  }

  // 处理刷新
  const handleRefresh = () => {
    loadAccountDetail()
  }

  // 处理好友转移
  const handleFriendTransfer = () => {
    router.push(`/wechat-accounts/${accountId}/transfer`)
  }

  // 处理设置
  const handleSettings = () => {
    router.push(`/wechat-accounts/${accountId}/settings`)
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-700"
      case "offline":
        return "bg-gray-100 text-gray-700"
      case "error":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
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
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "微信号不存在"}</p>
          <Button onClick={handleBack} variant="outline">
            返回
          </Button>
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
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4 space-y-4">
        {/* 基本信息卡片 */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            {/* 头像 */}
            <div className="relative">
              <img
                src={account.avatar || "/placeholder.svg"}
                alt={account.nickname}
                className="w-16 h-16 rounded-full bg-gray-200"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  account.status === "online"
                    ? "bg-green-500"
                    : account.status === "error"
                      ? "bg-red-500"
                      : "bg-gray-500"
                }`}
              />
            </div>

            {/* 基本信息 */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-semibold">{account.nickname}</h2>
                <Badge className={getStatusColor(account.status)}>{getStatusText(account.status)}</Badge>
                <Button variant="outline" size="sm" onClick={handleFriendTransfer} className="ml-auto bg-transparent">
                  好友转移
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="text-gray-600 mb-3">微信号: {account.wxid}</div>
            </div>
          </div>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">好友数量:</span>
              <span className="text-2xl font-bold">{account.friendCount}</span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">今日新增:</span>
              <span className="text-2xl font-bold text-green-600">+{account.todayAdded}</span>
            </div>
          </Card>
        </div>

        {/* 今日可添加进度 */}
        <Card className="p-4">
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">今日可添加:</span>
              <span className="font-medium">
                {account.canAddToday}/{account.maxAddPerDay}
              </span>
            </div>
            <Progress
              value={getProgressPercentage(account.maxAddPerDay - account.canAddToday, account.maxAddPerDay)}
              className="h-3"
            />
          </div>
        </Card>

        {/* 其他统计 */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-semibold">{account.groupCount}</div>
            <div className="text-sm text-gray-500">群聊数量</div>
          </Card>
          <Card className="p-4 text-center">
            <Plus className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-semibold">{account.todayMessages}</div>
            <div className="text-sm text-gray-500">今日消息</div>
          </Card>
        </div>

        {/* 设备信息 */}
        <Card className="p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>所属设备: {account.deviceName}</span>
            <span>最后活跃: {account.lastActive}</span>
          </div>
        </Card>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 bg-transparent">
            <Users className="h-4 w-4 mr-2" />
            好友管理
          </Button>
          <Button variant="outline" className="h-12 bg-transparent" onClick={handleSettings}>
            <Settings className="h-4 w-4 mr-2" />
            账号设置
          </Button>
        </div>
      </div>

      {/* 底部导航占位 */}
      <div className="h-20"></div>
    </div>
  )
}
