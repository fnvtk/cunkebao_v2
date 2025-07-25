"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, MessageSquare, Share2, Bot, HardDrive, Zap } from "lucide-react"
import { BillingFooter } from "./billing-footer"

const services = [
  {
    icon: <MessageSquare className="h-6 w-6 text-orange-500" />,
    title: "添加好友及打招呼",
    description: "AI智能添加好友并发送个性化打招呼消息",
    features: ["智能筛选目标用户", "自定义打招呼消息", "自动处理好友申请"],
    usage: 15,
    total: 450,
    price: 1,
  },
  {
    icon: <Bot className="h-6 w-6 text-orange-500" />,
    title: "小宝AI内容生产",
    description: "AI采集朋友圈内容、智能改写朋友圈内容",
    features: ["智能采集优质朋友圈内容", "AI改写发布文案", "内容质量智能评估"],
    usage: 28,
    total: 680,
    price: 1,
  },
  {
    icon: <Share2 className="h-6 w-6 text-orange-500" />,
    title: "智能分发服务",
    description: "AI智能将内容分发到朋友圈，支持多账号及朋友圈",
    features: ["智能选择最佳发布时间", "多账号批量分发", "分发效果实时监控"],
    usage: 42,
    total: 1250,
    price: 1,
  },
]

const otherServices = [
  {
    icon: <HardDrive className="h-6 w-6 text-gray-600" />,
    title: "微信基础服务",
    description: "微信号基础维护、监控和管理",
    price: "98",
    unit: "/月",
    tag: "包月服务",
  },
  {
    icon: <Bot className="h-6 w-6 text-gray-600" />,
    title: "专用设备买卖",
    description: "存客宝专用手机设备",
    price: "6,980",
    unit: "/台",
    tag: "一次性费用",
  },
]

export function ServicesTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              AI智能服务收费
            </CardTitle>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              统一1元/次
            </Badge>
          </div>
          <p className="text-sm text-gray-500">三项核心AI服务，按使用次数收费，每次1元</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {services.map((service, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start gap-4 mb-3">
                <div className="p-2 bg-orange-50 rounded-lg">{service.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">¥{service.price}</p>
                      <p className="text-xs text-gray-500">/次</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">功能特点:</p>
                {service.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>今日使用进度</span>
                  <span>
                    {service.usage} / {service.total}
                  </span>
                </div>
                <Progress value={(service.usage / service.total) * 100} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-gray-600" />
            其他相关费用
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {otherServices.map((service, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-2 bg-gray-50 rounded-lg">{service.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  ¥{service.price}
                  <span className="text-sm font-normal text-gray-500">{service.unit}</span>
                </p>
                <Badge variant="outline" className="mt-1">
                  {service.tag}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <BillingFooter />
    </div>
  )
}
