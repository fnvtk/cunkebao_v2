"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Crown, Building } from "lucide-react"
import { BillingFooter } from "./billing-footer"

const packages = [
  {
    icon: <Package className="h-8 w-8 text-gray-500" />,
    title: "普通版本",
    price: "免费",
    unit: "",
    description: "充值即可使用，包含基础AI功能",
    features: ["基础AI服务", "标准客服支持", "基础数据统计"],
    ctaText: "当前使用中",
    isCurrent: true,
    isRecommended: false,
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  {
    icon: <Crown className="h-8 w-8 text-purple-500" />,
    title: "标准版本",
    price: "98",
    unit: "/月",
    description: "适合中小企业，AI功能更丰富",
    features: ["高级AI服务", "优先客服支持", "详细数据分析", "API接口访问"],
    ctaText: "立即升级",
    isCurrent: false,
    isRecommended: true,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    icon: <Building className="h-8 w-8 text-blue-500" />,
    title: "企业版本",
    price: "1980",
    unit: "/月",
    description: "大型企业专用，定制化AI服务",
    features: ["企业级AI服务", "专属客服经理", "定制开发服务", "私有部署支持", "SLA服务保障"],
    ctaText: "联系销售",
    isCurrent: false,
    isRecommended: false,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
]

export function PackagesTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-500" />
            存客宝版本套餐
          </CardTitle>
          <p className="text-sm text-gray-500">选择适合的版本，享受不同级别的AI服务</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {packages.map((pkg, index) => (
            <Card key={index} className={`relative overflow-hidden ${pkg.borderColor} ${pkg.bgColor}`}>
              {pkg.isRecommended && <Badge className="absolute top-3 right-3 bg-purple-500 text-white">推荐</Badge>}
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">{pkg.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{pkg.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-orange-500">
                          {pkg.price === "免费" ? pkg.price : `¥${pkg.price}`}
                          <span className="text-sm font-normal text-gray-500">{pkg.unit}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-medium text-sm text-gray-700 mb-3">包含功能:</p>
                  <div className="space-y-2">
                    {pkg.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className={`w-full ${pkg.isCurrent ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                  disabled={pkg.isCurrent}
                >
                  {pkg.ctaText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <BillingFooter />
    </div>
  )
}
