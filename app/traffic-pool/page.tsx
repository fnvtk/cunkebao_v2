"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  Search,
  RefreshCw,
  Users,
  Filter,
  Smartphone,
  MessageCircle,
  User,
  Layers,
  X,
  Clock,
  Tag,
  DollarSign,
  Eye,
  Plus,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Crown,
  Diamond,
  Rocket,
  AlertTriangle,
  UserCheck,
  Activity,
  Calendar,
  Upload,
  Zap,
  Target,
  Sparkles,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MoreHorizontal,
  Heart,
  ShoppingCart,
  MousePointer,
  Mail,
  Download,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMobile } from "@/hooks/use-mobile"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"

// 设备信息接口
interface Device {
  id: string
  name: string
  status: "online" | "offline" | "busy"
  battery: number
  location: string
  wechatAccounts: number
  dailyAddLimit: number
  todayAdded: number
}

// 微信账号接口
interface WechatAccount {
  id: string
  nickname: string
  wechatId: string
  avatar: string
  deviceId: string
  status: "normal" | "limited" | "blocked"
  friendCount: number
  dailyAddLimit: number
}

// 客服代表接口
interface CustomerService {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "busy"
  assignedUsers: number
}

// 流量池接口
interface TrafficPool {
  id: string
  name: string
  description: string
  userCount: number
  tags: string[]
  createdAt: string
  color: string
  icon: string
}

// RFM评分接口
interface RFMScore {
  recency: number // 1-5分，最近互动时间
  frequency: number // 1-5分，互动频率
  monetary: number // 1-5分，消费金额
  total: number // 总分
  segment: string // 用户分群
  priority: "high" | "medium" | "low" // 添加优先级
  percentile: number // 百分位数
  trend: "up" | "down" | "stable" // 趋势
}

// 用户标签接口
interface UserTag {
  id: string
  name: string
  color: string
  source: string // 标签来源：设备ID或微信号
  confidence: number // 标签置信度
}

// 用户互动记录
interface UserInteraction {
  id: string
  type: "message" | "purchase" | "view" | "click" | "like" | "share"
  content: string
  timestamp: string
  value?: number
  platform: string
  engagement: number // 参与度评分
}

// 流量池用户接口
interface TrafficUser {
  id: string
  avatar: string
  nickname: string
  wechatId: string
  phone: string
  region: string
  note: string
  status: "pending" | "added" | "failed" | "duplicate"
  addTime: string
  source: string
  scenario: string // 获客场景
  deviceId: string // 所属设备
  wechatAccountId: string // 微信号ID
  customerServiceId: string // 客服ID
  poolIds: string[] // 所属流量池IDs
  tags: UserTag[]
  rfmScore: RFMScore
  lastInteraction: string
  totalSpent: number
  interactionCount: number
  conversionRate: number
  isDuplicate: boolean // 是否重复用户
  mergedAccounts: string[] // 合并的微信账号
  addStatus: "not_added" | "adding" | "added" | "failed" // 添加状态
  interactions: UserInteraction[] // 用户互动记录
  lifetimeValue: number // 生命周期价值
  acquisitionCost: number // 获客成本
  roi: number // 投资回报率
  riskScore: number // 流失风险评分
  nextBestAction: string // 下一步最佳行动
}

// 场景类型
const SCENARIOS = [
  { id: "poster", name: "海报获客", icon: "🎨", color: "bg-pink-100 text-pink-800" },
  { id: "phone", name: "电话获客", icon: "📞", color: "bg-blue-100 text-blue-800" },
  { id: "douyin", name: "抖音获客", icon: "🎵", color: "bg-purple-100 text-purple-800" },
  { id: "xiaohongshu", name: "小红书获客", icon: "📖", color: "bg-red-100 text-red-800" },
  { id: "weixinqun", name: "微信群获客", icon: "👥", color: "bg-green-100 text-green-800" },
  { id: "api", name: "API获客", icon: "🔗", color: "bg-indigo-100 text-indigo-800" },
  { id: "order", name: "订单获客", icon: "📦", color: "bg-orange-100 text-orange-800" },
  { id: "payment", name: "付款码获客", icon: "💳", color: "bg-emerald-100 text-emerald-800" },
]

// RFM分群定义（基于产品复盘文档）
const RFM_SEGMENTS = {
  "555": {
    name: "重要价值客户",
    color: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    icon: Crown,
    priority: "high",
    description: "最高价值客户，需要VIP服务",
    strategy: "专属服务、高端产品推荐",
  },
  "554": {
    name: "重要保持客户",
    color: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
    icon: Diamond,
    priority: "high",
    description: "高价值但活跃度下降，需要挽回",
    strategy: "个性化关怀、专属优惠",
  },
  "544": {
    name: "重要发展客户",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    icon: Rocket,
    priority: "high",
    description: "高潜力客户，需要培育",
    strategy: "产品教育、价值引导",
  },
  "455": {
    name: "重要挽留客户",
    color: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
    icon: AlertTriangle,
    priority: "medium",
    description: "有流失风险的重要客户",
    strategy: "紧急挽回、问题解决",
  },
  "444": {
    name: "一般价值客户",
    color: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    icon: UserCheck,
    priority: "medium",
    description: "稳定的中等价值客户",
    strategy: "常规维护、交叉销售",
  },
  "333": {
    name: "一般保持客户",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    icon: Activity,
    priority: "medium",
    description: "需要激活的普通客户",
    strategy: "活动邀请、内容推送",
  },
  "222": {
    name: "新用户",
    color: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
    icon: Sparkles,
    priority: "low",
    description: "新加入的用户，需要引导",
    strategy: "新手引导、基础教育",
  },
  "111": {
    name: "流失预警客户",
    color: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
    icon: Clock,
    priority: "low",
    description: "长期未活跃，可能已流失",
    strategy: "召回活动、重新激活",
  },
}

// 生成模拟设备数据
const generateMockDevices = (): Device[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `device-${i + 1}`,
    name: `智能设备${i + 1}`,
    status: ["online", "offline", "busy"][Math.floor(Math.random() * 3)] as "online" | "offline" | "busy",
    battery: Math.floor(Math.random() * 100),
    location: ["北京", "上海", "广州", "深圳", "杭州", "成都"][Math.floor(Math.random() * 6)],
    wechatAccounts: Math.floor(Math.random() * 5) + 1,
    dailyAddLimit: Math.random() > 0.5 ? 20 : 10,
    todayAdded: Math.floor(Math.random() * 15),
  }))
}

// 生成模拟微信账号数据
const generateMockWechatAccounts = (devices: Device[]): WechatAccount[] => {
  const accounts: WechatAccount[] = []

  devices.forEach((device) => {
    for (let i = 0; i < device.wechatAccounts; i++) {
      accounts.push({
        id: `wx-${device.id}-${i + 1}`,
        nickname: `微信号${device.id.split("-")[1]}-${i + 1}`,
        wechatId: `wxid_${Math.random().toString(36).substr(2, 8)}`,
        avatar: `/placeholder.svg?height=40&width=40&query=wx${Math.floor(Math.random() * 10)}`,
        deviceId: device.id,
        status: ["normal", "limited", "blocked"][Math.floor(Math.random() * 3)] as "normal" | "limited" | "blocked",
        friendCount: Math.floor(Math.random() * 4000) + 1000,
        dailyAddLimit: Math.random() > 0.5 ? 20 : 10,
      })
    }
  })

  return accounts
}

// 生成模拟客服数据
const generateMockCustomerServices = (): CustomerService[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `cs-${i + 1}`,
    name: `客服专员${i + 1}`,
    avatar: `/placeholder.svg?height=40&width=40&query=cs${i}`,
    status: ["online", "offline", "busy"][Math.floor(Math.random() * 3)] as "online" | "offline" | "busy",
    assignedUsers: Math.floor(Math.random() * 100) + 50,
  }))
}

// 生成模拟流量池数据
const generateMockTrafficPools = (): TrafficPool[] => {
  return [
    {
      id: "pool-1",
      name: "💎 钻石客户池",
      description: "最高价值客户，享受VIP专属服务",
      userCount: 156,
      tags: ["高价值", "VIP", "重要客户"],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      color: "from-red-500 to-pink-500",
      icon: "💎",
    },
    {
      id: "pool-2",
      name: "🚀 潜力客户池",
      description: "高潜力客户，重点培育对象",
      userCount: 287,
      tags: ["潜在客户", "待培育", "高潜力"],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      color: "from-blue-500 to-cyan-500",
      icon: "🚀",
    },
    {
      id: "pool-3",
      name: "⚡ 活跃用户池",
      description: "高活跃度用户，互动频繁",
      userCount: 124,
      tags: ["活跃用户", "高互动", "高频次"],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      color: "from-green-500 to-emerald-500",
      icon: "⚡",
    },
    {
      id: "pool-4",
      name: "⚠️ 挽回客户池",
      description: "流失风险客户，需要紧急关注",
      userCount: 68,
      tags: ["流失预警", "挽回", "风险客户"],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      color: "from-orange-500 to-red-500",
      icon: "⚠️",
    },
    {
      id: "pool-5",
      name: "✨ 新用户池",
      description: "新加入用户，需要引导培育",
      userCount: 93,
      tags: ["新用户", "引导", "培育"],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      color: "from-purple-500 to-indigo-500",
      icon: "✨",
    },
  ]
}

// 生成模拟RFM数据
const generateRFMScore = (): RFMScore => {
  const r = Math.floor(Math.random() * 5) + 1
  const f = Math.floor(Math.random() * 5) + 1
  const m = Math.floor(Math.random() * 5) + 1
  const segmentKey = `${r}${f}${m}` as keyof typeof RFM_SEGMENTS
  const segment = RFM_SEGMENTS[segmentKey] || RFM_SEGMENTS["333"]

  return {
    recency: r,
    frequency: f,
    monetary: m,
    total: r + f + m,
    segment: segment.name,
    priority: segment.priority,
    percentile: Math.floor(Math.random() * 100) + 1,
    trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
  }
}

// 生成模拟用户互动记录
const generateMockInteractions = (): UserInteraction[] => {
  const interactions: UserInteraction[] = []
  const interactionCount = Math.floor(Math.random() * 15) + 5

  const platforms = ["微信", "抖音", "小红书", "朋友圈", "社群"]
  const interactionTypes = [
    { type: "message", content: ["发送私信", "回复消息", "主动咨询"], engagement: 8 },
    { type: "purchase", content: ["购买产品A", "订阅会员", "购买服务包"], engagement: 10 },
    { type: "view", content: ["浏览产品页", "查看朋友圈", "观看视频"], engagement: 3 },
    { type: "click", content: ["点击链接", "点击广告", "点击推荐"], engagement: 5 },
    { type: "like", content: ["点赞朋友圈", "点赞视频", "点赞文章"], engagement: 2 },
    { type: "share", content: ["分享产品", "转发内容", "推荐朋友"], engagement: 7 },
  ]

  for (let i = 0; i < interactionCount; i++) {
    const interactionType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)]
    const type = interactionType.type as "message" | "purchase" | "view" | "click" | "like" | "share"

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    const content = interactionType.content[Math.floor(Math.random() * interactionType.content.length)]
    let value: number | undefined = undefined

    if (type === "purchase") {
      value = Math.floor(Math.random() * 2000) + 100
    }

    interactions.push({
      id: `interaction-${i}`,
      type,
      content,
      timestamp: date.toISOString(),
      value,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      engagement: interactionType.engagement + Math.floor(Math.random() * 3) - 1,
    })
  }

  return interactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// 生成模拟用户标签
const generateUserTags = (rfmScore: RFMScore): UserTag[] => {
  const tags: UserTag[] = []

  // 基于RFM分数添加标签
  if (rfmScore.recency >= 4) {
    tags.push({
      id: `tag-recency-${rfmScore.recency}`,
      name: "近期活跃",
      color: "bg-green-100 text-green-800 border-green-200",
      source: "system",
      confidence: 0.9,
    })
  } else if (rfmScore.recency <= 2) {
    tags.push({
      id: `tag-recency-${rfmScore.recency}`,
      name: "长期未活跃",
      color: "bg-red-100 text-red-800 border-red-200",
      source: "system",
      confidence: 0.8,
    })
  }

  if (rfmScore.frequency >= 4) {
    tags.push({
      id: `tag-frequency-${rfmScore.frequency}`,
      name: "高频互动",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      source: "system",
      confidence: 0.85,
    })
  }

  if (rfmScore.monetary >= 4) {
    tags.push({
      id: `tag-monetary-${rfmScore.monetary}`,
      name: "高消费",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      source: "system",
      confidence: 0.95,
    })
  }

  // 随机添加一些其他标签
  const otherTags = [
    { name: "潜在客户", color: "bg-yellow-100 text-yellow-800 border-yellow-200", confidence: 0.7 },
    { name: "已成交", color: "bg-green-100 text-green-800 border-green-200", confidence: 1.0 },
    { name: "需跟进", color: "bg-orange-100 text-orange-800 border-orange-200", confidence: 0.8 },
    { name: "VIP客户", color: "bg-red-100 text-red-800 border-red-200", confidence: 0.9 },
    { name: "企业客户", color: "bg-blue-100 text-blue-800 border-blue-200", confidence: 0.85 },
    { name: "个人客户", color: "bg-gray-100 text-gray-800 border-gray-200", confidence: 0.75 },
    { name: "新客户", color: "bg-cyan-100 text-cyan-800 border-cyan-200", confidence: 0.8 },
    { name: "老客户", color: "bg-purple-100 text-purple-800 border-purple-200", confidence: 0.9 },
  ]

  const tagCount = Math.floor(Math.random() * 3) + 1
  const selectedIndices = new Set<number>()

  while (selectedIndices.size < tagCount) {
    selectedIndices.add(Math.floor(Math.random() * otherTags.length))
  }

  selectedIndices.forEach((index) => {
    const tag = otherTags[index]
    tags.push({
      id: `tag-other-${index}`,
      name: tag.name,
      color: tag.color,
      source: Math.random() > 0.5 ? "manual" : "auto",
      confidence: tag.confidence,
    })
  })

  return tags
}

// 生成模拟用户数据
const generateMockUsers = (
  devices: Device[],
  wechatAccounts: WechatAccount[],
  customerServices: CustomerService[],
  trafficPools: TrafficPool[],
): TrafficUser[] => {
  return Array.from({ length: 800 }, (_, i) => {
    const device = devices[Math.floor(Math.random() * devices.length)]
    const wechatAccount = wechatAccounts.filter((acc) => acc.deviceId === device.id)[0] || wechatAccounts[0]
    const customerService = customerServices[Math.floor(Math.random() * customerServices.length)]
    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
    const rfmScore = generateRFMScore()
    const isDuplicate = Math.random() < 0.12

    const poolCount = Math.floor(Math.random() * 3)
    const poolIds =
      poolCount === 0
        ? []
        : Array.from({ length: poolCount }, () => trafficPools[Math.floor(Math.random() * trafficPools.length)].id)

    if (rfmScore.priority === "high" && !poolIds.includes("pool-1")) {
      if (Math.random() > 0.3) {
        poolIds.push("pool-1")
      }
    }

    const addTime = new Date()
    addTime.setDate(addTime.getDate() - Math.floor(Math.random() * 60))

    const lastInteraction = new Date()
    lastInteraction.setDate(lastInteraction.getDate() - Math.floor(Math.random() * 14))

    const tags = generateUserTags(rfmScore)
    const interactions = generateMockInteractions()

    const totalSpent = Math.floor(Math.random() * 50000)
    const acquisitionCost = Math.floor(Math.random() * 500) + 50
    const lifetimeValue = totalSpent + Math.floor(Math.random() * 20000)
    const roi = totalSpent > 0 ? ((lifetimeValue - acquisitionCost) / acquisitionCost) * 100 : 0

    return {
      id: `user-${i + 1}`,
      avatar: `/placeholder.svg?height=40&width=40&query=avatar${i % 20}`,
      nickname: `用户${String(i + 1).padStart(3, "0")}`,
      wechatId: `wxid_${Math.random().toString(36).substr(2, 8)}`,
      phone: `1${Math.floor(Math.random() * 9 + 1)}${Math.random().toString().slice(2, 11)}`,
      region: device.location,
      note: Math.random() > 0.6 ? `这是用户${i + 1}的备注信息，包含重要的客户背景` : "",
      status: isDuplicate
        ? "duplicate"
        : (["pending", "added", "failed"][Math.floor(Math.random() * 3)] as "pending" | "added" | "failed"),
      addTime: addTime.toISOString(),
      source: scenario.name,
      scenario: scenario.id,
      deviceId: device.id,
      wechatAccountId: wechatAccount.id,
      customerServiceId: customerService.id,
      poolIds,
      tags,
      rfmScore,
      lastInteraction: lastInteraction.toISOString(),
      totalSpent,
      interactionCount: interactions.length,
      conversionRate: Math.floor(Math.random() * 100),
      isDuplicate,
      mergedAccounts: isDuplicate ? [`wx-${Math.random().toString(36).substr(2, 6)}`] : [],
      addStatus: ["not_added", "adding", "added", "failed"][Math.floor(Math.random() * 4)] as
        | "not_added"
        | "adding"
        | "added"
        | "failed",
      interactions,
      lifetimeValue,
      acquisitionCost,
      roi: Math.round(roi),
      riskScore: Math.floor(Math.random() * 100),
      nextBestAction: ["发送个性化优惠", "邀请参加活动", "推荐新产品", "客服主动联系", "发送关怀消息", "提供专属服务"][
        Math.floor(Math.random() * 6)
      ],
    }
  })
}

const mockDevices = generateMockDevices()
const mockWechatAccounts = generateMockWechatAccounts(mockDevices)
const mockCustomerServices = generateMockCustomerServices()
const mockTrafficPools = generateMockTrafficPools()
const mockUsers = generateMockUsers(mockDevices, mockWechatAccounts, mockCustomerServices, mockTrafficPools)

export default function TrafficPoolPage() {
  const router = useRouter()
  const { isMobile } = useMobile()
  const [users, setUsers] = useState<TrafficUser[]>(mockUsers)
  const [devices] = useState<Device[]>(mockDevices)
  const [wechatAccounts] = useState<WechatAccount[]>(mockWechatAccounts)
  const [customerServices] = useState<CustomerService[]>(mockCustomerServices)
  const [trafficPools] = useState<TrafficPool[]>(mockTrafficPools)
  const [loading, setLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // 筛选状态
  const [showFilters, setShowFilters] = useState(false)
  const [deviceFilter, setDeviceFilter] = useState<string[]>([])
  const [poolFilter, setPoolFilter] = useState("all")
  const [valuationFilter, setValuationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [rfmFilter, setRfmFilter] = useState<string[]>([])
  const [riskFilter, setRiskFilter] = useState([0, 100])
  const [roiFilter, setRoiFilter] = useState([-100, 1000])

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = isMobile ? 12 : 24

  // 弹窗状态
  const [selectedUser, setSelectedUser] = useState<TrafficUser | null>(null)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [showAddToPool, setShowAddToPool] = useState(false)
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState("info")

  // 管理面板状态
  const [showManagementPanel, setShowManagementPanel] = useState(false)
  const [managementActiveTab, setManagementActiveTab] = useState("pools")

  // 视图模式
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [sortBy, setSortBy] = useState("rfm_score")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const { toast } = useToast()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 计算统计数据
  const stats = {
    total: users.length,
    highValue: users.filter((u) => u.rfmScore.priority === "high").length,
    mediumValue: users.filter((u) => u.rfmScore.priority === "medium").length,
    lowValue: users.filter((u) => u.rfmScore.priority === "low").length,
    duplicates: users.filter((u) => u.isDuplicate).length,
    pending: users.filter((u) => u.status === "pending").length,
    added: users.filter((u) => u.status === "added").length,
    avgSpent: Math.round(users.reduce((sum, u) => sum + u.totalSpent, 0) / users.length),
    avgRoi: Math.round(users.reduce((sum, u) => sum + u.roi, 0) / users.length),
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
    avgLifetimeValue: Math.round(users.reduce((sum, u) => sum + u.lifetimeValue, 0) / users.length),
  }

  // 过滤用户
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !debouncedSearchQuery ||
      user.nickname.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      user.wechatId.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.tags.some((tag) => tag.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

    const matchesDevice = deviceFilter.length === 0 || deviceFilter.includes(user.deviceId)
    const matchesValuation = valuationFilter === "all" || user.rfmScore.priority === valuationFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesPool =
      poolFilter === "all" || (poolFilter === "none" ? user.poolIds.length === 0 : user.poolIds.includes(poolFilter))

    const matchesRfm = rfmFilter.length === 0 || rfmFilter.includes(user.rfmScore.segment)
    const matchesRisk = user.riskScore >= riskFilter[0] && user.riskScore <= riskFilter[1]
    const matchesRoi = user.roi >= roiFilter[0] && user.roi <= roiFilter[1]

    return (
      matchesSearch &&
      matchesDevice &&
      matchesValuation &&
      matchesStatus &&
      matchesPool &&
      matchesRfm &&
      matchesRisk &&
      matchesRoi
    )
  })

  // 排序用户
  const sortedUsers = filteredUsers.sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortBy) {
      case "rfm_score":
        aValue = a.rfmScore.total
        bValue = b.rfmScore.total
        break
      case "lifetime_value":
        aValue = a.lifetimeValue
        bValue = b.lifetimeValue
        break
      case "roi":
        aValue = a.roi
        bValue = b.roi
        break
      case "risk_score":
        aValue = a.riskScore
        bValue = b.riskScore
        break
      case "last_interaction":
        aValue = new Date(a.lastInteraction).getTime()
        bValue = new Date(b.lastInteraction).getTime()
        break
      default:
        aValue = a.rfmScore.total
        bValue = b.rfmScore.total
    }

    if (sortOrder === "asc") {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  // 计算分页
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  // 重置到第一页当过滤条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, deviceFilter, poolFilter, valuationFilter, statusFilter, rfmFilter, riskFilter, roiFilter])

  // 处理全选
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedUsers(paginatedUsers.map((user) => user.id))
      } else {
        setSelectedUsers([])
      }
    },
    [paginatedUsers],
  )

  // 检查是否全选
  const isAllSelected = paginatedUsers.length > 0 && selectedUsers.length === paginatedUsers.length

  // 重置筛选器
  const resetFilters = () => {
    setDeviceFilter([])
    setPoolFilter("all")
    setValuationFilter("all")
    setStatusFilter("all")
    setSearchQuery("")
    setRfmFilter([])
    setRiskFilter([0, 100])
    setRoiFilter([-100, 1000])
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
    setShowFilters(false)
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      const refreshedUsers = generateMockUsers(devices, wechatAccounts, customerServices, trafficPools)
      setUsers(refreshedUsers)
      setLoading(false)
      toast({
        title: "✨ 刷新成功",
        description: "流量池数据已更新，发现新的用户洞察",
      })
    }, 1200)
  }

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleAddToPool = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "请选择用户",
        description: "请先选择要添加到流量池的用户",
        variant: "destructive",
      })
      return
    }

    setShowAddToPool(true)
  }

  const confirmAddToPool = () => {
    if (!selectedPool) {
      toast({
        title: "请选择流量池",
        description: "请选择要添加到的流量池",
        variant: "destructive",
      })
      return
    }

    const updatedUsers = users.map((user) => {
      if (selectedUsers.includes(user.id)) {
        if (!user.poolIds.includes(selectedPool)) {
          return {
            ...user,
            poolIds: [...user.poolIds, selectedPool],
            addStatus: "added",
          }
        }
      }
      return user
    })

    setUsers(updatedUsers)
    setShowAddToPool(false)
    setSelectedPool(null)
    setSelectedUsers([])

    const poolName = trafficPools.find((pool) => pool.id === selectedPool)?.name || "未知流量池"

    toast({
      title: "🎉 添加成功",
      description: `已将 ${selectedUsers.length} 个用户添加到 ${poolName}`,
    })
  }

  // 导出数据
  const handleExportData = () => {
    const exportData = selectedUsers.length > 0 ? users.filter((u) => selectedUsers.includes(u.id)) : filteredUsers

    const csvContent = [
      // CSV 头部
      [
        "用户昵称",
        "微信号",
        "手机号",
        "RFM评分",
        "用户分群",
        "生命周期价值",
        "ROI",
        "流失风险",
        "添加状态",
        "获客渠道",
      ].join(","),
      // CSV 数据
      ...exportData.map((user) =>
        [
          user.nickname,
          user.wechatId,
          user.phone,
          user.rfmScore.total,
          user.rfmScore.segment,
          user.lifetimeValue,
          `${user.roi}%`,
          `${user.riskScore}%`,
          user.addStatus === "added" ? "已添加" : user.addStatus === "pending" ? "待添加" : "添加失败",
          user.source,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `流量池用户数据_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "📊 导出成功",
      description: `已导出 ${exportData.length} 个用户的数据`,
    })
  }

  const getRFMSegmentInfo = (segment: string) => {
    const segmentEntry = Object.entries(RFM_SEGMENTS).find(([_, info]) => info.name === segment)
    return segmentEntry
      ? segmentEntry[1]
      : {
          name: segment,
          color: "bg-gray-100 text-gray-800",
          icon: UserCheck,
          description: "普通用户",
          strategy: "常规维护",
        }
  }

  const getWechatAccount = (accountId: string) => {
    return wechatAccounts.find((acc) => acc.id === accountId)
  }

  const getCustomerService = (csId: string) => {
    return customerServices.find((cs) => cs.id === csId)
  }

  const getDevice = (deviceId: string) => {
    return devices.find((device) => device.id === deviceId)
  }

  const getPoolNames = (poolIds: string[]) => {
    return poolIds.map((id) => trafficPools.find((pool) => pool.id === id)?.name || "未知流量池")
  }

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // 格式化日期（只显示日期）
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  // 获取互动类型图标
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "purchase":
        return <ShoppingCart className="h-4 w-4 text-green-500" />
      case "view":
        return <Eye className="h-4 w-4 text-purple-500" />
      case "click":
        return <MousePointer className="h-4 w-4 text-orange-500" />
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "share":
        return <Upload className="h-4 w-4 text-indigo-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  // 设备多选处理
  const handleDeviceFilterChange = (deviceId: string, checked: boolean) => {
    if (checked) {
      setDeviceFilter([...deviceFilter, deviceId])
    } else {
      setDeviceFilter(deviceFilter.filter((id) => id !== deviceId))
    }
  }

  // RFM分群多选处理
  const handleRfmFilterChange = (segment: string, checked: boolean) => {
    if (checked) {
      setRfmFilter([...rfmFilter, segment])
    } else {
      setRfmFilter(rfmFilter.filter((s) => s !== segment))
    }
  }

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-3 w-3 text-green-500" />
      case "down":
        return <ArrowDownRight className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  // 获取风险等级颜色
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50"
    if (score >= 60) return "text-orange-600 bg-orange-50"
    if (score >= 40) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  // 获取ROI颜色
  const getRoiColor = (roi: number) => {
    if (roi >= 200) return "text-green-600 bg-green-50"
    if (roi >= 100) return "text-blue-600 bg-blue-50"
    if (roi >= 0) return "text-gray-600 bg-gray-50"
    return "text-red-600 bg-red-50"
  }

  // 用户卡片组件
  const UserCard = ({ user }: { user: TrafficUser }) => {
    const wechatAccount = getWechatAccount(user.wechatAccountId)
    const customerService = getCustomerService(user.customerServiceId)
    const segmentInfo = getRFMSegmentInfo(user.rfmScore.segment)
    const IconComponent = segmentInfo.icon

    return (
      <Card
        className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 ${
          user.rfmScore.priority === "high"
            ? "bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 shadow-lg ring-2 ring-red-200"
            : user.rfmScore.priority === "medium"
              ? "bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 shadow-md ring-1 ring-blue-200"
              : "bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 shadow-sm"
        }`}
        onClick={() => {
          setSelectedUser(user)
          setShowUserDetail(true)
          setActiveDetailTab("info")
        }}
      >
        {/* 优先级指示器 */}
        {user.rfmScore.priority === "high" && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-red-500">
            <Crown className="absolute -top-4 -right-4 h-3 w-3 text-white" />
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* 选择框和头像 */}
            <div className="flex flex-col items-center space-y-2">
              <Checkbox
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                onClick={(e) => e.stopPropagation()}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nickname} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {user.nickname[0]}
                  </AvatarFallback>
                </Avatar>
                {/* 在线状态指示器 */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              {/* 用户基本信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 truncate">{user.nickname}</h3>
                  {user.rfmScore.priority === "high" && (
                    <Crown className="h-4 w-4 text-yellow-500" fill="currentColor" />
                  )}
                  {getTrendIcon(user.rfmScore.trend)}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        className={`text-xs font-medium ${
                          user.addStatus === "not_added"
                            ? "bg-gray-100 text-gray-700 border-gray-200"
                            : user.addStatus === "adding"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : user.addStatus === "added"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {user.addStatus === "not_added"
                          ? "未添加"
                          : user.addStatus === "adding"
                            ? "添加中"
                            : user.addStatus === "added"
                              ? "已添加"
                              : "添加失败"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>添加状态: {user.addStatus}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* 微信号 */}
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-3 w-3 text-green-500" />
                <span className="text-sm font-medium text-blue-600">{wechatAccount?.wechatId || "未知微信号"}</span>
              </div>

              {/* RFM分群标签 */}
              <div className="flex items-center space-x-2">
                <Badge className={`text-xs font-medium ${segmentInfo.color} border-0 shadow-sm`}>
                  <IconComponent className="h-3 w-3 mr-1" />
                  {user.rfmScore.segment}
                </Badge>
                <span className="text-xs text-gray-500">#{user.rfmScore.percentile}%</span>
              </div>

              {/* 关键指标 */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-center p-1 bg-white/50 rounded-md">
                        <div className="font-semibold text-blue-600">{user.rfmScore.total}/15</div>
                        <div className="text-gray-500">RFM</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        RFM总分: R{user.rfmScore.recency} F{user.rfmScore.frequency} M{user.rfmScore.monetary}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-center p-1 bg-white/50 rounded-md">
                        <div className="font-semibold text-green-600">¥{(user.lifetimeValue / 1000).toFixed(1)}k</div>
                        <div className="text-gray-500">LTV</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>生命周期价值: ¥{user.lifetimeValue.toLocaleString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={`text-center p-1 rounded-md ${getRoiColor(user.roi)}`}>
                        <div className="font-semibold">{user.roi}%</div>
                        <div className="text-gray-500">ROI</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>投资回报率: {user.roi}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* 用户标签 */}
              <div className="flex flex-wrap gap-1">
                {user.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline" className={`text-xs ${tag.color} border`}>
                    {tag.name}
                  </Badge>
                ))}
                {user.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                    +{user.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* 设备和客服信息 */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Smartphone className="h-3 w-3" />
                  <span>{getDevice(user.deviceId)?.name || "未知设备"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{customerService?.name || "未分配"}</span>
                </div>
              </div>

              {/* 流量池信息 */}
              {user.poolIds.length > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <Layers className="h-3 w-3 mr-1" />
                  <span className="truncate">{getPoolNames(user.poolIds).slice(0, 2).join(", ")}</span>
                  {user.poolIds.length > 2 && <span className="ml-1">+{user.poolIds.length - 2}</span>}
                </div>
              )}

              {/* 下一步行动建议 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  <Brain className="h-3 w-3" />
                  <span className="truncate">{user.nextBestAction}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${getRiskColor(user.riskScore)}`}>
                  风险 {user.riskScore}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 用户详情组件
  const UserDetail = ({ user }: { user: TrafficUser }) => {
    const wechatAccount = getWechatAccount(user.wechatAccountId)
    const customerService = getCustomerService(user.customerServiceId)
    const device = getDevice(user.deviceId)
    const segmentInfo = getRFMSegmentInfo(user.rfmScore.segment)
    const IconComponent = segmentInfo.icon

    return (
      <div className="space-y-6">
        {/* 用户头部信息 */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg"></div>
          <div className="relative p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nickname} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                    {user.nickname[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 p-1 bg-white rounded-full shadow-md">
                  <IconComponent className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user.nickname}</h2>
                  {user.rfmScore.priority === "high" && (
                    <Crown className="h-5 w-5 text-yellow-500" fill="currentColor" />
                  )}
                  {getTrendIcon(user.rfmScore.trend)}
                </div>
                <div className="text-lg font-medium text-blue-600 mb-2">{wechatAccount?.wechatId || "未知微信号"}</div>
                <div className="flex items-center space-x-3">
                  <Badge className={`${segmentInfo.color} border-0 shadow-sm`}>
                    <IconComponent className="h-3 w-3 mr-1" />
                    {user.rfmScore.segment}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    排名前 {user.rfmScore.percentile}%
                  </Badge>
                  {user.rfmScore.priority === "high" && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">VIP客户</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* 关键指标卡片 */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-3 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.rfmScore.total}</div>
                  <div className="text-xs text-gray-500">RFM总分</div>
                  <div className="text-xs text-gray-400">
                    R{user.rfmScore.recency} F{user.rfmScore.frequency} M{user.rfmScore.monetary}
                  </div>
                </div>
              </Card>
              <Card className="p-3 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">¥{(user.lifetimeValue / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-gray-500">生命周期价值</div>
                  <div className="text-xs text-gray-400">已消费 ¥{(user.totalSpent / 1000).toFixed(1)}k</div>
                </div>
              </Card>
              <Card className="p-3 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${user.roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {user.roi}%
                  </div>
                  <div className="text-xs text-gray-500">投资回报率</div>
                  <div className="text-xs text-gray-400">获客成本 ¥{user.acquisitionCost}</div>
                </div>
              </Card>
              <Card className="p-3 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getRiskColor(user.riskScore).split(" ")[0]}`}>
                    {user.riskScore}%
                  </div>
                  <div className="text-xs text-gray-500">流失风险</div>
                  <div className="text-xs text-gray-400">
                    {user.riskScore >= 80 ? "高风险" : user.riskScore >= 60 ? "中风险" : "低风险"}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="info" className="data-[state=active]:bg-white">
              基本信息
            </TabsTrigger>
            <TabsTrigger value="journey" className="data-[state=active]:bg-white">
              用户旅程
            </TabsTrigger>
            <TabsTrigger value="tags" className="data-[state=active]:bg-white">
              智能标签
            </TabsTrigger>
            <TabsTrigger value="strategy" className="data-[state=active]:bg-white">
              运营策略
            </TabsTrigger>
          </TabsList>

          {/* 基本信息标签页 */}
          <TabsContent value="info" className="space-y-4 mt-6">
            {/* 关联信息 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  关联信息
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <Smartphone className="h-3 w-3 mr-1" />
                        设备:
                      </span>
                      <span className="font-medium">{device?.name || "未知设备"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        微信号:
                      </span>
                      <span className="font-medium">{wechatAccount?.nickname || "未知微信"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        客服:
                      </span>
                      <span className="font-medium">{customerService?.name || "未分配"}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        添加时间:
                      </span>
                      <span className="font-medium">{formatDate(user.addTime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        最近互动:
                      </span>
                      <span className="font-medium">{formatDate(user.lastInteraction)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 flex items-center">
                        <Target className="h-3 w-3 mr-1" />
                        获客渠道:
                      </span>
                      <Badge
                        className={SCENARIOS.find((s) => s.id === user.scenario)?.color || "bg-gray-100 text-gray-800"}
                      >
                        {user.source}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RFM详细评分 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                  RFM用户价值模型
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">{segmentInfo.description}</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* RFM评分可视化 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{user.rfmScore.recency}</div>
                      <div className="text-xs font-medium text-blue-700 mb-1">最近性 (R)</div>
                      <Progress value={user.rfmScore.recency * 20} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        {user.rfmScore.recency >= 4 ? "近期活跃" : user.rfmScore.recency >= 3 ? "一般活跃" : "不够活跃"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">{user.rfmScore.frequency}</div>
                      <div className="text-xs font-medium text-green-700 mb-1">频率 (F)</div>
                      <Progress value={user.rfmScore.frequency * 20} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        {user.rfmScore.frequency >= 4
                          ? "高频互动"
                          : user.rfmScore.frequency >= 3
                            ? "中频互动"
                            : "低频互动"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{user.rfmScore.monetary}</div>
                      <div className="text-xs font-medium text-purple-700 mb-1">金额 (M)</div>
                      <Progress value={user.rfmScore.monetary * 20} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        {user.rfmScore.monetary >= 4 ? "高价值" : user.rfmScore.monetary >= 3 ? "中价值" : "低价值"}
                      </div>
                    </div>
                  </div>

                  {/* 综合评分 */}
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">{user.rfmScore.total}/15</div>
                    <div className="text-sm font-medium text-indigo-700 mb-2">RFM综合得分</div>
                    <Progress value={(user.rfmScore.total / 15) * 100} className="h-3 mb-2" />
                    <div className="text-xs text-gray-600">
                      在所有用户中排名前 {user.rfmScore.percentile}%，属于{segmentInfo.name}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 流量池信息 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <Layers className="h-4 w-4 mr-2 text-emerald-500" />
                  流量池分布
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {user.poolIds.length > 0 ? (
                  <div className="space-y-3">
                    {user.poolIds.map((poolId) => {
                      const pool = trafficPools.find((p) => p.id === poolId)
                      return (
                        <div
                          key={poolId}
                          className={`p-3 rounded-lg bg-gradient-to-r ${pool?.color || "from-gray-100 to-gray-200"} bg-opacity-20`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{pool?.icon}</span>
                              <span className="font-medium text-gray-900">{pool?.name}</span>
                            </div>
                            <Badge variant="outline" className="bg-white/80">
                              {pool?.userCount}人
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{pool?.description}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pool?.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-white/60">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Layers className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <div className="text-sm">未分配到任何流量池</div>
                    <Button size="sm" className="mt-2" onClick={() => setShowAddToPool(true)}>
                      <Plus className="h-3 w-3 mr-1" />
                      添加到流量池
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 用户旅程标签页 */}
          <TabsContent value="journey" className="space-y-4 mt-6">
            {/* 互动时间线 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-blue-500" />
                  互动时间线
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {user.interactions.map((interaction, index) => (
                      <div key={interaction.id} className="flex items-start space-x-4 relative">
                        {/* 时间线连接线 */}
                        {index < user.interactions.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                        )}

                        {/* 互动图标 */}
                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
                          {getInteractionIcon(interaction.type)}
                        </div>

                        {/* 互动内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm text-gray-900">
                                  {interaction.type === "message"
                                    ? "消息互动"
                                    : interaction.type === "purchase"
                                      ? "购买行为"
                                      : interaction.type === "view"
                                        ? "页面浏览"
                                        : interaction.type === "like"
                                          ? "点赞行为"
                                          : interaction.type === "share"
                                            ? "分享行为"
                                            : "点击行为"}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {interaction.platform}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500">{formatDateTime(interaction.timestamp)}</div>
                            </div>
                            <div className="text-sm text-gray-700 mb-2">{interaction.content}</div>
                            <div className="flex items-center justify-between">
                              {interaction.value !== undefined && (
                                <div className="text-sm font-medium text-green-600">¥{interaction.value}</div>
                              )}
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">参与度:</span>
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < Math.floor(interaction.engagement / 2) ? "bg-blue-500" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* 消费分析 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2 text-green-500" />
                  消费行为分析
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* 消费统计 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">¥{user.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">累计消费</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {user.interactions.filter((i) => i.type === "purchase").length}
                      </div>
                      <div className="text-xs text-gray-500">购买次数</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        ¥
                        {user.interactions.filter((i) => i.type === "purchase").length > 0
                          ? Math.round(user.totalSpent / user.interactions.filter((i) => i.type === "purchase").length)
                          : 0}
                      </div>
                      <div className="text-xs text-gray-500">平均客单价</div>
                    </div>
                  </div>

                  {/* 购买记录 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">购买记录</h4>
                    {user.interactions
                      .filter((i) => i.type === "purchase")
                      .slice(0, 5)
                      .map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <ShoppingCart className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="text-sm font-medium">{purchase.content}</div>
                              <div className="text-xs text-gray-500">{formatDateTime(purchase.timestamp)}</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-green-600">¥{purchase.value}</div>
                        </div>
                      ))}
                    {user.interactions.filter((i) => i.type === "purchase").length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <div className="text-sm">暂无购买记录</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 智能标签标签页 */}
          <TabsContent value="tags" className="space-y-4 mt-6">
            {/* AI生成的标签 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-indigo-500" />
                  AI智能标签
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">基于用户行为和RFM模型自动生成</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {user.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge className={`${tag.color} border`}>{tag.name}</Badge>
                        <div className="text-xs text-gray-500">
                          来源: {tag.source === "system" ? "系统生成" : tag.source === "auto" ? "自动标记" : "手动添加"}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-gray-500">置信度:</div>
                        <div className="flex items-center space-x-1">
                          <Progress value={tag.confidence * 100} className="w-16 h-2" />
                          <span className="text-xs font-medium">{Math.round(tag.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* RFM标签详解 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <Target className="h-4 w-4 mr-2 text-purple-500" />
                  RFM价值标签
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-gray-700" />
                        <span className="font-medium text-gray-900">{user.rfmScore.segment}</span>
                      </div>
                      <Badge className="bg-white text-gray-700 border border-gray-200">
                        {user.rfmScore.priority === "high"
                          ? "高优先级"
                          : user.rfmScore.priority === "medium"
                            ? "中优先级"
                            : "低优先级"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{segmentInfo.description}</div>
                    <div className="text-xs text-gray-500">
                      <strong>推荐策略:</strong> {segmentInfo.strategy}
                    </div>
                  </div>

                  {/* RFM维度解析 */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium text-blue-900">最近性 (Recency)</div>
                        <div className="text-xs text-blue-700">
                          {user.rfmScore.recency >= 4
                            ? "近期高度活跃"
                            : user.rfmScore.recency >= 3
                              ? "活跃度一般"
                              : "长期未活跃"}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{user.rfmScore.recency}/5</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-green-900">频率 (Frequency)</div>
                        <div className="text-xs text-green-700">
                          {user.rfmScore.frequency >= 4
                            ? "高频次互动"
                            : user.rfmScore.frequency >= 3
                              ? "中频次互动"
                              : "低频次互动"}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{user.rfmScore.frequency}/5</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-medium text-purple-900">金额 (Monetary)</div>
                        <div className="text-xs text-purple-700">
                          {user.rfmScore.monetary >= 4
                            ? "高价值贡献"
                            : user.rfmScore.monetary >= 3
                              ? "中等价值贡献"
                              : "低价值贡献"}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{user.rfmScore.monetary}/5</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 添加标签 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-4">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Tag className="h-4 w-4 mr-2" />
                  添加自定义标签
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 运营策略标签页 */}
          <TabsContent value="strategy" className="space-y-4 mt-6">
            {/* 下一步最佳行动 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-emerald-500" />
                  AI推荐行动
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-5 w-5" />
                    <span className="font-medium">智能推荐</span>
                  </div>
                  <div className="text-lg font-semibold mb-1">{user.nextBestAction}</div>
                  <div className="text-sm opacity-90">基于用户行为模式和RFM分析生成</div>
                </div>

                {/* 策略建议 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-900">详细策略建议</h4>
                  <div className="space-y-2">
                    {segmentInfo.strategy.split("、").map((strategy, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 风险评估 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                  流失风险评估
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">流失风险评分</span>
                    <span className={`text-lg font-bold ${getRiskColor(user.riskScore).split(" ")[0]}`}>
                      {user.riskScore}%
                    </span>
                  </div>
                  <Progress value={user.riskScore} className="h-3" />
                  <div className="text-xs text-gray-500">
                    {user.riskScore >= 80
                      ? "⚠️ 高风险：建议立即采取挽回措施"
                      : user.riskScore >= 60
                        ? "⚡ 中风险：需要加强关注和互动"
                        : "✅ 低风险：保持现有运营策略"}
                  </div>

                  {/* 风险因素分析 */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-xs text-gray-700">主要风险因素</h5>
                    <div className="space-y-1">
                      {user.rfmScore.recency <= 2 && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">• 长期未活跃，最近互动频率低</div>
                      )}
                      {user.rfmScore.frequency <= 2 && (
                        <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                          • 互动频率偏低，参与度不足
                        </div>
                      )}
                      {user.conversionRate < 20 && (
                        <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                          • 转化率较低，需要优化转化路径
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 价值提升建议 */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                  价值提升路径
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {user.rfmScore.priority === "high" ? (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="font-medium text-green-800 mb-1">🎯 VIP客户维护</div>
                      <div className="text-sm text-green-700">继续提供优质服务，关注个性化需求，推荐高端产品</div>
                    </div>
                  ) : user.rfmScore.priority === "medium" ? (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <div className="font-medium text-blue-800 mb-1">📈 价值提升机会</div>
                      <div className="text-sm text-blue-700">通过个性化推荐和优惠活动，提升用户参与度和消费频次</div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="font-medium text-purple-800 mb-1">🚀 潜力激活</div>
                      <div className="text-sm text-purple-700">通过教育内容和引导活动，激发用户兴趣，培养消费习惯</div>
                    </div>
                  )}

                  {/* 具体行动项 */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-xs text-gray-700">建议行动项</h5>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" size="sm" className="justify-start">
                        <Mail className="h-3 w-3 mr-2" />
                        发送个性化消息
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Target className="h-3 w-3 mr-2" />
                        推荐相关产品
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Calendar className="h-3 w-3 mr-2" />
                        邀请参加活动
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // 管理面板组件
  const ManagementPanel = () => (
    <div className="space-y-6">
      <Tabs value={managementActiveTab} onValueChange={setManagementActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="pools" className="data-[state=active]:bg-white">
            <Layers className="h-4 w-4 mr-2" />
            流量池管理
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            数据洞察
          </TabsTrigger>
        </TabsList>

        {/* 流量池管理标签页 */}
        <TabsContent value="pools" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">流量池概览</h3>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="h-3 w-3 mr-1" />
              新建流量池
            </Button>
          </div>

          {/* 流量池列表 */}
          <div className="grid grid-cols-1 gap-3">
            {trafficPools.map((pool) => (
              <Card
                key={pool.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${pool.color}`}></div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{pool.icon}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{pool.name}</div>
                        <div className="text-xs text-gray-500">{pool.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{pool.userCount}</div>
                      <div className="text-xs text-gray-500">用户</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {pool.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>创建于 {formatDate(pool.createdAt)}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 数据洞察标签页 */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          {/* 核心指标 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.total.toLocaleString()}</div>
                  <div className="text-sm text-blue-700">总用户数</div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">¥{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-green-700">总收入</div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </Card>
          </div>

          {/* 用户价值分布 */}
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-3">
              <CardTitle className="text-base">用户价值分布</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                    <span className="text-sm">高价值客户</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{stats.highValue}</span>
                    <span className="text-xs text-gray-500">
                      ({Math.round((stats.highValue / stats.total) * 100)}%)
                    </span>
                  </div>
                </div>
                <Progress value={(stats.highValue / stats.total) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    <span className="text-sm">中价值客户</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{stats.mediumValue}</span>
                    <span className="text-xs text-gray-500">
                      ({Math.round((stats.mediumValue / stats.total) * 100)}%)
                    </span>
                  </div>
                </div>
                <Progress value={(stats.mediumValue / stats.total) * 100} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                    <span className="text-sm">低价值客户</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{stats.lowValue}</span>
                    <span className="text-xs text-gray-500">({Math.round((stats.lowValue / stats.total) * 100)}%)</span>
                  </div>
                </div>
                <Progress value={(stats.lowValue / stats.total) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* 运营效率 */}
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-3">
              <CardTitle className="text-base">运营效率指标</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    {Math.round((stats.added / (stats.added + stats.pending)) * 100)}%
                  </div>
                  <div className="text-xs text-green-700">添加成功率</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">¥{stats.avgSpent.toLocaleString()}</div>
                  <div className="text-xs text-blue-700">平均消费</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">{stats.avgRoi}%</div>
                  <div className="text-xs text-purple-700">平均ROI</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">
                    {Math.round((stats.duplicates / stats.total) * 100)}%
                  </div>
                  <div className="text-xs text-orange-700">重复率</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RFM分群分析 */}
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
              <CardTitle className="text-base">RFM分群分析</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {Object.entries(RFM_SEGMENTS).map(([key, segment]) => {
                  const count = users.filter((u) => u.rfmScore.segment === segment.name).length
                  const percentage = Math.round((count / users.length) * 100)
                  const IconComponent = segment.icon

                  return (
                    <div key={key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">{segment.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{count}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  // 高级筛选面板
  const AdvancedFilters = () => (
    <div className="space-y-6">
      {/* 设备多选 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">设备选择（多选）</Label>
        <ScrollArea className="h-32 border rounded-md p-3">
          <div className="space-y-2">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`device-${device.id}`}
                  checked={deviceFilter.includes(device.id)}
                  onCheckedChange={(checked) => handleDeviceFilterChange(device.id, checked as boolean)}
                />
                <label htmlFor={`device-${device.id}`} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      device.status === "online"
                        ? "bg-green-500"
                        : device.status === "busy"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  />
                  <span>{device.name}</span>
                  <span className="text-xs text-gray-500">({device.todayAdded})</span>
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* RFM分群筛选 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">RFM用户分群</Label>
        <ScrollArea className="h-40 border rounded-md p-3">
          <div className="space-y-2">
            {Object.entries(RFM_SEGMENTS).map(([key, segment]) => {
              const IconComponent = segment.icon
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rfm-${key}`}
                    checked={rfmFilter.includes(segment.name)}
                    onCheckedChange={(checked) => handleRfmFilterChange(segment.name, checked as boolean)}
                  />
                  <label htmlFor={`rfm-${key}`} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <IconComponent className="h-3 w-3 text-gray-600" />
                    <span>{segment.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {users.filter((u) => u.rfmScore.segment === segment.name).length}
                    </Badge>
                  </label>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* 风险评分范围 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">流失风险评分</Label>
        <div className="px-3">
          <Slider value={riskFilter} onValueChange={setRiskFilter} max={100} min={0} step={5} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{riskFilter[0]}%</span>
            <span>{riskFilter[1]}%</span>
          </div>
        </div>
      </div>

      {/* ROI范围 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">投资回报率 (ROI)</Label>
        <div className="px-3">
          <Slider value={roiFilter} onValueChange={setRoiFilter} max={1000} min={-100} step={10} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{roiFilter[0]}%</span>
            <span>{roiFilter[1]}%</span>
          </div>
        </div>
      </div>

      {/* 其他筛选器 */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">流量池</Label>
          <Select value={poolFilter} onValueChange={setPoolFilter}>
            <SelectTrigger>
              <SelectValue placeholder="选择流量池" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部流量池</SelectItem>
              <SelectItem value="none">未分配</SelectItem>
              {trafficPools.map((pool) => (
                <SelectItem key={pool.id} value={pool.id}>
                  <div className="flex items-center space-x-2">
                    <span>{pool.icon}</span>
                    <span>{pool.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">用户价值</Label>
          <Select value={valuationFilter} onValueChange={setValuationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="用户价值" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部价值</SelectItem>
              <SelectItem value="high">
                <div className="flex items-center">
                  <Crown className="h-4 w-4 mr-2 text-red-500" />
                  <span>高价值客户</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <span>中价值客户</span>
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span>低价值客户</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">添加状态</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="添加状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待添加</SelectItem>
              <SelectItem value="added">已添加</SelectItem>
              <SelectItem value="failed">添加失败</SelectItem>
              <SelectItem value="duplicate">重复用户</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={resetFilters} className="flex-1 mr-2">
          <X className="h-4 w-4 mr-2" />
          重置筛选
        </Button>
        <Button onClick={() => setShowFilters(false)} className="flex-1 ml-2">
          应用筛选
        </Button>
      </div>
    </div>
  )

  // 移动版布局
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">流量池管理</h1>
                <p className="text-xs text-gray-500">智能用户价值分析</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setShowManagementPanel(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setShowFilters(true)}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索用户昵称、微信号、标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/80 backdrop-blur-sm border-gray-200/50"
                ref={searchInputRef}
              />
            </div>
          </div>
        </header>

        {/* 管理面板抽屉 */}
        <Sheet open={showManagementPanel} onOpenChange={setShowManagementPanel}>
          <SheetContent side="right" className="w-[90%] sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                流量池管理中心
              </SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <ManagementPanel />
            </div>
          </SheetContent>
        </Sheet>

        {/* 高级筛选抽屉 */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="right" className="w-[90%] sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-blue-500" />
                高级筛选
              </SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <AdvancedFilters />
            </div>
          </SheetContent>
        </Sheet>

        {/* 用户列表 */}
        <div className="flex-1 overflow-auto">
          {/* 筛选器标签 */}
          {(deviceFilter.length > 0 ||
            poolFilter !== "all" ||
            valuationFilter !== "all" ||
            statusFilter !== "all" ||
            rfmFilter.length > 0 ||
            searchQuery) && (
            <div className="p-4 pb-2">
              <ScrollArea className="w-full">
                <div className="flex space-x-2 pb-2">
                  {deviceFilter.length > 0 && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-white/80 backdrop-blur-sm cursor-pointer"
                      onClick={() => setDeviceFilter([])}
                    >
                      设备: {deviceFilter.length}个
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {poolFilter !== "all" && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-white/80 backdrop-blur-sm cursor-pointer"
                      onClick={() => setPoolFilter("all")}
                    >
                      流量池: {poolFilter === "none" ? "未分配" : trafficPools.find((p) => p.id === poolFilter)?.name}
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {rfmFilter.length > 0 && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-white/80 backdrop-blur-sm cursor-pointer"
                      onClick={() => setRfmFilter([])}
                    >
                      RFM: {rfmFilter.length}个分群
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-white/80 backdrop-blur-sm cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    >
                      搜索: {searchQuery}
                      <X className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* 批量操作栏 */}
          {selectedUsers.length > 0 && (
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 p-4 mx-4 mb-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} id="select-all-mobile" />
                  <label htmlFor="select-all-mobile" className="text-sm font-medium">
                    已选择 {selectedUsers.length} 个用户
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                    取消选择
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddToPool}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Layers className="h-4 w-4 mr-1" />
                    添加到流量池
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 统计信息卡片 */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredUsers.length.toLocaleString()}</div>
                  <div className="text-xs opacity-90">总用户数</div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-500 to-pink-500 text-white border-0 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.highValue}</div>
                  <div className="text-xs opacity-90">高价值用户</div>
                </div>
              </Card>
            </div>

            {/* 排序和视图控制 */}
            <div className="flex items-center justify-between">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rfm_score">RFM评分</SelectItem>
                  <SelectItem value="lifetime_value">生命周期价值</SelectItem>
                  <SelectItem value="roi">投资回报率</SelectItem>
                  <SelectItem value="risk_score">流失风险</SelectItem>
                  <SelectItem value="last_interaction">最近互动</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  {sortOrder === "asc" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportData} className="bg-white/80 backdrop-blur-sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 用户列表 */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-purple-500 animate-pulse" />
                </div>
                <div className="text-gray-600 mt-4 text-center">
                  <div className="font-medium">AI正在分析用户数据</div>
                  <div className="text-sm text-gray-500">请稍候...</div>
                </div>
              </div>
            ) : paginatedUsers.length === 0 ? (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <div className="text-gray-500 mb-4">未找到匹配的用户</div>
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新数据
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}

                {/* 分页 */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="bg-white/80 backdrop-blur-sm"
                    >
                      上一页
                    </Button>
                    <span className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      第 {currentPage} / {totalPages} 页
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage >= totalPages}
                      className="bg-white/80 backdrop-blur-sm"
                    >
                      下一页
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 用户详情弹窗 */}
        <Sheet open={showUserDetail} onOpenChange={setShowUserDetail}>
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-500" />
                用户详情
              </SheetTitle>
            </SheetHeader>
            <div className="py-6">{selectedUser && <UserDetail user={selectedUser} />}</div>
          </SheetContent>
        </Sheet>

        {/* 添加到流量池弹窗 */}
        <Sheet open={showAddToPool} onOpenChange={setShowAddToPool}>
          <SheetContent side="bottom" className="h-[80%]">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-blue-500" />
                添加到流量池
              </SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <div className="text-sm text-gray-600">
                已选择 {selectedUsers.length} 个用户，请选择要添加到的流量池：
              </div>
              <div className="space-y-3">
                {trafficPools.map((pool) => (
                  <Card
                    key={pool.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPool === pool.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedPool(pool.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{pool.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{pool.name}</div>
                          <div className="text-sm text-gray-500">{pool.description}</div>
                          <div className="text-xs text-gray-400 mt-1">当前用户数: {pool.userCount}</div>
                        </div>
                        {selectedPool === pool.id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddToPool(false)
                    setSelectedPool(null)
                  }}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={confirmAddToPool}
                  disabled={!selectedPool}
                >
                  确认添加
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  // 桌面版布局
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">流量池管理</h1>
                <p className="text-sm text-gray-500">智能用户价值分析与精准运营</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                导出数据
              </Button>
              <Button variant="outline" onClick={() => setShowManagementPanel(true)}>
                <Settings className="h-4 w-4 mr-2" />
                管理中心
              </Button>
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                刷新数据
              </Button>
            </div>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索用户昵称、微信号、手机号、标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/80 backdrop-blur-sm border-gray-200/50"
                ref={searchInputRef}
              />
            </div>
            <Select value={poolFilter} onValueChange={setPoolFilter}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="选择流量池" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部流量池</SelectItem>
                <SelectItem value="none">未分配</SelectItem>
                {trafficPools.map((pool) => (
                  <SelectItem key={pool.id} value={pool.id}>
                    <div className="flex items-center space-x-2">
                      <span>{pool.icon}</span>
                      <span>{pool.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={valuationFilter} onValueChange={setValuationFilter}>
              <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="用户价值" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部价值</SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center">
                    <Crown className="h-4 w-4 mr-2 text-red-500" />
                    <span>高价值</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    <span>中价值</span>
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>低价值</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              高级筛选
            </Button>
          </div>
        </header>

        {/* 统计信息栏 */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
          <div className="grid grid-cols-6 gap-6">
            <Card className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{filteredUsers.length.toLocaleString()}</div>
                  <div className="text-xs opacity-90">总用户数</div>
                </div>
                <Users className="h-8 w-8 opacity-80" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-500 to-pink-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.highValue}</div>
                  <div className="text-xs opacity-90">高价值用户</div>
                </div>
                <Crown className="h-8 w-8 opacity-80" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">¥{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
                  <div className="text-xs opacity-90">总收入</div>
                </div>
                <DollarSign className="h-8 w-8 opacity-80" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.avgRoi}%</div>
                  <div className="text-xs opacity-90">平均ROI</div>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round((stats.added / (stats.added + stats.pending)) * 100)}%
                  </div>
                  <div className="text-xs opacity-90">添加成功率</div>
                </div>
                <Target className="h-8 w-8 opacity-80" />
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.duplicates}</div>
                  <div className="text-xs opacity-90">重复用户</div>
                </div>
                <AlertTriangle className="h-8 w-8 opacity-80" />
              </div>
            </Card>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧用户列表 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 筛选器标签和操作栏 */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* 筛选器标签 */}
                  <div className="flex items-center space-x-2">
                    {deviceFilter.length > 0 && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-white/80 backdrop-blur-sm cursor-pointer"
                        onClick={() => setDeviceFilter([])}
                      >
                        设备: {deviceFilter.length}个
                        <X className="h-3 w-3" />
                      </Badge>
                    )}
                    {rfmFilter.length > 0 && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-white/80 backdrop-blur-sm cursor-pointer"
                        onClick={() => setRfmFilter([])}
                      >
                        RFM: {rfmFilter.length}个分群
                        <X className="h-3 w-3" />
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-white/80 backdrop-blur-sm cursor-pointer"
                        onClick={() => setSearchQuery("")}
                      >
                        搜索: {searchQuery}
                        <X className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>

                  {/* 排序控制 */}
                  <div className="flex items-center space-x-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rfm_score">RFM评分</SelectItem>
                        <SelectItem value="lifetime_value">生命周期价值</SelectItem>
                        <SelectItem value="roi">投资回报率</SelectItem>
                        <SelectItem value="risk_score">流失风险</SelectItem>
                        <SelectItem value="last_interaction">最近互动</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="bg-white/80 backdrop-blur-sm"
                    >
                      {sortOrder === "asc" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* 批量操作 */}
                {selectedUsers.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} id="select-all-desktop" />
                      <label htmlFor="select-all-desktop" className="text-sm font-medium">
                        已选择 {selectedUsers.length} 个用户
                      </label>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                      取消选择
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddToPool}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Layers className="h-4 w-4 mr-1" />
                      添加到流量池
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 用户列表内容 */}
            <div className="flex-1 overflow-auto p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative">
                    <RefreshCw className="h-12 w-12 text-blue-500 animate-spin" />
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-purple-500 animate-pulse" />
                  </div>
                  <div className="text-gray-600 mt-6 text-center">
                    <div className="text-lg font-medium">AI正在分析用户数据</div>
                    <div className="text-sm text-gray-500 mt-1">正在生成智能洞察和推荐策略...</div>
                  </div>
                </div>
              ) : paginatedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full bg-white/80 backdrop-blur-sm rounded-lg">
                  <Users className="h-16 w-16 mx-auto mb-6 text-gray-300" />
                  <div className="text-xl font-medium text-gray-500 mb-2">未找到匹配的用户</div>
                  <div className="text-sm text-gray-400 mb-6">尝试调整筛选条件或刷新数据</div>
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    刷新数据
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 用户卡片网格 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {paginatedUsers.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>

                  {/* 分页控制 */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6">
                      <div className="text-sm text-gray-500">
                        显示第 {(currentPage - 1) * usersPerPage + 1} -{" "}
                        {Math.min(currentPage * usersPerPage, filteredUsers.length)} 条，共 {filteredUsers.length}{" "}
                        条记录
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className="bg-white/80 backdrop-blur-sm"
                        >
                          首页
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="bg-white/80 backdrop-blur-sm"
                        >
                          上一页
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className={
                                  currentPage === pageNum
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-white/80 backdrop-blur-sm"
                                }
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage >= totalPages}
                          className="bg-white/80 backdrop-blur-sm"
                        >
                          下一页
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="bg-white/80 backdrop-blur-sm"
                        >
                          末页
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 右侧高级筛选面板 */}
          {showFilters && (
            <div className="w-80 bg-white/95 backdrop-blur-sm border-l border-gray-200/50 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">高级筛选</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <AdvancedFilters />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 用户详情弹窗 */}
      <Sheet open={showUserDetail} onOpenChange={setShowUserDetail}>
        <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-500" />
              用户详情分析
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">{selectedUser && <UserDetail user={selectedUser} />}</div>
        </SheetContent>
      </Sheet>

      {/* 管理面板弹窗 */}
      <Sheet open={showManagementPanel} onOpenChange={setShowManagementPanel}>
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
              流量池管理中心
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <ManagementPanel />
          </div>
        </SheetContent>
      </Sheet>

      {/* 添加到流量池弹窗 */}
      <Sheet open={showAddToPool} onOpenChange={setShowAddToPool}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Layers className="h-5 w-5 mr-2 text-blue-500" />
              添加到流量池
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">批量操作确认</span>
              </div>
              <div className="text-sm text-blue-700">
                已选择 <span className="font-semibold">{selectedUsers.length}</span> 个用户，请选择要添加到的流量池：
              </div>
            </div>

            <div className="space-y-3">
              {trafficPools.map((pool) => (
                <Card
                  key={pool.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedPool === pool.id
                      ? "ring-2 ring-blue-500 bg-blue-50 shadow-md"
                      : "hover:shadow-md hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{pool.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{pool.name}</div>
                        <div className="text-sm text-gray-600 mb-2">{pool.description}</div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>当前用户数: {pool.userCount}</span>
                          <span>创建于: {formatDate(pool.createdAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pool.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedPool === pool.id && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowAddToPool(false)
                  setSelectedPool(null)
                }}
              >
                取消操作
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={confirmAddToPool}
                disabled={!selectedPool}
              >
                <Layers className="h-4 w-4 mr-2" />
                确认添加
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
