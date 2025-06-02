// 定义登录响应类型
export interface LoginResponse {
  code: number
  message: string
  data?: {
    token: string
    user?: {
      id: string
      username: string
      phone: string
      avatar?: string
      role: string
    }
  }
}

// 定义验证码响应类型
export interface CodeResponse {
  code: number
  message: string
  data?: {
    expireTime: number // 验证码过期时间（秒）
  }
}

// 登录参数类型
export interface LoginParams {
  phone: string
  loginType: "password" | "code"
  password?: string
  verificationCode?: string
}

// 发送验证码参数类型
export interface SendCodeParams {
  phone: string
  type: "login" | "register" | "reset"
}

// API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  return await response.json()
}

/**
 * 发送验证码
 * @param params 发送验证码参数
 * @returns 验证码响应
 */
export async function sendVerificationCode(params: SendCodeParams): Promise<CodeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/send-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  return await response.json()
}

/**
 * 退出登录
 * @returns 退出登录响应
 */
export async function logout(): Promise<{ code: number; message: string }> {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  return await response.json()
}

/**
 * 检查登录状态
 * @returns 是否已登录
 */
export function checkLoginStatus(): boolean {
  const token = localStorage.getItem("token")
  return !!token
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (e) {
    console.error("解析用户信息失败", e)
    return null
  }
}
