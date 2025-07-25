"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift } from "lucide-react"
import { BillingFooter } from "./billing-footer"

const rechargePackages = [
  {
    id: "starter",
    title: "入门套餐",
    amount: 100,
    bonus: 10,
    arrival: 110,
    tag: "推荐",
    tagColor: "bg-blue-500",
    description: "适合个人用户体验AI服务",
    services: "可使用AI服务约110次",
  },
  {
    id: "standard",
    title: "标准套餐",
    amount: 500,
    bonus: 80,
    arrival: 580,
    tag: "热门",
    tagColor: "bg-green-500",
    description: "适合小团队日常使用",
    services: "可使用AI服务约580次",
  },
  {
    id: "premium",
    title: "高级套餐",
    amount: 1000,
    bonus: 200,
    arrival: 1200,
    tag: "超值",
    tagColor: "bg-purple-500",
    description: "适合中型企业批量使用",
    services: "可使用AI服务约1200次",
  },
  {
    id: "enterprise",
    title: "企业套餐",
    amount: 5000,
    bonus: 1500,
    arrival: 6500,
    tag: "企业",
    tagColor: "bg-orange-500",
    description: "适合大型企业长期使用",
    services: "可使用AI服务约6500次",
  },
]

export function RechargeTab() {
  const [customAmount, setCustomAmount] = useState("")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Gift className="h-5 w-5 text-blue-500" />
            AI服务充值套餐
          </CardTitle>
          <p className="text-sm text-gray-500">选择套餐享受更多赠送，让AI为您创造更多价值</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          {rechargePackages.map((pkg) => (
            <Card key={pkg.id} className="relative overflow-hidden border-2 hover:border-blue-200 transition-colors">
              <Badge className={`absolute top-3 right-3 ${pkg.tagColor} text-white`}>{pkg.tag}</Badge>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{pkg.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                    <p className="text-sm text-gray-600 mt-2">{pkg.services}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-3xl font-bold text-blue-600">¥{pkg.amount}</span>
                      <div className="flex items-center text-green-600 text-sm">
                        <Gift className="h-4 w-4 mr-1" />
                        赠送 ¥{pkg.bonus}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">实际到账</p>
                    <p className="text-2xl font-bold text-green-600">¥{pkg.arrival}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">自定义充值金额</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Input
            type="number"
            placeholder="最低10元，最高5000元"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1"
          />
          <Button className="bg-blue-600 hover:bg-blue-700">立即充值</Button>
        </CardContent>
      </Card>

      <BillingFooter />
    </div>
  )
}
