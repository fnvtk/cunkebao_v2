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
  Plus,
  ChevronDown,
  ChevronUp,
  Settings,
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
import { useMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
}

// RFM评分接口
interface RFMScore {
  recency: number // 1-5分，最近互动时间
  frequency: number // 1-5分，互动频率
  monetary: number // 1-5分，消费金额
  total: number // 总分
  segment: string // 用户分群
  priority: "high" | "medium" | "low" // 添加优先级
}

// 用户标签接口
interface UserTag {
  id: string
  name: string
  color: string
  source: string // 标签来源：设备ID或微信号
}

// 用户互动记录
interface UserInteraction {
  id: string
  type: "message" | "purchase" | "view" | "click"
  content: string
  timestamp: string
  value?: number
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
}

// 场景类型
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

// RFM分群定义（基于产品复盘文档）
const RFM_SEGMENTS = {
  "555": { name: "重要价值客户", color: "bg-red-100 text-red-800", icon: "👑", priority: "high" },
  "554": { name: "重要保持客户", color: "bg-purple-100 text-purple-800", icon: "💎", priority: "high" },
  "544": { name: "重要发展客户", color: "bg-blue-100 text-blue-800", icon: "🚀", priority: "high" },
  "455": { name: "重要挽留客户", color: "bg-orange-100 text-orange-800", icon: "⚠️", priority: "medium" },
  "444": { name: "一般价值客户", color: "bg-green-100 text-green-800", icon: "👤", priority: "medium" },
  "333": { name: "一般保持客户", color: "bg-yellow-100 text-yellow-800", icon: "📈", priority: "medium" },
  "222": { name: "新用户", color: "bg-cyan-100 text-cyan-800", icon: "🌟", priority: "low" },
  "111": { name: "流失预警客户", color: "bg-gray-100 text-gray-800", icon: "😴", priority: "low" },
}

// 生成模拟设备数据
const generateMockDevices = (): Device[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `device-${i + 1}`,
    name: `设备${i + 1}`,
    status: ["online", "offline", "busy"][Math.floor(Math.random() * 3)] as "online" | "offline" | "busy",
    battery: Math.floor(Math.random() * 100),
    location: ["北京", "上海", "广州", "深圳"][Math.floor(Math.random() * 4)],
    wechatAccounts: Math.floor(Math.random() * 5) + 1,
    dailyAddLimit: Math.random() > 0.5 ? 20 : 10, // 老号20人，新号10人
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
        nickname: `微信${device.id.split("-")[1]}-${i + 1}`,
        wechatId: `wxid_${Math.random().toString(36).substr(2, 8)}`,
        avatar: `/placeholder.svg?height=40&width=40&query=wx${Math.floor(Math.random() * 10)}`,
        deviceId: device.id,
        status: ["normal", "limited", "blocked"][Math.floor(Math.random() * 3)] as "normal" | "limited" | "blocked",
        friendCount: Math.floor(Math.random() * 4000) + 1000,
        dailyAddLimit: Math.random() > 0.5 ? 20 : 10, // 老号20人，新号10人
      })
    }
  })

  return accounts
}

// 生成模拟客服数据
const generateMockCustomerServices = (): CustomerService[] => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `cs-${i + 1}`,
    name: `客服${i + 1}`,
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
  }
}

// 生成模拟用户互动记录
const generateMockInteractions = (): UserInteraction[] => {
  const interactions: UserInteraction[] = []
  const interactionCount = Math.floor(Math.random() * 10) + 5 // 5-15条互动记录

  for (let i = 0; i < interactionCount; i++) {
    const type = ["message", "purchase", "view", "click"][Math.floor(Math.random() * 4)] as
      | "message"
      | "purchase"
      | "view"
      | "click"

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)) // 最近30天内的互动
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    let content = ""
    let value: number | undefined = undefined

    switch (type) {
      case "message":
        content = ["您好，请问有什么可以帮到您？", "产品有什么优惠活动吗？", "谢谢，我考虑一下"][
          Math.floor(Math.random() * 3)
        ]
        break
      case "purchase":
        content = ["购买了产品A", "购买了服务B", "订阅了会员计划"][Math.floor(Math.random() * 3)]
        value = Math.floor(Math.random() * 1000) + 100 // 100-1100元的消费
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

  // 按时间排序，最近的在前
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
      color: "bg-green-100 text-green-800",
      source: "system",
    })
  } else if (rfmScore.recency <= 2) {
    tags.push({
      id: `tag-recency-${rfmScore.recency}`,
      name: "长期未活跃",
      color: "bg-red-100 text-red-800",
      source: "system",
    })
  }

  if (rfmScore.frequency >= 4) {
    tags.push({
      id: `tag-frequency-${rfmScore.frequency}`,
      name: "高频互动",
      color: "bg-blue-100 text-blue-800",
      source: "system",
    })
  }

  if (rfmScore.monetary >= 4) {
    tags.push({
      id: `tag-monetary-${rfmScore.monetary}`,
      name: "高消费",
      color: "bg-purple-100 text-purple-800",
      source: "system",
    })
  }

  // 随机添加一些其他标签
  const otherTags = [
    { name: "潜在客户", color: "bg-yellow-100 text-yellow-800" },
    { name: "已成交", color: "bg-green-100 text-green-800" },
    { name: "需跟进", color: "bg-orange-100 text-orange-800" },
    { name: "VIP客户", color: "bg-red-100 text-red-800" },
    { name: "企业客户", color: "bg-blue-100 text-blue-800" },
    { name: "个人客户", color: "bg-gray-100 text-gray-800" },
    { name: "新客户", color: "bg-cyan-100 text-cyan-800" },
    { name: "老客户", color: "bg-purple-100 text-purple-800" },
  ]

  // 随机选择1-3个其他标签
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

// 生成模拟用户数据
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
    const isDuplicate = Math.random() < 0.15 // 15%重复率

    // 随机分配到0-2个流量池
    const poolCount = Math.floor(Math.random() * 3)
    const poolIds =
      poolCount === 0
        ? []
        : Array.from({ length: poolCount }, () => trafficPools[Math.floor(Math.random() * trafficPools.length)].id)

    // 确保高价值用户在高价值池中
    if (rfmScore.priority === "high" && !poolIds.includes("pool-1")) {
      if (Math.random() > 0.5) {
        poolIds.push("pool-1")
      }
    }

    const addTime = new Date()
    addTime.setDate(addTime.getDate() - Math.floor(Math.random() * 30))

    const lastInteraction = new Date()
    lastInteraction.setDate(lastInteraction.getDate() - Math.floor(Math.random() * 7))

    // 生成用户标签
    const tags = generateUserTags(rfmScore)

    // 生成互动记录
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
  const [deviceFilter, setDeviceFilter] = useState<string[]>([]) // 改为多选
  const [poolFilter, setPoolFilter] = useState("all")
  const [valuationFilter, setValuationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = isMobile ? 10 : 20

  // 弹窗状态
  const [selectedUser, setSelectedUser] = useState<TrafficUser | null>(null)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [showAddToPool, setShowAddToPool] = useState(false)
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState("info")

  // 管理面板状态
  const [showManagementPanel, setShowManagementPanel] = useState(false)
  const [managementActiveTab, setManagementActiveTab] = useState("pools")

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
  }

  // 过滤用户
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !debouncedSearchQuery ||
      user.nickname.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      user.wechatId.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)

    const matchesDevice = deviceFilter.length === 0 || deviceFilter.includes(user.deviceId)
    const matchesValuation = valuationFilter === "all" || user.rfmScore.priority === valuationFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesPool =
      poolFilter === "all" || (poolFilter === "none" ? user.poolIds.length === 0 : user.poolIds.includes(poolFilter))

    return matchesSearch && matchesDevice && matchesValuation && matchesStatus && matchesPool
  })

  // 按优先级排序（高价值客户优先）
  const sortedUsers = filteredUsers.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.rfmScore.priority] - priorityOrder[a.rfmScore.priority]
  })

  // 计算分页
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  // 重置到第一页当过滤条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery, deviceFilter, poolFilter, valuationFilter, statusFilter])

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
        title: "刷新成功",
        description: "流量池数据已更新",
      })
    }, 800)
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

    // 更新用户的流量池
    const updatedUsers = users.map((user) => {
      if (selectedUsers.includes(user.id)) {
        // 如果用户已经在该流量池中，则不重复添加
        if (!user.poolIds.includes(selectedPool)) {
          return {
            ...user,
            poolIds: [...user.poolIds, selectedPool],
            addStatus: "added", // 更新添加状态
          }
        }
      }
      return user
    })

    setUsers(updatedUsers)
    setShowAddToPool(false)
    setSelectedPool(null)
    setSelectedUsers([])

    // 获取流量池名称
    const poolName = trafficPools.find((pool) => pool.id === selectedPool)?.name || "未知流量池"

    toast({
      title: "添加成功",
      description: `已将 ${selectedUsers.length} 个用户添加到 ${poolName}`,
    })
  }

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
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "view":
        return <Eye className="h-4 w-4 text-purple-500" />
      case "click":
        return <Smartphone className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
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

  // 用户卡片组件
  const UserCard = ({ user }: { user: TrafficUser }) => {
    const wechatAccount = getWechatAccount(user.wechatAccountId)
    const customerService = getCustomerService(user.customerServiceId)
    const segmentInfo = getRFMSegmentInfo(user.rfmScore.segment)

    return (
      <Card
        className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
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
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nickname} />
              <AvatarFallback>{user.nickname[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium truncate flex items-center">
                {user.nickname}
                {user.rfmScore.priority === "high" && (
                  <Star className="h-3 w-3 ml-1 text-red-500" fill="currentColor" />
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

            {/* 微信号 - 突出显示 */}
            <div className="text-sm font-medium text-blue-600 mb-1">{wechatAccount?.wechatId || "未知微信号"}</div>

            {/* 设备和客服信息 */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <div className="flex items-center">
                <Smartphone className="h-3 w-3 mr-1" />
                <span>{getDevice(user.deviceId)?.name || "未知设备"}</span>
              </div>
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span>{customerService?.name || "未分配"}</span>
              </div>
            </div>

            {/* 标签和RFM */}
            <div className="flex flex-wrap gap-1 mt-1 mb-1">
              {user.tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} className={`text-xs ${tag.color}`}>
                  {tag.name}
                </Badge>
              ))}
              {user.tags.length > 2 && (
                <Badge className="text-xs bg-gray-100 text-gray-800">+{user.tags.length - 2}</Badge>
              )}
            </div>

            {/* 流量池信息 */}
            {user.poolIds.length > 0 && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Layers className="h-3 w-3 mr-1" />
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
        {/* 用户基本信息 */}
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

        {/* 标签页导航 */}
        <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">基本信息</TabsTrigger>
            <TabsTrigger value="journey">用户旅程</TabsTrigger>
            <TabsTrigger value="tags">用户标签</TabsTrigger>
          </TabsList>

          {/* 基本信息标签页 */}
          <TabsContent value="info" className="space-y-3 mt-3">
            {/* 关联信息 */}
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

            {/* RFM评分 */}
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

            {/* 流量池信息 */}
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

            {/* 统计数据 */}
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

          {/* 用户旅程标签页 */}
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

            {/* 消费旅程 */}
            <Card className="p-3">
              <div className="text-sm font-medium mb-2">消费旅程</div>
              <div className="space-y-2">
                {user.interactions
                  .filter((i) => i.type === "purchase")
                  .map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">{purchase.content}</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">¥{purchase.value}</div>
                    </div>
                  ))}
                {user.interactions.filter((i) => i.type === "purchase").length === 0 && (
                  <div className="text-center py-3 text-sm text-gray-500">暂无消费记录</div>
                )}
              </div>
            </Card>

            {/* RFM关键词 */}
            <Card className="p-3">
              <div className="text-sm font-medium mb-2">RFM关键词</div>
              <div className="flex flex-wrap gap-2">
                {user.rfmScore.recency >= 4 && <Badge className="bg-green-100 text-green-800">近期活跃</Badge>}
                {user.rfmScore.recency <= 2 && <Badge className="bg-red-100 text-red-800">长期未活跃</Badge>}
                {user.rfmScore.frequency >= 4 && <Badge className="bg-blue-100 text-blue-800">高频互动</Badge>}
                {user.rfmScore.frequency <= 2 && <Badge className="bg-yellow-100 text-yellow-800">低频互动</Badge>}
                {user.rfmScore.monetary >= 4 && <Badge className="bg-purple-100 text-purple-800">高消费</Badge>}
                {user.rfmScore.monetary <= 2 && <Badge className="bg-gray-100 text-gray-800">低消费</Badge>}
                {user.rfmScore.total >= 12 && <Badge className="bg-red-100 text-red-800">高价值</Badge>}
                {user.rfmScore.total <= 6 && <Badge className="bg-gray-100 text-gray-800">低价值</Badge>}
              </div>
            </Card>
          </TabsContent>

          {/* 用户标签标签页 */}
          <TabsContent value="tags" className="space-y-3 mt-3">
            {/* 用户标签 */}
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

            {/* 价值标签 */}
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

            {/* 流量池标签 */}
            <Card className="p-3">
              <div className="text-sm font-medium mb-2">流量池标签</div>
              {user.poolIds.length > 0 ? (
                <div className="space-y-2">
                  {user.poolIds.map((poolId) => {
                    const pool = trafficPools.find((p) => p.id === poolId)
                    return (
                      <div key={poolId} className="p-2 bg-blue-50 rounded-md">
                        <div className="font-medium text-blue-800">{pool?.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pool?.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500">未分配到任何流量池</div>
              )}
            </Card>

            {/* 添加标签按钮 */}
            <Button className="w-full">
              <Tag className="h-4 w-4 mr-2" />
              添加新标签
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // 管理面板组件
  const ManagementPanel = () => (
    <div className="space-y-4">
      <Tabs value={managementActiveTab} onValueChange={setManagementActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pools">
            <Layers className="h-4 w-4 mr-1" />
            流量池
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-1" />
            数据分析
          </TabsTrigger>
        </TabsList>

        {/* 流量池标签页 */}
        <TabsContent value="pools" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">流量池列表</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-3 w-3 mr-1" />
              新建流量池
            </Button>
          </div>

          {/* 流量池列表 */}
          <div className="space-y-2">
            {trafficPools.map((pool) => (
              <Card key={pool.id} className="p-3 cursor-pointer hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{pool.name}</div>
                  <Badge variant="outline">{pool.userCount}人</Badge>
                </div>
                <div className="text-xs text-gray-500 mt-1">{pool.description}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {pool.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 数据分析标签页 */}
        <TabsContent value="analytics" className="space-y-4">
          {/* 价值分布 */}
          <Card className="p-4">
            <div className="text-sm font-medium mb-2">用户价值分布</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>高价值</span>
                </div>
                <span className="font-medium">{stats.highValue}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>中价值</span>
                </div>
                <span className="font-medium">{stats.mediumValue}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded"></div>
                  <span>低价值</span>
                </div>
                <span className="font-medium">{stats.lowValue}</span>
              </div>
            </div>
          </Card>

          {/* 添加效率 */}
          <Card className="p-4">
            <div className="text-sm font-medium mb-2">添加效率</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>成功率</span>
                <span className="font-medium text-green-600">
                  {Math.round((stats.added / (stats.added + stats.pending)) * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>平均消费</span>
                <span className="font-medium">¥{stats.avgSpent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>重复率</span>
                <span className="font-medium text-purple-600">
                  {Math.round((stats.duplicates / stats.total) * 100)}%
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  // 移动版布局
  if (isMobile) {
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
                placeholder="搜索用户昵称、微信号、手机号"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                ref={searchInputRef}
              />
            </div>
          </div>
        </header>

        {/* 管理面板抽屉 */}
        <Sheet open={showManagementPanel} onOpenChange={setShowManagementPanel}>
          <SheetContent side="right" className="w-[85%] sm:max-w-md">
            <SheetHeader>
              <SheetTitle>流量池管理</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <ManagementPanel />
            </div>
          </SheetContent>
        </Sheet>

        {/* 筛选器抽屉 */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="right" className="w-[85%] sm:max-w-md">
            <SheetHeader>
              <SheetTitle>筛选选项</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-4">
              {/* 设备多选 */}
              <div className="space-y-2">
                <div className="text-sm font-medium">设备选择（多选）</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`device-${device.id}`}
                        checked={deviceFilter.includes(device.id)}
                        onCheckedChange={(checked) => handleDeviceFilterChange(device.id, checked as boolean)}
                      />
                      <label htmlFor={`device-${device.id}`} className="flex items-center space-x-2 text-sm">
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
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">流量池</div>
                <Select
                  value={poolFilter}
                  onValueChange={(value) => {
                    setPoolFilter(value)
                    setCurrentPage(1)
                  }}
                >
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
                <Select
                  value={valuationFilter}
                  onValueChange={(value) => {
                    setValuationFilter(value)
                    setCurrentPage(1)
                  }}
                >
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
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value)
                    setCurrentPage(1)
                  }}
                >
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

        {/* 用户列表 */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {/* 筛选器标签 */}
          {(deviceFilter.length > 0 ||
            poolFilter !== "all" ||
            valuationFilter !== "all" ||
            statusFilter !== "all" ||
            searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-2">
              {deviceFilter.length > 0 && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-white cursor-pointer"
                  onClick={() => setDeviceFilter([])}
                >
                  设备: {deviceFilter.length}个
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

          {/* 批量操作栏 */}
          {selectedUsers.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t p-3 mx-[-16px] mb-[-12px]">
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
                  <Button size="sm" onClick={handleAddToPool} className="bg-blue-600 hover:bg-blue-700">
                    <Layers className="h-4 w-4 mr-1" />
                    添加到流量池
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 统计信息卡片 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredUsers.length}</div>
                <div className="text-xs text-gray-500">总用户数</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.highValue}</div>
                <div className="text-xs text-gray-500">高价值用户</div>
              </div>
            </Card>
          </div>

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
                  <div className="font-medium text-blue-800">
                    {trafficPools.find((p) => p.id === selectedPool)?.name}
                  </div>
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

  // 桌面版布局
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 主要内容区域 */}
      <div className="flex-1 bg-white">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-medium">流量池管理</h1>
            </div>
            <div className="flex items-center space-x-2">
              {selectedUsers.length > 0 && (
                <Button onClick={handleAddToPool} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Layers className="h-4 w-4 mr-1" />
                  添加到流量池 ({selectedUsers.length})
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4">
          {/* 搜索栏和管理面板 */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索用户昵称、微信号、手机号"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Collapsible open={showManagementPanel} onOpenChange={setShowManagementPanel}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>流量池管理</span>
                  {showManagementPanel ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          {/* 可展开的管理面板 */}
          <Collapsible open={showManagementPanel} onOpenChange={setShowManagementPanel}>
            <CollapsibleContent className="space-y-4">
              <Card className="p-4">
                <ManagementPanel />
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* 筛选器 */}
          <div className="grid grid-cols-4 gap-2">
            {/* 设备多选 */}
            <div className="space-y-2">
              <div className="text-sm font-medium">设备选择</div>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {deviceFilter.length === 0 ? "全部设备" : `已选 ${deviceFilter.length} 个设备`}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <Card className="p-3 max-h-40 overflow-y-auto">
                    <div className="space-y-2">
                      {devices.map((device) => (
                        <div key={device.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`device-${device.id}`}
                            checked={deviceFilter.includes(device.id)}
                            onCheckedChange={(checked) => handleDeviceFilterChange(device.id, checked as boolean)}
                          />
                          <label htmlFor={`device-${device.id}`} className="flex items-center space-x-2 text-sm">
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
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <Select
              value={poolFilter}
              onValueChange={(value) => {
                setPoolFilter(value)
                setCurrentPage(1)
              }}
            >
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

            <Select
              value={valuationFilter}
              onValueChange={(value) => {
                setValuationFilter(value)
                setCurrentPage(1)
              }}
            >
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

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setCurrentPage(1)
              }}
            >
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

          {/* 用户列表 */}
          <div className="space-y-2">
            {/* 全选和批量操作 */}
            <div className="flex items-center justify-between py-2 px-1">
              <div className="flex items-center space-x-2">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} id="select-all" />
                <label htmlFor="select-all" className="text-sm font-medium">
                  全选当前页
                </label>
              </div>
              <div className="text-sm text-gray-500">
                共 {filteredUsers.length} 个用户，当前选择 {selectedUsers.length} 个
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                <div className="text-gray-500">加载中...</div>
              </div>
            ) : paginatedUsers.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-500">暂无数据</div>
                <Button variant="outline" className="mt-4" onClick={handleRefresh}>
                  刷新
                </Button>
              </div>
            ) : (
              paginatedUsers.map((user) => <UserCard key={user.id} user={user} />)
            )}
          </div>

          {/* 分页 */}
          {!loading && paginatedUsers.length > 0 && totalPages > 1 && (
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
        </div>
      </div>

      {/* 用户详情弹窗 */}
      <Dialog open={showUserDetail} onOpenChange={setShowUserDetail}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>用户详情</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserDetail user={selectedUser} />}
        </DialogContent>
      </Dialog>

      {/* 添加到流量池弹窗 */}
      <Dialog open={showAddToPool} onOpenChange={setShowAddToPool}>
        <DialogContent className="max-w-md">
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
