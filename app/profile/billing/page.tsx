"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock } from "lucide-react"
import BottomNav from "@/app/components/BottomNav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillingHeader } from "./components/billing-header"
import { RechargeTab } from "./components/recharge-tab"
import { ServicesTab } from "./components/services-tab"
import { PackagesTab } from "./components/packages-tab"

interface AccountInfo {
  balance: number
  availableServices: number
  dailyFriendAdds: number
  dailyAiCreations: number
  dailyContentShares: number
}

export default function BillingPage() {
  const router = useRouter()
  const [accountInfo] = useState<AccountInfo>({
    balance: 1288.5,
    availableServices: 1288,
    dailyFriendAdds: 15,
    dailyAiCreations: 28,
    dailyContentShares: 42,
  })

  return (
    <div className="flex-1 bg-gray-50 min-h-screen pb-16">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">存客宝AI智能服务</h1>
          <Button variant="ghost" size="sm" onClick={() => router.push("/profile/billing/records")}>
            <Clock className="h-4 w-4 mr-1" />
            记录
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <BillingHeader accountInfo={accountInfo} />

        <Tabs defaultValue="recharge" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recharge">账户充值</TabsTrigger>
            <TabsTrigger value="services">AI服务</TabsTrigger>
            <TabsTrigger value="packages">版本套餐</TabsTrigger>
          </TabsList>
          <TabsContent value="recharge" className="mt-4">
            <RechargeTab />
          </TabsContent>
          <TabsContent value="services" className="mt-4">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="packages" className="mt-4">
            <PackagesTab />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  )
}
