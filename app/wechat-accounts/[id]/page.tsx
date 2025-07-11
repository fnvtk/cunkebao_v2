"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, RefreshCw, ArrowRight, MessageCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 微信账号详情数据类型
interface WeChatAccountDetail {
  id: string
  nickname: string
  wechatId: string
  avatar?: string
  status: "normal" | "limited" | "banned"
  isOnline: boolean
  friendCount: number
  todayNewFriends: number
  groupCount: number
  todayMessages: number
  dailyAddLimit: number
  dailyAddUsed: number
  lastActiveTime: string
  deviceInfo?: {
    name: string
    type: string
    version: string
  }
}

export default function WeChatAccountDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [account, setAccount] = useState<WeChatAccountDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // 加载账号详情
  useEffect(() => {
    loadAccountDetail()
  }, [params.id])

  const loadAccountDetail = async () => {
    try {
      setLoading(true)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 模拟数据
      const mockAccount: WeChatAccountDetail = {
        id: params.id as string,
        nickname: "卡若-zok7e",
        wechatId: "wxid_ilf29mrq",
        avatar: "/placeholder.svg?height=80&width=80",
        status: "normal",
        isOnline: true,
        friendCount: 4557,
        todayNewFriends: 7,
        groupCount: 23,
        todayMessages: 156,
        dailyAddLimit: 30,
        dailyAddUsed: 15,
        lastActiveTime: new Date().toISOString(),
        deviceInfo: {
          name: "iPhone 15 Pro",
          type: "iOS",
          version: "17.2.1",
        },
      }

      setAccount(mockAccount)
    } catch (error) {
      console.error("加载账号详情失败:", error)
      toast({
        title: "加载失败",
        description: "无法加载微信账号详情，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadAccountDetail()
      toast({
        title: "刷新成功",
        description: "数据已更新",
      })
    } catch (error) {
      toast({
        title: "刷新失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  // 处理好友转移
  const handleFriendTransfer = () => {
    router.push(`/wechat-accounts/${params.id}/friend-transfer`)
  }

  // 处理返回
  const handleBack = () => {
    router.back()
  }

  // 获取状态颜色和文本
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "normal":
        return { color: "bg-green-100 text-green-800", text: "正常" }
      case "limited":
        return { color: "bg-yellow-100 text-yellow-800", text: "受限" }
      case "banned":
        return { color: "bg-red-100 text-red-800", text: "封号" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "未知" }
    }
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

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">账号不存在</p>
          <Button onClick={handleBack} variant="outline">
            返回
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(account.status)
  const addProgress = (account.dailyAddUsed / account.dailyAddLimit) * 100

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
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-4 space-y-4">
        {/* 账号信息卡片 */}
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={account.avatar || "/placeholder.svg"} alt={account.nickname} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-lg">
                    {account.nickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* 在线状态指示器 */}
                {account.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-semibold">{account.nickname}</h2>
                  <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                </div>
                <p className="text-gray-600 text-sm flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  微信号: {account.wechatId}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-transparent"
              onClick={handleFriendTransfer}
            >
              <span>好友转移</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{account.friendCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">好友数量</div>
            </div>
          </Card>
          <Card className="p-4 bg-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">+{account.todayNewFriends}</div>
              <div className="text-sm text-gray-600">今日新增</div>
            </div>
          </Card>
        </div>

        {/* 今日可添加进度 */}
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">今日可添加:</span>
            <span className="text-sm font-semibold">
              {account.dailyAddUsed}/{account.dailyAddLimit}
            </span>
          </div>
          <Progress value={addProgress} className="h-2" />
        </Card>

        {/* 群聊和消息统计 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-white">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{account.groupCount}</div>
              <div className="text-sm text-gray-600">群聊数量</div>
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{account.todayMessages}</div>
              <div className="text-sm text-gray-600">今日消息</div>
            </div>
          </Card>
        </div>

        {/* 设备信息 */}
        {account.deviceInfo && (
          <Card className="p-4 bg-white">
            <h3 className="font-medium text-gray-900 mb-3">设备信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">设备名称:</span>
                <span className="font-medium">{account.deviceInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">系统类型:</span>
                <span className="font-medium">{account.deviceInfo.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">系统版本:</span>
                <span className="font-medium">{account.deviceInfo.version}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* 底部导航占位 */}
      <div className="h-20"></div>
    </div>
  )
}
