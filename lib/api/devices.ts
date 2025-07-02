// 设备管理API模块 - 基于存客宝API文档
import { apiClient } from "./client"

// 设备数据类型定义
export interface Device {
  id: string
  name: string
  type: "android" | "ios"
  status: "online" | "offline" | "error"
  ip: string
  version: string
  wechatCount: number
  lastActiveTime: string
  createTime: string
  imei: string
  model: string
  battery: number
  friendCount: number
  todayAdded: number
  location: string
  employee: string
  wechatId: string
}

export interface DeviceStats {
  total: number
  online: number
  offline: number
  error: number
}

export interface AddDeviceRequest {
  name: string
  type: "android" | "ios"
  ip: string
}

// API响应格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

// 获取设备列表
export async function getDevices(): Promise<Device[]> {
  try {
    const response = await apiClient.get<Device[]>("/api/devices")

    // 确保返回的是数组
    if (response.data && Array.isArray(response.data)) {
      return response.data
    }

    // 如果API返回的数据格式不正确，返回空数组
    console.warn("API返回的设备数据格式不正确:", response)
    return []
  } catch (error) {
    console.error("获取设备列表失败:", error)

    // 返回模拟数据作为降级处理，确保是数组格式
    return [
      {
        id: "1",
        name: "设备1",
        type: "android",
        status: "online",
        ip: "192.168.1.100",
        version: "Android 11",
        wechatCount: 5,
        lastActiveTime: "2024-01-07 14:30:00",
        createTime: "2024-01-01 10:00:00",
        imei: "sdt23713",
        model: "iPhone14",
        battery: 94,
        friendCount: 363,
        todayAdded: 1,
        location: "北京",
        employee: "员工1",
        wechatId: "wx_001",
      },
      {
        id: "2",
        name: "设备2",
        type: "android",
        status: "online",
        ip: "192.168.1.101",
        version: "Android 12",
        wechatCount: 3,
        lastActiveTime: "2024-01-07 12:15:00",
        createTime: "2024-01-02 11:00:00",
        imei: "sdt23714",
        model: "S23",
        battery: 20,
        friendCount: 202,
        todayAdded: 30,
        location: "上海",
        employee: "员工2",
        wechatId: "wx_002",
      },
      {
        id: "3",
        name: "设备3",
        type: "ios",
        status: "online",
        ip: "192.168.1.102",
        version: "iOS 16.0",
        wechatCount: 8,
        lastActiveTime: "2024-01-07 14:45:00",
        createTime: "2024-01-03 09:30:00",
        imei: "brmqmjae",
        model: "Mi13",
        battery: 26,
        friendCount: 501,
        todayAdded: 40,
        location: "广州",
        employee: "员工3",
        wechatId: "wx_003",
      },
    ]
  }
}

// 获取设备统计
export async function getDeviceStats(): Promise<DeviceStats> {
  try {
    const response = await apiClient.get<DeviceStats>("/api/devices/stats")

    if (response.data) {
      return response.data
    }

    // 默认统计数据
    return { total: 0, online: 0, offline: 0, error: 0 }
  } catch (error) {
    console.error("获取设备统计失败:", error)
    return {
      total: 50,
      online: 40,
      offline: 8,
      error: 2,
    }
  }
}

// 添加设备
export async function addDevice(device: AddDeviceRequest): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiClient.post<any>("/api/devices", device)
    return { success: true, message: "设备添加成功" }
  } catch (error) {
    console.error("添加设备失败:", error)
    return { success: false, message: "添加设备失败" }
  }
}

// 删除设备
export async function deleteDevice(deviceId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiClient.delete(`/api/devices/${deviceId}`)
    return { success: true, message: "设备删除成功" }
  } catch (error) {
    console.error("删除设备失败:", error)
    return { success: false, message: "删除设备失败" }
  }
}

// 重启设备
export async function restartDevice(deviceId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiClient.post(`/api/devices/${deviceId}/restart`)
    return { success: true, message: "设备重启成功" }
  } catch (error) {
    console.error("重启设备失败:", error)
    return { success: false, message: "重启设备失败" }
  }
}
