"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
// 在 import 部分添加 DollarSign 图标
import { Bot, Users, MessageCircle, Activity, DollarSign } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

// 在 workspaceFeatures 数组中添加流量定价入口，放在第一个位置
const workspaceFeatures = [
  {
    id: "pricing",
    name: "流量定价",
    description: "定义你的流量价格",
    icon: DollarSign,
    color: "bg-emerald-100 text-emerald-600",
    isNew: true,
  },
  {
    id: "auto-like",
    name: "自动点赞",
    description: "智能自动点赞互动",
    icon: Activity,
    color: "bg-pink-100 text-pink-600",
    isNew: true,
  },
  {
    id: "moments-sync",
    name: "朋友圈同步",
    description: "自动同步朋友圈内容",
    icon: MessageCircle,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "group-message",
    name: "群消息推送",
    description: "智能群发助手",
    icon: MessageCircle,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "auto-group",
    name: "自动建群",
    description: "智能均分好友建群",
    icon: Users,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "ai-assistant",
    name: "AI对话助手",
    description: "智能回复，提高互动质量",
    icon: Bot,
    color: "bg-blue-100 text-blue-600",
    isNew: true,
  },
]

const aiFeatures = [
  {
    id: "ai-analyzer",
    name: "AI数据分析",
    description: "智能分析客户行为特征",
    icon: Bot,
    color: "bg-indigo-100 text-indigo-600",
    isNew: true,
  },
  {
    id: "ai-strategy",
    name: "AI策略优化",
    description: "智能优化获客策略",
    icon: Bot,
    color: "bg-cyan-100 text-cyan-600",
    isNew: true,
  },
]

export default function WorkspacePage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
  })

  useEffect(() => {
    // 模拟获取统计数据
    setStats({
      totalTasks: 42,
      activeTasks: 12,
      completedTasks: 30,
    })
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-50 to-white min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">工作台</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-r-none border-r-0">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">总任务数</span>
                  <span className="text-3xl font-bold text-blue-600 mt-2">{stats.totalTasks}</span>
                  <Progress value={(stats.activeTasks / stats.totalTasks) * 100} className="mt-4" />
                  <span className="text-sm text-gray-500 mt-2">
                    进行中：{stats.activeTasks} / 已完成：{stats.completedTasks}
                  </span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full"
            >
              <Card className="p-6 bg-gradient-to-br from-green-50 to-white rounded-l-none">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">今日任务</span>
                  <span className="text-3xl font-bold text-green-600 mt-2">{stats.activeTasks}</span>
                  <div className="flex items-center mt-4">
                    <Activity className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-500">活跃度 98%</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* 常用功能 */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">常用功能</h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {workspaceFeatures.map((feature) => (
                <motion.div key={feature.id} variants={item}>
                  <Link href={`/workspace/${feature.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="flex flex-col h-full">
                        <div
                          className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{feature.name}</h3>
                          {feature.isNew && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 flex-grow">{feature.description}</p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* AI 功能 */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI 智能助手</h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {aiFeatures.map((feature) => (
                <motion.div key={feature.id} variants={item}>
                  <Link href={`/workspace/${feature.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                      <div className="flex flex-col h-full">
                        <div
                          className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{feature.name}</h3>
                          {feature.isNew && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 flex-grow">{feature.description}</p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

