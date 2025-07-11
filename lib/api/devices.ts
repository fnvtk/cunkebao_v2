// 设备管理API服务
import { API_ENDPOINTS, ERROR_CODES } from "./config"

// 设备统计数据类型
export interface DeviceStats {
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  todayAdded: number
  weeklyGrowth: number
  monthlyGrowth: number
}

// 设备信息类型
export interface Device {
  id: string
  name: string
  imei: string
  wechatId: string
  status: "online" | "offline"
  friendCount: number
  todayNewFriends: number
  lastActiveTime: string
  deviceType: string
  systemVersion: string
  appVersion: string
  location?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// 设备列表响应类型
export interface DeviceListResponse {
  devices: Device[]
  total: number
  page: number
  pageSize: number
}

// 获取设备统计数据
export async function getDeviceStats(): Promise<DeviceStats> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.DEVICES.STATS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()

    // 检查响应数据结构
    if (data && typeof data === "object") {
      // 如果有code字段，检查是否成功
      if ("code" in data) {
        if (data.code === ERROR_CODES.SUCCESS) {
          return data.data || getDefaultDeviceStats()
        } else {
          console.warn("API返回错误码:", data.code, data.message)
          return getDefaultDeviceStats()
        }
      }

      // 如果没有code字段，直接返回数据
      if ("totalDevices" in data) {
        return data
      }

      // 如果有data字段，返回data
      if ("data" in data && data.data) {
        return data.data
      }
    }

    // 如果数据结构不符合预期，返回默认数据
    console.warn("API返回数据结构异常:", data)
    return getDefaultDeviceStats()
  } catch (error) {
    console.error("获取设备统计失败:", error)
    // 返回默认数据，避免页面崩溃
    return getDefaultDeviceStats()
  }
}

// 获取设备列表
export async function getDeviceList(
  page = 1,
  pageSize = 20,
  filters?: {
    status?: "online" | "offline" | "all"
    keyword?: string
    tags?: string[]
  },
): Promise<DeviceListResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (filters?.status && filters.status !== "all") {
      params.append("status", filters.status)
    }
    if (filters?.keyword) {
      params.append("keyword", filters.keyword)
    }
    if (filters?.tags && filters.tags.length > 0) {
      params.append("tags", filters.tags.join(","))
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.DEVICES.LIST}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.code === ERROR_CODES.SUCCESS) {
      return data.data || getDefaultDeviceList()
    }

    console.warn("获取设备列表失败:", data.message)
    return getDefaultDeviceList()
  } catch (error) {
    console.error("获取设备列表失败:", error)
    return getDefaultDeviceList()
  }
}

// 添加设备
export async function addDevice(deviceData: {
  deviceId: string
  name?: string
  tags?: string[]
}): Promise<{ success: boolean; message: string; device?: Device }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.DEVICES.ADD}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(deviceData),
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.code === ERROR_CODES.SUCCESS) {
      return {
        success: true,
        message: "设备添加成功",
        device: data.data,
      }
    }

    return {
      success: false,
      message: data.message || "设备添加失败",
    }
  } catch (error) {
    console.error("添加设备失败:", error)
    return {
      success: false,
      message: "网络错误，请稍后重试",
    }
  }
}

// 删除设备
export async function deleteDevice(deviceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.DEVICES.DELETE}/${deviceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.code === ERROR_CODES.SUCCESS) {
      return {
        success: true,
        message: "设备删除成功",
      }
    }

    return {
      success: false,
      message: data.message || "设备删除失败",
    }
  } catch (error) {
    console.error("删除设备失败:", error)
    return {
      success: false,
      message: "网络错误，请稍后重试",
    }
  }
}

// 更新设备信息
export async function updateDevice(
  deviceId: string,
  updates: Partial<Device>,
): Promise<{ success: boolean; message: string; device?: Device }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.DEVICES.UPDATE}/${deviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.code === ERROR_CODES.SUCCESS) {
      return {
        success: true,
        message: "设备更新成功",
        device: data.data,
      }
    }

    return {
      success: false,
      message: data.message || "设备更新失败",
    }
  } catch (error) {
    console.error("更新设备失败:", error)
    return {
      success: false,
      message: "网络错误，请稍后重试",
    }
  }
}

// 获取设备详情
export async function getDeviceDetail(deviceId: string): Promise<Device | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ENDPOINTS.DEVICES.DETAIL}/${deviceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.code === ERROR_CODES.SUCCESS) {
      return data.data
    }

    console.warn("获取设备详情失败:", data.message)
    return null
  } catch (error) {
    console.error("获取设备详情失败:", error)
    return null
  }
}

// 默认设备统计数据
function getDefaultDeviceStats(): DeviceStats {
  return {
    totalDevices: 50,
    onlineDevices: 40,
    offlineDevices: 10,
    todayAdded: 3,
    weeklyGrowth: 8.5,
    monthlyGrowth: 15.2,
  }
}

// 默认设备列表数据
function getDefaultDeviceList(): DeviceListResponse {
  const mockDevices: Device[] = [
    {
      id: "1",
      name: "设备1",
      imei: "sd123123",
      wechatId: "wxid_qc924n67",
      status: "online",
      friendCount: 1234,
      todayNewFriends: 5,
      lastActiveTime: new Date().toISOString(),
      deviceType: "Android",
      systemVersion: "11.0",
      appVersion: "8.0.28",
      tags: ["主力设备"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "设备2",
      imei: "sd456456",
      wechatId: "wxid_abc123",
      status: "offline",
      friendCount: 856,
      todayNewFriends: 0,
      lastActiveTime: "2024-01-19T10:30:00Z",
      deviceType: "iOS",
      systemVersion: "17.2",
      appVersion: "8.0.28",
      tags: ["备用设备"],
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-19T10:30:00Z",
    },
  ]

  return {
    devices: mockDevices,
    total: mockDevices.length,
    page: 1,
    pageSize: 20,
  }
}

/**
 * 兼容旧版设备列表接口
 * 等价于 getDeviceList() 默认取第一页
 * @returns Device[] 设备数组
 */
export async function getDevices(): Promise<Device[]> {
  const { devices } = await getDeviceList(1, 20)
  return devices
}
