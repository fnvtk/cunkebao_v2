"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface AccountInfo {
  balance: number
  availableServices: number
  dailyFriendAdds: number
  dailyAiCreations: number
  dailyContentShares: number
}

export function BillingHeader({ accountInfo }: { accountInfo: AccountInfo }) {
  return (
    <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-80">账户余额</p>
            <p className="text-4xl font-bold mt-1">
              ¥{accountInfo.balance.toLocaleString("zh-CN", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </p>
            <p className="text-xs opacity-70 mt-1">可用AI服务约 {accountInfo.availableServices} 次</p>
          </div>
          <div className="text-white/80">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center mt-6">
          <div>
            <p className="text-2xl font-semibold">{accountInfo.dailyFriendAdds}</p>
            <p className="text-xs opacity-80">今日添加好友</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{accountInfo.dailyAiCreations}</p>
            <p className="text-xs opacity-80">今日AI创作</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{accountInfo.dailyContentShares}</p>
            <p className="text-xs opacity-80">今日内容分发</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
