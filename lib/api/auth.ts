/**
 * 认证相关API接口 - 基于存客宝接口文档
 */
import { apiClient, type ApiResponse } from "./client"
import { API_ENDPOINTS, STORAGE_KEYS } from "./config"

// 登录请求接口
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
  captchaId?: string
}

// 登录响应接口
export interface LoginResponse {
  token: string
  refreshToken: string
  user: UserInfo
  expiresIn: number
}

// 用户信息接口
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  role: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// 刷新Token响应接口
export interface RefreshTokenResponse {
  token: string
  expiresIn: number
}

// 验证码响应接口
export interface CaptchaResponse {
  captchaId: string
  captchaImage: string // base64图片
}

/**
 * 认证API类
 */
class AuthApi {
  /**
   * 用户登录
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data)

    // 登录成功后保存用户信息
    if (response.code === 0 && response.data) {
      this.saveUserSession(response.data)
    }

    return response
  }

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT)

    // 清除本地存储的用户信息
    this.clearUserSession()

    return response
  }

  /**
   * 刷新Token
   */
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error("没有刷新令牌")
    }

    const response = await apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    })

    // 更新Token
    if (response.code === 0 && response.data) {
      this.updateToken(response.data.token)
    }

    return response
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(): Promise<ApiResponse<UserInfo>> {
    return apiClient.get<UserInfo>(API_ENDPOINTS.AUTH.USER_INFO)
  }

  /**
   * 获取验证码
   */
  async getCaptcha(): Promise<ApiResponse<CaptchaResponse>> {
    return apiClient.get<CaptchaResponse>(API_ENDPOINTS.AUTH.CAPTCHA)
  }

  /**
   * 修改密码
   */
  async changePassword(data: {
    oldPassword: string
    newPassword: string
  }): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
  }

  /**
   * 发送短信验证码
   */
  async sendSmsCode(phone: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.SEND_CODE, { phone })
  }

  /**
   * 更新用户资料
   */
  async updateProfile(data: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
    return apiClient.put<UserInfo>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data)
  }

  // 本地存储相关方法

  /**
   * 保存用户会话信息
   */
  private saveUserSession(loginData: LoginResponse): void {
    if (typeof window === "undefined") return

    localStorage.setItem(STORAGE_KEYS.TOKEN, loginData.token)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginData.refreshToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loginData.user))
    localStorage.setItem(STORAGE_KEYS.LAST_LOGIN_TIME, Date.now().toString())
  }

  /**
   * 清除用户会话信息
   */
  private clearUserSession(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN_TIME)
  }

  /**
   * 更新Token
   */
  private updateToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  }

  /**
   * 获取刷新Token
   */
  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): UserInfo | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    const user = this.getCurrentUser()

    return !!(token && user)
  }

  /**
   * 检查Token是否过期
   */
  isTokenExpired(): boolean {
    if (typeof window === "undefined") return true

    const lastLoginTime = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN_TIME)
    if (!lastLoginTime) return true

    // 假设Token有效期为24小时
    const tokenExpireTime = Number.parseInt(lastLoginTime) + 24 * 60 * 60 * 1000
    return Date.now() > tokenExpireTime
  }
}

// 导出单例实例
export const authApi = new AuthApi()
