"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ThumbsUp, Clock, Send, Users, Share2, MessageSquare, BarChart2, Brain, LineChart } from "lucide-react"

export default function WorkspacePage() {
  // 模拟数据
  const totalTasks = 42
  const inProgressTasks = 12
  const completedTasks = 30
  const todayTasks = 12
  const activityRate = 98

  const commonFeatures = [
    {
      title: "自动点赞",
      description: "智能自动点赞互动",
      icon: ThumbsUp,
      href: "/workspace/auto-like",
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      isNew: true,
    },
    {
      title: "朋友圈同步",
      description: "自动同步朋友圈内容",
      icon: Clock,
      href: "/workspace/moments-sync",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      title: "群消息推送",
      description: "智能群发助手",
      icon: Send,
      href: "/workspace/group-push",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "自动建群",
      description: "智能拉好友建群",
      icon: Users,
      href: "/workspace/auto-group",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "流量分发",
      description: "管理流量分发和分配",
      icon: Share2,
      href: "/workspace/traffic-distribution",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "AI对话助手",
      description: "智能回复，提高互动质量",
      icon: MessageSquare,
      href: "/workspace/ai-assistant",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      isNew: true,
    },
  ]

  const aiFeatures = [
    {
      title: "AI数据分析",
      description: "智能分析客户行为特征",
      icon: BarChart2,
      href: "/workspace/ai-analyzer",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      isNew: true,
    },
    {
      title: "AI策略优化",
      description: "智能优化获客策略",
      icon: Brain,
      href: "/workspace/ai-strategy",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-500",
      isNew: true,
    },
    {
      title: "AI销售预测",
      description: "智能预测销售趋势",
      icon: LineChart,
      href: "/workspace/ai-forecast",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
  ]

  const progressPercentage = (inProgressTasks / totalTasks) * 100

  return (
    <div className="flex-1 p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">工作台</h1>

      {/* 常用功能 */}
      <h2 className="text-xl font-bold mb-4">常用功能</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {commonFeatures.map((feature) => (
          <Link key={feature.href} href={feature.href} className="block">
            <Card className="p-4 hover:shadow-md transition-shadow h-full">
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="font-medium">{feature.title}</h3>
                  {feature.isNew && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">New</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* AI 智能助手 */}
      <h2 className="text-xl font-bold mb-4">AI 智能助手</h2>
      <div className="grid grid-cols-2 gap-4">
        {aiFeatures.map((feature) => (
          <Link key={feature.href} href={feature.href} className="block">
            <Card className="p-4 hover:shadow-md transition-shadow h-full">
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="font-medium">{feature.title}</h3>
                  {feature.isNew && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">New</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
