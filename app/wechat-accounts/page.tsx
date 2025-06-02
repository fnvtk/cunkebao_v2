"use client"

import { useState } from "react"
import { ChevronLeft, Search, RefreshCw, ArrowRightLeft, AlertCircle, Filter } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WechatAccount {
  id: string
  avatar: string
  nickname: string
  wechatId: string
  deviceId: string
  deviceName: string
  friendCount: number
  todayAdded: number
  remainingAdds: number
  maxDailyAdds: number
  status: "normal" | "abnormal"
  lastActive: string
}

// 生成与首页一致的模拟数据（42个微信账号，35个在线）
const generateWechatAccounts = (): WechatAccount[] => {
  const nicknames = [
    "卡若-25vig",
    "卡若-zok7e",
    "卡若-ip9ob",
    "卡若-2kna3",
    "存客-a45kl",
    "存客-b78mn",
    "存客-c91op",
    "存客-d23qr",
    "微客-e56st",
    "微客-f89uv",
    "微客-g12wx",
    "微客-h34yz",
  ]

  const avatars = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img_v3_02jn_e7fcc2a4-3560-478d-911a-4ccd69c6392g.jpg-a8zVtwxMuSrPWN9dfWH93EBY0yM3Dh.jpeg",
    "/diverse-group-avatars.png",
    "/diverse-group-avatars.png",
    "/diverse-group-avatars.png",
    "/diverse-group-avatars.png",
    "/diverse-group-avatars.png",
  ]

  const deviceNames = ["设备1", "设备2", "设备3", "设备4", "设备5", "设备6", "设备7", "设备8"]

  return Array.from({ length: 42 }, (_, index) => {
    const isNormal = index < 35 // 确保35个正常状态，与首页一致
    const lastActiveDate = new Date()
    if (!isNormal) {
      // 异常账号的最后活跃时间设置为1-7天前
      lastActiveDate.setDate(lastActiveDate.getDate() - Math.floor(Math.random() * 7) - 1)
    } else {
      // 正常账号的最后活跃时间设置为最近24小时内
      lastActiveDate.setHours(lastActiveDate.getHours() - Math.floor(Math.random() * 24))
    }

    return {
      id: `account-${index + 1}`,
      avatar: avatars[index % avatars.length],
      nickname: nicknames[index % nicknames.length],
      wechatId: `wxid_${Math.random().toString(36).substr(2, 8)}`,
      deviceId: `device-${Math.floor(index / 5) + 1}`,
      deviceName: deviceNames[Math.floor(index / 5)],
      friendCount: Math.floor(Math.random() * (6300 - 520)) + 520,
      todayAdded: isNormal ? Math.floor(Math.random() * 15) : 0,
      remainingAdds: isNormal ? Math.floor(Math.random() * 10) + 5 : 0,
      maxDailyAdds: 20,
      status: isNormal ? "normal" : "abnormal",
      lastActive: lastActiveDate.toISOString(),
    }
  })
}

const mockAccounts = generateWechatAccounts()

export default function WechatAccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<WechatAccount[]>(mockAccounts)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<WechatAccount | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const accountsPerPage = 10

  const filteredAccounts = accounts.filter(
    (account) =>
      account.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.wechatId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.deviceName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * accountsPerPage, currentPage * accountsPerPage)

  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage)

  const handleTransferFriends = (account: WechatAccount) => {
    setSelectedAccount(account)
    setIsTransferDialogOpen(true)
  }

  const handleConfirmTransfer = () => {
    if (!selectedAccount) return

    toast({
      title: "好友转移计划已创建",
      description: "请在场景获客中查看详情",
    })
    setIsTransferDialogOpen(false)
    router.push("/scenarios")
  }

  const handleRefresh = () => {
    setIsLoading(true)

    // 模拟加载延迟
    setTimeout(() => {
      // 重新生成模拟数据，但保持总数和正常数量不变
      const refreshedAccounts = generateWechatAccounts()
      setAccounts(refreshedAccounts)
      setIsLoading(false)

      toast({
        title: "刷新成功",
        description: "微信号列表已更新",
      })
    }, 800)
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">微信号</h1>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <div className="p-4">
        <Card className="p-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="搜索微信号/昵称"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">微信号总数</div>
            <div className="text-2xl font-bold text-blue-600">{accounts.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">正常状态</div>
            <div className="text-2xl font-bold text-green-600">
              {accounts.filter((a) => a.status === "normal").length}
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : (
          <div className="grid gap-3">
            {paginatedAccounts.map((account) => (
              <Card
                key={account.id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push(`/wechat-accounts/${account.id}`)}
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-blue-500/20">
                    <AvatarImage src={account.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{account.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium truncate">{account.nickname}</h3>
                        <Badge variant={account.status === "normal" ? "success" : "destructive"}>
                          {account.status === "normal" ? "正常" : "异常"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTransferFriends(account)
                        }}
                      >
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        好友转移
                      </Button>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                      <div>微信号：{account.wechatId}</div>
                      <div className="flex items-center justify-between">
                        <div>好友数量：{account.friendCount}</div>
                        <div className="text-green-600">今日新增：+{account.todayAdded}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <span>今日可添加：</span>
                            <span className="font-medium">{account.remainingAdds}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertCircle className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>每日最多添加 {account.maxDailyAdds} 个好友</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className="text-sm text-gray-500">
                            {account.todayAdded}/{account.maxDailyAdds}
                          </span>
                        </div>
                        <Progress value={(account.todayAdded / account.maxDailyAdds) * 100} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                        <div>所属设备：{account.deviceName}</div>
                        <div>最后活跃：{new Date(account.lastActive).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && paginatedAccounts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500">没有找到符合条件的微信号</div>
          </div>
        )}

        {!isLoading && paginatedAccounts.length > 0 && (
          <div className="mt-4 flex justify-center">
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
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
          </div>
        )}
      </div>

      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>好友转移确认</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              确认要将 {selectedAccount?.nickname} 的 {selectedAccount?.friendCount}{" "}
              个好友转移到场景获客吗？系统将自动创建一个获客计划。
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmTransfer}>确认转移</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
