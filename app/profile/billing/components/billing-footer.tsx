"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

export function BillingFooter() {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          AI智能服务收费说明
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 space-y-3">
        <div>
          <span className="font-semibold text-blue-700">• 核心AI服务:</span>{" "}
          添加好友、小宝AI内容生产、智能分发，统一按次收费，每次1元。
        </div>
        <div>
          <span className="font-semibold text-blue-700">• 微信基础服务:</span>{" "}
          包月形式，每月98元，包含微信号基础维护和基础功能。
        </div>
        <div>
          <span className="font-semibold text-blue-700">• 设备买卖:</span> 专用手机设备一次性费用，每台6980元。
        </div>
        <div>
          <span className="font-semibold text-blue-700">• 版本套餐:</span> 普通版免费，标准版98元/月，企业版1980元/月。
        </div>
        <div>
          <span className="font-semibold text-blue-700">• 充值赠送:</span> 充值越多赠送越多，最高可享受30%赠送。
        </div>
      </CardContent>
    </Card>
  )
}
