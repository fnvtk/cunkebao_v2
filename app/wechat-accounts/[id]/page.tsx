"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  Smartphone,
  Users,
  Star,
  Clock,
  MessageSquare,
  Shield,
  Info,
  UserPlus,
  Search,
  Filter,
  Tag,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface RestrictionRecord {
  id: string
  date: string
  reason: string
  recoveryTime: string
  type: "friend_limit" | "marketing" | "spam" | "other"
}

interface FriendTag {
  id: string
  name: string
  color: string
}

interface WechatFriend {
  id: string
  avatar: string
  nickname: string
  wechatId: string
  remark: string
  addTime: string
  lastInteraction: string
  tags: FriendTag[]
  region: string
  source: string
  notes: string
}

interface WechatAccountDetail {
  id: string
  avatar: string
  nickname: string
  wechatId: string
  deviceId: string
  deviceName: string
  friendCount: number
  todayAdded: number
  status: "normal" | "abnormal"
  lastActive: string
  messageCount: number
  activeRate: number
  // 新增和修改的字段
  accountAge: {
    years: number
    months: number
  }
  totalChats: number
  chatFrequency: number // 每日平均聊天次数
  restrictionRecords: RestrictionRecord[]
  isVerified: boolean
  firstMomentDate: string
  accountWeight: number
  weightFactors: {
    restrictionFactor: number
    verificationFactor: number
    ageFactor: number
    activityFactor: number
  }
  weeklyStats: {
    date: string
    friends: number
    messages: number
  }[]
  friends: WechatFriend[]
}

export default function WechatAccountDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [account, setAccount] = useState<WechatAccountDetail | null>(null)
  const [showRestrictions, setShowRestrictions] = useState(false)
  const [showTransferConfirm, setShowTransferConfirm] = useState(false)
  const [showFriendDetail, setShowFriendDetail] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<WechatFriend | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("overview")
  const friendsPerPage = 10

  useEffect(() => {
    // 模拟API调用获取账号详情
    const fetchAccount = async () => {
      // 生成随机标签
      const generateRandomTags = (count: number) => {
        const tagPool = [
          { name: "潜在客户", color: "bg-blue-100 text-blue-800" },
          { name: "高意向", color: "bg-green-100 text-green-800" },
          { name: "已成交", color: "bg-purple-100 text-purple-800" },
          { name: "需跟进", color: "bg-yellow-100 text-yellow-800" },
          { name: "活跃用户", color: "bg-indigo-100 text-indigo-800" },
          { name: "沉默用户", color: "bg-gray-100 text-gray-800" },
          { name: "企业客户", color: "bg-red-100 text-red-800" },
          { name: "个人用户", color: "bg-pink-100 text-pink-800" },
          { name: "新增好友", color: "bg-emerald-100 text-emerald-800" },
          { name: "老客户", color: "bg-amber-100 text-amber-800" },
        ]

        return Array.from({ length: Math.floor(Math.random() * count) + 1 }, () => {
          const randomTag = tagPool[Math.floor(Math.random() * tagPool.length)]
          return {
            id: `tag-${Math.random().toString(36).substring(2, 9)}`,
            name: randomTag.name,
            color: randomTag.color,
          }
        })
      }

      // 生成随机好友
      const friendCount = Math.floor(Math.random() * (300 - 150)) + 150
      const generateFriends = (count: number) => {
        return Array.from({ length: count }, (_, i) => {
          const firstName = ["张", "王", "李", "赵", "陈", "刘", "杨", "黄", "周", "吴"][Math.floor(Math.random() * 10)]
          const secondName = ["小", "大", "明", "华", "强", "伟", "芳", "娜", "秀", "英"][
            Math.floor(Math.random() * 10)
          ]
          const lastName = ["明", "华", "强", "伟", "芳", "娜", "秀", "英", "军", "杰"][Math.floor(Math.random() * 10)]
          const nickname = firstName + secondName + lastName

          // 生成随机的添加时间（过去1年内）
          const addDate = new Date()
          addDate.setDate(addDate.getDate() - Math.floor(Math.random() * 365))

          // 生成随机的最后互动时间（过去30天内）
          const lastDate = new Date()
          lastDate.setDate(lastDate.getDate() - Math.floor(Math.random() * 30))

          return {
            id: `friend-${i}`,
            avatar: `/placeholder.svg?height=40&width=40&text=${nickname[0]}`,
            nickname,
            wechatId: `wxid_${Math.random().toString(36).substring(2, 9)}`,
            remark:
              Math.random() > 0.5
                ? `${nickname}（${["同事", "客户", "朋友", "同学"][Math.floor(Math.random() * 4)]}）`
                : "",
            addTime: addDate.toISOString().split("T")[0],
            lastInteraction: lastDate.toISOString().split("T")[0],
            tags: generateRandomTags(3),
            region: ["广东", "北京", "上海", "浙江", "江苏", "四川", "湖北", "福建", "山东", "河南"][
              Math.floor(Math.random() * 10)
            ],
            source: ["抖音", "小红书", "朋友介绍", "搜索添加", "群聊", "附近的人", "名片分享"][
              Math.floor(Math.random() * 7)
            ],
            notes:
              Math.random() > 0.7
                ? ["对产品很感兴趣", "需要进一步跟进", "已购买过产品", "价格敏感", "需要更多信息"][
                    Math.floor(Math.random() * 5)
                  ]
                : "",
          }
        })
      }

      const friends = generateFriends(friendCount)

      const mockAccount: WechatAccountDetail = {
        id: params.id,
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img_v3_02jn_e7fcc2a4-3560-478d-911a-4ccd69c6392g.jpg-a8zVtwxMuSrPWN9dfWH93EBY0yM3Dh.jpeg",
        nickname: "卡若-25vig",
        wechatId: `wxid_${Math.random().toString(36).substr(2, 8)}`,
        deviceId: "device-1",
        deviceName: "设备1",
        friendCount: friends.length,
        todayAdded: 12,
        status: "normal",
        lastActive: new Date().toLocaleString(),
        messageCount: 1234,
        activeRate: 87,
        accountAge: {
          years: 2,
          months: 8,
        },
        totalChats: 15234,
        chatFrequency: 42,
        restrictionRecords: [
          {
            id: "1",
            date: "2024-02-25",
            reason: "添加好友过于频繁",
            recoveryTime: "2024-02-26",
            type: "friend_limit",
          },
          {
            id: "2",
            date: "2024-01-15",
            reason: "营销内容违规",
            recoveryTime: "2024-01-16",
            type: "marketing",
          },
        ],
        isVerified: true,
        firstMomentDate: "2021-06-15",
        accountWeight: 85,
        weightFactors: {
          restrictionFactor: 0.8,
          verificationFactor: 1.0,
          ageFactor: 0.9,
          activityFactor: 0.85,
        },
        weeklyStats: Array.from({ length: 7 }, (_, i) => ({
          date: `Day ${i + 1}`,
          friends: Math.floor(Math.random() * 50) + 50,
          messages: Math.floor(Math.random() * 100) + 100,
        })),
        friends: friends,
      }
      setAccount(mockAccount)
    }

    fetchAccount()
  }, [params.id])

  if (!account) {
    return <div>加载中...</div>
  }

  const getWeightColor = (weight: number) => {
    if (weight >= 80) return "text-green-600"
    if (weight >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getWeightDescription = (weight: number) => {
    if (weight >= 80) return "账号状态良好"
    if (weight >= 60) return "账号状态一般"
    return "账号状态较差"
  }

  const calculateMaxDailyAdds = (weight: number) => {
    const baseLimit = 20
    return Math.floor(baseLimit * (weight / 100))
  }

  const getRestrictionTypeColor = (type: string) => {
    switch (type) {
      case "friend_limit":
        return "text-yellow-600"
      case "marketing":
        return "text-red-600"
      case "spam":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const formatAccountAge = (age: { years: number; months: number }) => {
    if (age.years === 0) {
      return `${age.months}个月`
    }
    if (age.months === 0) {
      return `${age.years}年`
    }
    return `${age.years}年${age.months}个月`
  }

  const handleTransferFriends = () => {
    setShowTransferConfirm(true)
  }

  const confirmTransferFriends = () => {
    setShowTransferConfirm(false)
    // 跳转到新建计划的订单导入场景
    router.push(`/scenarios/new?type=order&source=${account.wechatId}`)
  }

  const handleFriendClick = (friend: WechatFriend) => {
    setSelectedFriend(friend)
    setShowFriendDetail(true)
  }

  // 过滤好友
  const filteredFriends = account.friends.filter(
    (friend) =>
      friend.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.wechatId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.tags.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // 分页
  const totalPages = Math.ceil(filteredFriends.length / friendsPerPage)
  const paginatedFriends = filteredFriends.slice((currentPage - 1) * friendsPerPage, currentPage * friendsPerPage)

  return (
    <TooltipProvider>
      <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen pb-16">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
          <div className="flex items-center p-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-2 text-lg font-medium">账号详情</h1>
          </div>
        </header>

        <div className="p-4 space-y-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-4 ring-offset-2 ring-blue-500/20">
                  <AvatarImage src={account.avatar} />
                  <AvatarFallback>{account.nickname[0]}</AvatarFallback>
                </Avatar>
                {account.isVerified && (
                  <Badge variant="success" className="absolute -top-2 -right-2 px-2 py-0.5 text-xs">
                    已认证
                  </Badge>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold">{account.nickname}</h2>
                  <Badge variant={account.status === "normal" ? "success" : "destructive"}>
                    {account.status === "normal" ? "正常" : "异常"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">微信号：{account.wechatId}</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={() => router.push(`/devices/${account.deviceId}`)}>
                    <Smartphone className="w-4 h-4 mr-2" />
                    {account.deviceName}
                  </Button>
                  <Button variant="outline" onClick={handleTransferFriends}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    好友转移
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">账号概览</TabsTrigger>
              <TabsTrigger value="friends">好友列表 ({account.friendCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* 账号基础信息 */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2 text-gray-500 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">账号年龄</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{formatAccountAge(account.accountAge)}</div>
                  <div className="text-sm text-gray-500 mt-1">注册时间：{account.firstMomentDate}</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 text-gray-500 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">活跃程度</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{account.chatFrequency}次/天</div>
                  <div className="text-sm text-gray-500 mt-1">总聊天数：{account.totalChats.toLocaleString()}</div>
                </Card>
              </div>

              {/* 账号权重评估 */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">账号权重评估</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${getWeightColor(account.accountWeight)}`}>
                    <span className="text-2xl font-bold">{account.accountWeight}</span>
                    <span className="text-sm">分</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{getWeightDescription(account.accountWeight)}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>账号年龄</span>
                    <Progress value={account.weightFactors.ageFactor * 100} className="w-32" />
                    <span>{(account.weightFactors.ageFactor * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>活跃度</span>
                    <Progress value={account.weightFactors.activityFactor * 100} className="w-32" />
                    <span>{(account.weightFactors.activityFactor * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>限制影响</span>
                    <Progress value={account.weightFactors.restrictionFactor * 100} className="w-32" />
                    <span>{(account.weightFactors.restrictionFactor * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>实名认证</span>
                    <Progress value={account.weightFactors.verificationFactor * 100} className="w-32" />
                    <span>{(account.weightFactors.verificationFactor * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </Card>

              {/* 添加好友统计 */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">添加好友统计</span>
                  </div>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>根据账号权重计算每日可添加好友数量</p>
                    </TooltipContent>
                  </UITooltip>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">今日已添加</span>
                    <span className="text-xl font-bold text-blue-600">{account.todayAdded}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">添加进度</span>
                      <span>
                        {account.todayAdded}/{calculateMaxDailyAdds(account.accountWeight)}
                      </span>
                    </div>
                    <Progress
                      value={(account.todayAdded / calculateMaxDailyAdds(account.accountWeight)) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    根据当前账号权重({account.accountWeight}分)，每日最多可添加{" "}
                    <span className="font-medium text-blue-600">{calculateMaxDailyAdds(account.accountWeight)}</span>{" "}
                    个好友
                  </div>
                </div>
              </Card>

              {/* 限制记录 */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-red-500" />
                    <span className="font-medium">限制记录</span>
                  </div>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setShowRestrictions(true)}>
                    共 {account.restrictionRecords.length} 次
                  </Badge>
                </div>
                <div className="space-y-2">
                  {account.restrictionRecords.slice(0, 2).map((record) => (
                    <div key={record.id} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className={getRestrictionTypeColor(record.type)}>{record.reason}</span>
                        <span className="text-gray-500">{record.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="friends" className="space-y-4 mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  {/* 搜索栏 */}
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="搜索好友昵称/微信号/备注/标签"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* 好友列表 */}
                  <div className="space-y-2">
                    {paginatedFriends.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">未找到匹配的好友</div>
                    ) : (
                      paginatedFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleFriendClick(friend)}
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={friend.avatar} />
                            <AvatarFallback>{friend.nickname[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="font-medium truncate">
                                {friend.nickname}
                                {friend.remark && <span className="text-gray-500 ml-1">({friend.remark})</span>}
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-500 truncate">{friend.wechatId}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {friend.tags.slice(0, 3).map((tag) => (
                                <span key={tag.id} className={`text-xs px-2 py-0.5 rounded-full ${tag.color}`}>
                                  {tag.name}
                                </span>
                              ))}
                              {friend.tags.length > 3 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                  +{friend.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 分页 */}
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber
                          if (totalPages <= 5) {
                            pageNumber = i + 1
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i
                          } else {
                            pageNumber = currentPage - 2 + i
                          }
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === pageNumber}
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentPage(pageNumber)
                                }}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        })}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 限制记录详情弹窗 */}
          <Dialog open={showRestrictions} onOpenChange={setShowRestrictions}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>限制记录详情</DialogTitle>
                <DialogDescription>每次限制恢复时间为24小时</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-4">
                  {account.restrictionRecords.map((record) => (
                    <div key={record.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className={`text-sm ${getRestrictionTypeColor(record.type)}`}>{record.reason}</div>
                        <Badge variant="outline">{record.date}</Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">恢复时间：{record.recoveryTime}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* 好友转移确认弹窗 */}
          <Dialog open={showTransferConfirm} onOpenChange={setShowTransferConfirm}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>好友转移确认</DialogTitle>
                <DialogDescription>即将导出该微信号的好友列表，用于创建新的获客计划</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={account.avatar} />
                    <AvatarFallback>{account.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{account.nickname}</div>
                    <div className="text-sm text-gray-500">{account.wechatId}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>• 将导出该账号下的所有好友信息</p>
                  <p>• 好友信息将用于创建新的订单获客计划</p>
                  <p>• 导出过程中请勿关闭页面</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTransferConfirm(false)}>
                  取消
                </Button>
                <Button onClick={confirmTransferFriends}>确认转移</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 好友详情弹窗 */}
          <Dialog open={showFriendDetail} onOpenChange={setShowFriendDetail}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>好友详情</DialogTitle>
              </DialogHeader>
              {selectedFriend && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedFriend.avatar} />
                      <AvatarFallback>{selectedFriend.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl font-medium">{selectedFriend.nickname}</div>
                      <div className="text-sm text-gray-500">{selectedFriend.wechatId}</div>
                      {selectedFriend.remark && (
                        <div className="text-sm text-gray-500">备注: {selectedFriend.remark}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">添加时间</div>
                      <div className="font-medium">{selectedFriend.addTime}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">最近互动</div>
                      <div className="font-medium">{selectedFriend.lastInteraction}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">地区</div>
                      <div className="font-medium">{selectedFriend.region}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">来源</div>
                      <div className="font-medium">{selectedFriend.source}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      标签
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFriend.tags.map((tag) => (
                        <span key={tag.id} className={`text-sm px-2 py-1 rounded-full ${tag.color}`}>
                          {tag.name}
                        </span>
                      ))}
                      {selectedFriend.tags.length === 0 && <span className="text-sm text-gray-500">暂无标签</span>}
                    </div>
                  </div>

                  {selectedFriend.notes && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">备注信息</div>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">{selectedFriend.notes}</div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowFriendDetail(false)}>
                      关闭
                    </Button>
                    <Button
                      onClick={() => {
                        setShowFriendDetail(false)
                        router.push(`/traffic-pool?source=${selectedFriend.wechatId}`)
                      }}
                    >
                      添加到流量池
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  )
}
