"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  Search,
  RefreshCw,
  Users,
  Star,
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
  ChevronDown,
  ChevronUp,
  BarChart3,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

// 保持原有的接口定义...
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

interface CustomerService {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "busy"
  assignedUsers: number
}

interface TrafficPool {
  id: string
  name: string
  description: string
  userCount: number
  tags: string[]
  createdAt: string
}

interface RFMScore {
  recency: number
  frequency: number
  monetary: number
  total: number
  segment: string
  priority: "high" | "medium" | "low"
}

interface UserTag {
  id: string
  name: string
  color: string
  source: string
}

interface UserInteraction {
  id: string
  type: "message" | "purchase" | "view" | "click"
  content: string
  timestamp: string
  value?: number
}

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
  scenario: string
  deviceId: string
  wechatAccountId: string
  customerServiceId: string
  poolIds: string[]
  tags: UserTag[]
  rfmScore: RFMScore
  lastInteraction: string
  totalSpent: number
  interactionCount: number
  conversionRate: number
  isDuplicate: boolean
  mergedAccounts: string[]
  addStatus: "not_added" | "adding" | "added" | "failed"
  interactions: UserInteraction[]
}

// 保持原有的模拟数据生成函数...
const SCENARIOS = [
  { id: "poster", name: "海报获客", icon: "🎨" },
  { id: "phone", name: "电话获客", icon: "📞" },
  { id: "douyin", name: "抖音获客", icon: "🎵" },
  { id: "xiaohongshu", name: "小红书获客", icon: "📖" },
  { id: "weixinqun", name: "微信群获客", icon: "👥" },
  { id: "api", name: "API获客", icon: "🔗" },
  { id: "order", name: "订单获客", icon: "📦" },
  { id: "payment", name: "付款码获客", icon: "💳" },
]

const RFM_SEGMENTS = {
  "555": {
    name: "重要价值客户",
    color: "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0",
    icon: "👑",
    priority: "high",
  },
  "554": {
    name: "重要保持客户",
    color: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0",
    icon: "💎",
    priority: "high",
  },
  "544": {
    name: "重要发展客户",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0",
    icon: "🚀",
    priority: "high",
  },
  "455": {
    name: "重要挽留客户",
    color: "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0",
    icon: "⚠️",
    priority: "medium",
  },
  "444": {
    name: "一般价值客户",
    color: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
    icon: "👤",
    priority: "medium",
  },
  "333": {
    name: "一般保持客户",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0",
    icon: "📈",
    priority: "medium",
  },
  "222": {
    name: "新用户",
    color: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0",
    icon: "🌟",
    priority: "low",
  },
  "111": {
    name: "流失预警客户",
    color: "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0",
    icon: "😴",
    priority: "low",
  },
}

// 生成模拟数据的函数保持不变...
const generateMockDevices = (): Device[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `device-${i + 1}`,
    name: `设备${i + 1}`,
    status: ["online", "offline", "busy"][Math.floor(Math.random() * 3)] as "online" | "offline" | "busy",
    battery: Math.floor(Math.random() * 100),
    location: ["北京", "上海", "广州", "深圳"][Math.floor(Math.random() * 4)],
    wechatAccounts: Math.floor(Math.random() * 5) + 1,
    dailyAddLimit: Math.random() > 0.5 ? 20 : 10,
    todayAdded: Math.floor(Math.random() * 15),
  }))
}

const generateMockWechatAccounts = (devices: Device[]): WechatAccount[] => {
  const accounts: WechatAccount[] = []
  devices.forEach((device) => {
    for (let i = 0; i < device.wechatAccounts; i++) {
      accounts.push({
        id: `wx-${device.id}-${i + 1}`,
        nickname: `微信${device.id.split("-")[1]}-${i + 1}`,
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

const generateMockCustomerServices = (): CustomerService[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `cs-${i + 1}`,
    name: `客服${i + 1}`,
    avatar: `/placeholder.svg?height=40&width=40&query=cs${i}`,
    status: ["online", "offline", "busy"][Math.floor(Math.random() * 3)] as "online" | "offline" | "busy",
    assignedUsers: Math.floor(Math.random() * 100) + 50,
  }))
}

const generateMockTrafficPools = (): TrafficPool[] => {
  return [
    {
      id: "pool-1",
      name: "高价值客户池",
      description: "包含所有高价值客户，优先添加",
      userCount: 156,
      tags: ["高价值", "优先添加", "重要客户"],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pool-2",
      name: "潜在客户池",
      description: "潜在客户，需要培育",
      userCount: 287,
      tags: ["潜在客户", "待培育", "中等价值"],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pool-3",
      name: "活跃用户池",
      description: "近期活跃度高的用户",
      userCount: 124,
      tags: ["活跃用户", "高互动", "高频次"],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pool-4",
      name: "流失预警池",
      description: "有流失风险的用户",
      userCount: 68,
      tags: ["流失预警", "挽回", "低活跃度"],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "pool-5",
      name: "新用户池",
      description: "最近30天新增用户",
      userCount: 93,
      tags: ["新用户", "引导", "培育"],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

// 其他生成函数保持不变...
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
  }
}

const generateMockInteractions = (): UserInteraction[] => {
  const interactions: UserInteraction[] = []
  const interactionCount = Math.floor(Math.random() * 10) + 5

  for (let i = 0; i < interactionCount; i++) {
    const type = ["message", "purchase", "view", "click"][Math.floor(Math.random() * 4)] as
      | "message"
      | "purchase"
      | "view"
      | "click"

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    let content = ""
    let value: number | undefined = undefined

    switch (type) {
      case "message":
        content = ["您好，请问有什么可以帮到您？", "产品有什么优惠活动吗？", "��谢，我考虑一下"][
          Math.floor(Math.random() * 3)
        ]
        break
      case "purchase":
        content = ["购买了产品A", "购买了服务B", "订阅了会员计划"][Math.floor(Math.random() * 3)]
        value = Math.floor(Math.random() * 1000) + 100
        break
      case "view":
        content = ["浏览了产品页面", "查看了促销活动", "访问了会员中心"][Math.floor(Math.random() * 3)]
        break
      case "click":
        content = ["点击了广告链接", "点击了推荐产品", "点击了优惠券"][Math.floor(Math.random() * 3)]
        break
    }

    interactions.push({
      id: `interaction-${i}`,
      type,
      content,
      timestamp: date.toISOString(),
      value,
    })
  }

  return interactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const generateUserTags = (rfmScore: RFMScore): UserTag[] => {
  const tags: UserTag[] = []

  if (rfmScore.recency >= 4) {
    tags.push({
      id: `tag-recency-${rfmScore.recency}`,
      name: "近期活跃",
      color: "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-0",
      source: "system",
    })
  } else if (rfmScore.recency <= 2) {
    tags.push({
      id: `tag-recency-${rfmScore.recency}`,
      name: "长期未活跃",
      color: "bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0",
      source: "system",
    })
  }

  if (rfmScore.frequency >= 4) {
    tags.push({
      id: `tag-frequency-${rfmScore.frequency}`,
      name: "高频互动",
      color: "bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0",
      source: "system",
    })
  }

  if (rfmScore.monetary >= 4) {
    tags.push({
      id: `tag-monetary-${rfmScore.monetary}`,
      name: "高消费",
      color: "bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0",
      source: "system",
    })
  }

  const otherTags = [
    { name: "潜在客户", color: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-0" },
    { name: "已成交", color: "bg-gradient-to-r from-green-400 to-green-500 text-white border-0" },
    { name: "需跟进", color: "bg-gradient-to-r from-orange-400 to-red-400 text-white border-0" },
    { name: "VIP客户", color: "bg-gradient-to-r from-rose-400 to-pink-500 text-white border-0" },
    { name: "企业客户", color: "bg-gradient-to-r from-indigo-400 to-blue-500 text-white border-0" },
    { name: "个人客户", color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0" },
    { name: "新客户", color: "bg-gradient-to-r from-cyan-400 to-teal-500 text-white border-0" },
    { name: "老客户", color: "bg-gradient-to-r from-violet-400 to-purple-500 text-white border-0" },
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
    })
  })

  return tags
}

const generateMockUsers = (
  devices: Device[],
  wechatAccounts: WechatAccount[],
  customerServices: CustomerService[],
  trafficPools: TrafficPool[],
): TrafficUser[] => {
  return Array.from({ length: 500 }, (_, i) => {
    const device = devices[Math.floor(Math.random() * devices.length)]
    const wechatAccount = wechatAccounts.filter((acc) => acc.deviceId === device.id)[0] || wechatAccounts[0]
    const customerService = customerServices[Math.floor(Math.random() * customerServices.length)]
    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
    const rfmScore = generateRFMScore()
    const isDuplicate = Math.random() < 0.15

    const poolCount = Math.floor(Math.random() * 3)
    const poolIds =
      poolCount === 0
        ? []
        : Array.from({ length: poolCount }, () => trafficPools[Math.floor(Math.random() * trafficPools.length)].id)

    if (rfmScore.priority === "high" && !poolIds.includes("pool-1")) {
      if (Math.random() > 0.5) {
        poolIds.push("pool-1")
      }
    }

    const addTime = new Date()
    addTime.setDate(addTime.getDate() - Math.floor(Math.random() * 30))

    const lastInteraction = new Date()
    lastInteraction.setDate(lastInteraction.getDate() - Math.floor(Math.random() * 7))

    const tags = generateUserTags(rfmScore)
    const interactions = generateMockInteractions()

    return {
      id: `user-${i + 1}`,
      avatar: `/placeholder.svg?height=40&width=40&query=avatar${i % 10}`,
      nickname: `用户${i + 1}`,
      wechatId: `wxid_${Math.random().toString(36).substr(2, 8)}`,
      phone: `1${Math.floor(Math.random() * 9 + 1)}${Math.random().toString().slice(2, 11)}`,
      region: device.location,
      note: Math.random() > 0.7 ? `这是用户${i + 1}的备注信息` : "",
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
      totalSpent: Math.floor(Math.random() * 10000),
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
  const { toast } = useToast()

  // 基础数据状态
  const [users, setUsers] = useState<TrafficUser[]>(mockUsers)
  const [devices] = useState<Device[]>(mockDevices)
  const [wechatAccounts] = useState<WechatAccount[]>(mockWechatAccounts)
  const [customerServices] = useState<CustomerService[]>(mockCustomerServices)
  const [trafficPools] = useState<TrafficPool[]>(mockTrafficPools)

  // UI状态
  const [loading, setLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [showAddToPool, setShowAddToPool] = useState(false)
  const [selectedUser, setSelectedUser] = useState<TrafficUser | null>(null)
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState("info")

  // 筛选状态
  const [deviceFilter, setDeviceFilter] = useState("all")
  const [poolFilter, setPoolFilter] = useState("all")
  const [valuationFilter, setValuationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  // 数据分析展开状态
  const [showAnalytics, setShowAnalytics] = useState(false)

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
    failed: users.filter((u) => u.status === "failed").length,
    avgSpent: Math.round(users.reduce((sum, u) => sum + u.totalSpent, 0) / users.length),
    addSuccessRate: Math.round((users.filter((u) => u.status === "added").length / users.length) * 100),
    duplicateRate: Math.round((users.filter((u) => u.isDuplicate).length / users.length) * 100),
  }

  // 过滤用户
  const filteredUsers = useCallback(() => {
    return users.filter((user) => {
      const matchesSearch =
        !debouncedSearchQuery ||
        user.nickname.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        user.wechatId.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        user.phone.includes(debouncedSearchQuery)

      const matchesDevice = deviceFilter === "all" || user.deviceId === deviceFilter
      const matchesValuation = valuationFilter === "all" || user.rfmScore.priority === valuationFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      const matchesPool =
        poolFilter === "all" || (poolFilter === "none" ? user.poolIds.length === 0 : user.poolIds.includes(poolFilter))

      return matchesSearch && matchesDevice && matchesValuation && matchesStatus && matchesPool
    })
  }, [users, debouncedSearchQuery, deviceFilter, valuationFilter, statusFilter, poolFilter])()

  // 按优先级排序
  const sortedUsers = filteredUsers.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.rfmScore.priority] - priorityOrder[a.rfmScore.priority]
  })

  // 计算分页
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  // 重置到第一页当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, deviceFilter, valuationFilter, statusFilter, poolFilter])

  // 处理用户选择
  const handleUserSelect = useCallback((userId: string, checked: boolean) => {
    setSelectedUsers((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)))
  }, [])

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

  // 重置筛选器
  const resetFilters = useCallback(() => {
    setDeviceFilter("all")
    setPoolFilter("all")
    setValuationFilter("all")
    setStatusFilter("all")
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
    setShowFilters(false)
  }, [])

  // 刷新数据
  const handleRefresh = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      const refreshedUsers = generateMockUsers(devices, wechatAccounts, customerServices, trafficPools)
      setUsers(refreshedUsers)
      setLoading(false)
      toast({
        title: "刷新成功",
        description: "流量池数据已更新",
      })
    }, 800)
  }, [devices, wechatAccounts, customerServices, trafficPools, toast])

  // 添加到流量池
  const handleAddToPool = useCallback(() => {
    if (selectedUsers.length === 0) {
      toast({
        title: "请选择用户",
        description: "请先选择要添加到流量池的用户",
        variant: "destructive",
      })
      return
    }
    setShowAddToPool(true)
  }, [selectedUsers.length, toast])

  // 确认添加到流量池
  const confirmAddToPool = useCallback(() => {
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
            addStatus: "added" as const,
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
      title: "添加成功",
      description: `已将 ${selectedUsers.length} 个用户添加到 ${poolName}`,
    })
  }, [selectedPool, selectedUsers, users, trafficPools, toast])

  // 获取辅助函数
  const getRFMSegmentInfo = (segment: string) => {
    const segmentEntry = Object.entries(RFM_SEGMENTS).find(([_, info]) => info.name === segment)
    return segmentEntry ? segmentEntry[1] : { name: segment, color: "bg-gray-100 text-gray-800", icon: "👤" }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "purchase":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "view":
        return <Eye className="h-4 w-4 text-purple-500" />
      case "click":
        return <Smartphone className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  // 用户卡片组件
  const UserCard = ({ user }: { user: TrafficUser }) => {
    const wechatAccount = getWechatAccount(user.wechatAccountId)
    const customerService = getCustomerService(user.customerServiceId)
    const segmentInfo = getRFMSegmentInfo(user.rfmScore.segment)

    return (
      <Card
        className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
          user.rfmScore.priority === "high" ? "border-red-200 bg-red-50" : ""
        }`}
        onClick={() => {
          setSelectedUser(user)
          setShowUserDetail(true)
          setActiveDetailTab("info")
        }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex flex-col items-center">
            <Checkbox
              checked={selectedUsers.includes(user.id)}
              onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
              onClick={(e) => e.stopPropagation()}
              className="mb-2"
            />
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nickname} />
              <AvatarFallback>{user.nickname[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-lg truncate flex items-center">
                {user.nickname}
                {user.rfmScore.priority === "high" && (
                  <Star className="h-4 w-4 ml-1 text-red-500" fill="currentColor" />
                )}
              </div>
              <Badge
                className={`text-xs ${
                  user.addStatus === "not_added"
                    ? "bg-gray-100 text-gray-800"
                    : user.addStatus === "adding"
                      ? "bg-yellow-100 text-yellow-800"
                      : user.addStatus === "added"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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
            </div>

            <div className="text-sm font-medium text-blue-600 mb-2">{wechatAccount?.wechatId || "未知微信号"}</div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 mr-1" />
                <span>{getDevice(user.deviceId)?.name || "未知设备"}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{customerService?.name || "未分配"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {user.tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${tag.color}`}>
                  {tag.name}
                </Badge>
              ))}
              {user.tags.length > 2 && (
                <Badge className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-sm">
                  +{user.tags.length - 2}
                </Badge>
              )}
            </div>

            {user.poolIds.length > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <Layers className="h-4 w-4 mr-1" />
                <span className="truncate">{getPoolNames(user.poolIds).join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // 用户详情组件
  const UserDetail = ({ user }: { user: TrafficUser }) => {
    const wechatAccount = getWechatAccount(user.wechatAccountId)
    const customerService = getCustomerService(user.customerServiceId)
    const device = getDevice(user.deviceId)
    const segmentInfo = getRFMSegmentInfo(user.rfmScore.segment)

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nickname} />
            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xl font-medium">{user.nickname}</div>
            <div className="text-sm font-medium text-blue-600">{wechatAccount?.wechatId || "未知微信号"}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={segmentInfo.color}>
                {segmentInfo.icon} {user.rfmScore.segment}
              </Badge>
              {user.rfmScore.priority === "high" && <Badge className="bg-red-100 text-red-800">优先添加</Badge>}
            </div>
          </div>
        </div>

        <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">基本信息</TabsTrigger>
            <TabsTrigger value="journey">用户旅程</TabsTrigger>
            <TabsTrigger value="tags">用户标签</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-3 mt-3">
            <Card className="p-3">
              <div className="text-sm font-medium mb-2">关联信息</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">设备:</span>
                  <span className="font-medium">{device?.name || "未知设备"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">微信号:</span>
                  <span className="font-medium">{wechatAccount?.nickname || "未知微信"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">客服:</span>
                  <span className="font-medium">{customerService?.name || "未分配"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">添加时间:</span>
                  <span className="font-medium">{formatDate(user.addTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">最近互动:</span>
                  <span className="font-medium">{formatDate(user.lastInteraction)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="text-sm font-medium mb-2">RFM评分</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-500">最近性(R)</div>
                  <div className="text-lg font-bold text-blue-600">{user.rfmScore.recency}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">频率(F)</div>
                  <div className="text-lg font-bold text-green-600">{user.rfmScore.frequency}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">金额(M)</div>
                  <div className="text-lg font-bold text-purple-600">{user.rfmScore.monetary}</div>
                </div>
              </div>
              <div className="text-center mt-2 pt-2 border-t">
                <div className="text-xs text-gray-500">总分</div>
                <div className="text-xl font-bold text-red-600">{user.rfmScore.total}/15</div>
              </div>
            </Card>

            <Card className="p-3">
              <div className="text-sm font-medium mb-2">流量池</div>
              {user.poolIds.length > 0 ? (
                <div className="space-y-1">
                  {getPoolNames(user.poolIds).map((name, index) => (
                    <Badge key={index} className="mr-1 bg-blue-100 text-blue-800">
                      {name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">未分配到任何流量池</div>
              )}
            </Card>

            <Card className="p-3">
              <div className="text-sm font-medium mb-2">统计数据</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500">总消费</div>
                  <div className="text-lg font-bold text-green-600">¥{user.totalSpent}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500">互动次数</div>
                  <div className="text-lg font-bold text-blue-600">{user.interactionCount}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500">转化率</div>
                  <div className="text-lg font-bold text-purple-600">{user.conversionRate}%</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-xs text-gray-500">添加状态</div>
                  <div
                    className={`text-lg font-bold ${
                      user.addStatus === "added"
                        ? "text-green-600"
                        : user.addStatus === "not_added"
                          ? "text-gray-600"
                          : user.addStatus === "adding"
                            ? "text-yellow-600"
                            : "text-red-600"
                    }`}
                  >
                    {user.addStatus === "added"
                      ? "已添加"
                      : user.addStatus === "not_added"
                        ? "未添加"
                        : user.addStatus === "adding"
                          ? "添加中"
                          : "添加失败"}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="journey" className="space-y-3 mt-3">
            <Card className="p-3">
              <div className="text-sm font-medium mb-2">互动记录</div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {user.interactions.map((interaction) => (
                    <div key={interaction.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                      <div className="p-2 bg-gray-100 rounded-full">{getInteractionIcon(interaction.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">
                            {interaction.type === "message"
                              ? "消息互动"
                              : interaction.type === "purchase"
                                ? "购买行为"
                                : interaction.type === "view"
                                  ? "页面浏览"
                                  : "点击行为"}
                          </div>
                          <div className="text-xs text-gray-500">{formatDateTime(interaction.timestamp)}</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{interaction.content}</div>
                        {interaction.value !== undefined && (
                          <div className="text-sm font-medium text-green-600 mt-1">¥{interaction.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="tags" className="space-y-3 mt-3">
            <Card className="p-3">
              <div className="text-sm font-medium mb-2">用户标签</div>
              <div className="flex flex-wrap gap-2">
                {user.tags.map((tag) => (
                  <Badge key={tag.id} className={`${tag.color}`}>
                    {tag.name}
                  </Badge>
                ))}
                {user.tags.length === 0 && <div className="text-sm text-gray-500">暂无标签</div>}
              </div>
            </Card>

            <Card className="p-3">
              <div className="text-sm font-medium mb-2">价值标签</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge className={segmentInfo.color}>
                      {segmentInfo.icon} {user.rfmScore.segment}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">RFM总分: {user.rfmScore.total}/15</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">价值等级:</div>
                  <Badge
                    className={
                      user.rfmScore.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : user.rfmScore.priority === "medium"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }
                  >
                    {user.rfmScore.priority === "high"
                      ? "高价值"
                      : user.rfmScore.priority === "medium"
                        ? "中价值"
                        : "低价值"}
                  </Badge>
                </div>
              </div>
            </Card>

            <Button className="w-full">
              <Tag className="h-4 w-4 mr-2" />
              添加新标签
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">流量池管理</h1>
          </div>
          <div className="flex items-center space-x-2">
            {/* 数据分析按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center space-x-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span>数据分析</span>
              {showAnalytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
              placeholder="搜索用户昵称、微信号、手机号"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              ref={searchInputRef}
            />
          </div>
        </div>
      </header>

      {/* 数据分析面板 - 可折叠 */}
      {showAnalytics && (
        <div className="bg-white border-b p-4 space-y-4">
          {/* 核心指标 */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-blue-600">{filteredUsers.length}</div>
                  <div className="text-xs text-gray-500">总用户数</div>
                </div>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-red-600">{stats.highValue}</div>
                  <div className="text-xs text-gray-500">高价值用户</div>
                </div>
                <Star className="h-6 w-6 text-red-500" />
              </div>
            </Card>
          </div>

          {/* 用户价值分布 */}
          <Card className="p-3">
            <div className="text-sm font-medium mb-3">用户价值分布</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  <span>高价值</span>
                </div>
                <span className="font-medium">{stats.highValue}</span>
              </div>
              <Progress value={(stats.highValue / stats.total) * 100} className="h-2" />

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span>中价值</span>
                </div>
                <span className="font-medium">{stats.mediumValue}</span>
              </div>
              <Progress value={(stats.mediumValue / stats.total) * 100} className="h-2" />

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
                  <span>低价值</span>
                </div>
                <span className="font-medium">{stats.lowValue}</span>
              </div>
              <Progress value={(stats.lowValue / stats.total) * 100} className="h-2" />
            </div>
          </Card>

          {/* 添加效率 */}
          <Card className="p-3">
            <div className="text-sm font-medium mb-3">添加效率</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{stats.addSuccessRate}%</div>
                <div className="text-xs text-gray-500">成功率</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">¥{stats.avgSpent}</div>
                <div className="text-xs text-gray-500">平均消费</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
              <div className="text-center">
                <div className="text-sm font-bold text-green-600">{stats.added}</div>
                <div className="text-xs text-gray-500">已添加</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-gray-500">待添加</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-red-600">{stats.failed}</div>
                <div className="text-xs text-gray-500">添加失败</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 筛选器抽屉 */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="right" className="w-[85%] sm:max-w-md">
          <SheetHeader>
            <SheetTitle>筛选选项</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">设备</div>
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="选择设备" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部设备</SelectItem>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center space-x-2">
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
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">流量池</div>
              <Select value={poolFilter} onValueChange={setPoolFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="选择流量池" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部流量池</SelectItem>
                  <SelectItem value="none">未分配</SelectItem>
                  {trafficPools.map((pool) => (
                    <SelectItem key={pool.id} value={pool.id}>
                      {pool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">用户价值</div>
              <Select value={valuationFilter} onValueChange={setValuationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="用户价值" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部价值</SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-red-500" />
                      <span>高价值客户</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-blue-500" />
                      <span>中价值客户</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span>低价值客户</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">添加状态</div>
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

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetFilters}>
                重置筛选
              </Button>
              <Button onClick={() => setShowFilters(false)}>应用筛选</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {/* 筛选器标签 */}
        {(deviceFilter !== "all" ||
          poolFilter !== "all" ||
          valuationFilter !== "all" ||
          statusFilter !== "all" ||
          searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-2">
            {deviceFilter !== "all" && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white cursor-pointer"
                onClick={() => setDeviceFilter("all")}
              >
                设备: {devices.find((d) => d.id === deviceFilter)?.name}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {poolFilter !== "all" && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white cursor-pointer"
                onClick={() => setPoolFilter("all")}
              >
                流量池: {poolFilter === "none" ? "未分配" : trafficPools.find((p) => p.id === poolFilter)?.name}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {valuationFilter !== "all" && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white cursor-pointer"
                onClick={() => setValuationFilter("all")}
              >
                价值: {valuationFilter === "high" ? "高价值" : valuationFilter === "medium" ? "中价值" : "低价值"}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white cursor-pointer"
                onClick={() => setStatusFilter("all")}
              >
                状态:{" "}
                {statusFilter === "pending"
                  ? "待添加"
                  : statusFilter === "added"
                    ? "已添加"
                    : statusFilter === "failed"
                      ? "添加失败"
                      : "重复用户"}
                <X className="h-3 w-3" />
              </Badge>
            )}
            {searchQuery && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white cursor-pointer"
                onClick={() => setSearchQuery("")}
              >
                搜索: {searchQuery}
                <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        )}

        {/* 全选和批量操作 */}
        <div className="flex items-center justify-between py-2 px-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
              onCheckedChange={handleSelectAll}
              id="select-all"
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              全选当前页 共 {filteredUsers.length} 个用户，当前选择 {selectedUsers.length} 个
            </label>
          </div>
        </div>

        {/* 批量操作栏 */}
        {selectedUsers.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t p-3 mx-[-16px] mb-[-12px] z-10">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">已选择 {selectedUsers.length} 个用户</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                  取消选择
                </Button>
                <Button size="sm" onClick={handleAddToPool} className="bg-blue-600 hover:bg-blue-700">
                  <Layers className="h-4 w-4 mr-1" />
                  添加到流量池
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 用户列表 */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-gray-500 mb-4">暂无数据</div>
            <Button variant="outline" onClick={handleRefresh}>
              刷新
            </Button>
          </div>
        ) : (
          <>
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
                >
                  上一页
                </Button>
                <span className="text-sm text-gray-500">
                  第 {currentPage} / {totalPages} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 用户详情抽屉 */}
      <Sheet open={showUserDetail} onOpenChange={setShowUserDetail}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>用户详情</SheetTitle>
          </SheetHeader>
          <div className="py-6">{selectedUser && <UserDetail user={selectedUser} />}</div>
        </SheetContent>
      </Sheet>

      {/* 添加到流量池对话框 */}
      <Dialog open={showAddToPool} onOpenChange={setShowAddToPool}>
        <DialogContent className="w-[90%] max-w-md">
          <DialogHeader>
            <DialogTitle>添加到流量池</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="text-sm text-gray-500">已选择 {selectedUsers.length} 个用户，请选择要添加到的流量池</div>

            <Select value={selectedPool || ""} onValueChange={setSelectedPool}>
              <SelectTrigger>
                <SelectValue placeholder="选择流量池" />
              </SelectTrigger>
              <SelectContent>
                {trafficPools.map((pool) => (
                  <SelectItem key={pool.id} value={pool.id}>
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{pool.name}</div>
                      <div className="text-xs text-gray-500">{pool.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPool && (
              <div className="p-3 bg-blue-50 rounded-md">
                <div className="font-medium text-blue-800">{trafficPools.find((p) => p.id === selectedPool)?.name}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {trafficPools.find((p) => p.id === selectedPool)?.description}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {trafficPools
                    .find((p) => p.id === selectedPool)
                    ?.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddToPool(false)}>
              取消
            </Button>
            <Button onClick={confirmAddToPool} disabled={!selectedPool}>
              确认添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
