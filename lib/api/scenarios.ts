/**
 * 场景获客相关API接口
 */
import { apiClient, type PaginatedResponse, type PaginationParams } from "./client"

export interface ScenarioBase {
  id: string
  name: string
  type:
    | "douyin"
    | "kuaishou"
    | "xiaohongshu"
    | "weibo"
    | "haibao"
    | "phone"
    | "gongzhonghao"
    | "weixinqun"
    | "payment"
    | "api"
  status: "running" | "paused" | "completed" | "draft"
  description?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface ScenarioStats {
  deviceCount: number
  acquiredCount: number
  addedCount: number
  passRate: number
  todayAcquired: number
  todayAdded: number
}

export interface ScenarioDetail extends ScenarioBase {
  config: Record<string, any>
  stats: ScenarioStats
  devices: string[]
  lastExecutedAt?: string
  nextExecuteAt?: string
}

export interface CreateScenarioRequest {
  name: string
  type: ScenarioBase["type"]
  description?: string
  config: Record<string, any>
  devices: string[]
}

export interface UpdateScenarioRequest extends Partial<CreateScenarioRequest> {
  id: string
  status?: ScenarioBase["status"]
}

export interface ScenarioQueryParams extends PaginationParams {
  type?: ScenarioBase["type"]
  status?: ScenarioBase["status"]
  keyword?: string
  startDate?: string
  endDate?: string
}

/**
 * 场景获客API类
 */
class ScenarioApi {
  /**
   * 查询场景列表
   */
  async query(params: ScenarioQueryParams) {
    return apiClient.get<PaginatedResponse<ScenarioBase>>("/scenarios", params)
  }

  /**
   * 获取场景详情
   */
  async getById(id: string) {
    return apiClient.get<ScenarioDetail>(`/scenarios/${id}`)
  }

  /**
   * 创建场景
   */
  async create(data: CreateScenarioRequest) {
    return apiClient.post<ScenarioDetail>("/scenarios", data)
  }

  /**
   * 更新场景
   */
  async update(data: UpdateScenarioRequest) {
    return apiClient.put<ScenarioDetail>(`/scenarios/${data.id}`, data)
  }

  /**
   * 删除场景
   */
  async delete(id: string) {
    return apiClient.delete(`/scenarios/${id}`)
  }

  /**
   * 复制场景
   */
  async copy(id: string, name: string) {
    return apiClient.post<ScenarioDetail>(`/scenarios/${id}/copy`, { name })
  }

  /**
   * 启动场景
   */
  async start(id: string) {
    return apiClient.post(`/scenarios/${id}/start`)
  }

  /**
   * 暂停场景
   */
  async pause(id: string) {
    return apiClient.post(`/scenarios/${id}/pause`)
  }

  /**
   * 获取场景统计数据
   */
  async getStats(id: string, dateRange?: { startDate: string; endDate: string }) {
    return apiClient.get<ScenarioStats>(`/scenarios/${id}/stats`, dateRange)
  }

  /**
   * 获取场景执行日志
   */
  async getLogs(id: string, params: PaginationParams) {
    return apiClient.get<PaginatedResponse<any>>(`/scenarios/${id}/logs`, params)
  }

  /**
   * 获取API接口配置
   */
  async getApiConfig(id: string) {
    return apiClient.get<{
      apiKey: string
      webhookUrl: string
      enabled: boolean
    }>(`/scenarios/${id}/api-config`)
  }

  /**
   * 更新API接口配置
   */
  async updateApiConfig(id: string, config: { enabled: boolean }) {
    return apiClient.put(`/scenarios/${id}/api-config`, config)
  }

  /**
   * 重新生成API密钥
   */
  async regenerateApiKey(id: string) {
    return apiClient.post<{ apiKey: string }>(`/scenarios/${id}/regenerate-api-key`)
  }
}

export const scenarioApi = new ScenarioApi()
