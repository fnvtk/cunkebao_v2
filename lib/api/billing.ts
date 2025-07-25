// 计费管理API接口
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ckbapi.quwanzhi.com"

// 账户信息类型
export interface AccountInfo {
  balance: number
  totalRecharge: number
  totalConsume: number
  monthlyConsume: number
}

// 消费记录类型
export interface BillingRecord {
  id: string
  type: "recharge" | "consume" | "refund"
  amount: number
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  orderId?: string
}

// 充值参数
export interface RechargeParams {
  amount: number
  paymentMethod: "wechat" | "alipay"
}

// 消费参数
export interface ConsumeParams {
  amount: number
  description: string
  serviceType: string
  orderId?: string
}

// 统一的API请求客户端
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const token = localStorage.getItem("ckb_token")
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...((options.headers as Record<string, string>) || {}),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    console.log("发送计费API请求:", url)

    const response = await fetch(url, {
      ...options,
      headers,
      mode: "cors",
    })

    console.log("计费API响应状态:", response.status, response.statusText)

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("ckb_token")
          localStorage.removeItem("ckb_user")
        }
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("服务器返回了非JSON格式的数据")
    }

    const data = await response.json()
    console.log("计费API响应数据:", data)

    if (data.code && data.code !== 200 && data.code !== 0) {
      throw new Error(data.message || "请求失败")
    }

    return data.data || data
  } catch (error) {
    console.error("计费API请求失败:", error)
    throw error
  }
}

/**
 * 获取账户信息
 */
export async function getAccountInfo(): Promise<AccountInfo> {
  return apiRequest<AccountInfo>(`${API_BASE_URL}/v1/billing/account`)
}

/**
 * 获取消费记录
 */
export async function getBillingRecords(
  page = 1,
  limit = 20,
  type?: "recharge" | "consume" | "refund",
): Promise<{
  records: BillingRecord[]
  total: number
  page: number
  limit: number
}> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (type) {
    params.append("type", type)
  }

  return apiRequest(`${API_BASE_URL}/v1/billing/records?${params.toString()}`)
}

/**
 * 账户充值
 */
export async function rechargeAccount(params: RechargeParams): Promise<{
  success: boolean
  message: string
  orderId?: string
  paymentUrl?: string
}> {
  return apiRequest(`${API_BASE_URL}/v1/billing/recharge`, {
    method: "POST",
    body: JSON.stringify(params),
  })
}

/**
 * 账户消费
 */
export async function consumeAccount(params: ConsumeParams): Promise<{
  success: boolean
  message: string
  remainingBalance: number
}> {
  return apiRequest(`${API_BASE_URL}/v1/billing/consume`, {
    method: "POST",
    body: JSON.stringify(params),
  })
}

/**
 * 获取账户余额
 */
export async function getAccountBalance(): Promise<{ balance: number }> {
  return apiRequest(`${API_BASE_URL}/v1/billing/balance`)
}

/**
 * 检查余额是否足够
 */
export async function checkBalance(amount: number): Promise<{ sufficient: boolean; balance: number }> {
  return apiRequest(`${API_BASE_URL}/v1/billing/balance/check?amount=${amount}`)
}
