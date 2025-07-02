// 存储键名常量
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
  DEVICE_ID: "device_id",
  LAST_LOGIN: "last_login",
} as const

// API错误码常量
export const ERROR_CODES = {
  SUCCESS: 0,
  INVALID_PARAMS: 1001,
  UNAUTHORIZED: 1002,
  FORBIDDEN: 1003,
  NOT_FOUND: 1004,
  SERVER_ERROR: 1005,
  NETWORK_ERROR: 1006,
  TIMEOUT: 1007,
  INVALID_TOKEN: 1008,
  TOKEN_EXPIRED: 1009,
} as const

// API配置
export const API_CONFIG = {
  // 基础配置
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://ckbapi.quwanzhi.com",
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,

  // 错误码
  ERROR_CODES,

  // 存储键名
  STORAGE_KEYS,

  // 错误消息映射
  ERROR_MESSAGES: {
    [ERROR_CODES.SUCCESS]: "操作成功",
    [ERROR_CODES.INVALID_PARAMS]: "参数错误",
    [ERROR_CODES.UNAUTHORIZED]: "未授权访问",
    [ERROR_CODES.FORBIDDEN]: "禁止访问",
    [ERROR_CODES.NOT_FOUND]: "资源不存在",
    [ERROR_CODES.SERVER_ERROR]: "服务器内部错误",
    [ERROR_CODES.NETWORK_ERROR]: "网络连接失败",
    [ERROR_CODES.TIMEOUT]: "请求超时",
    [ERROR_CODES.INVALID_TOKEN]: "无效的访问令牌",
    [ERROR_CODES.TOKEN_EXPIRED]: "访问令牌已过期",
  },

  // API端点
  ENDPOINTS: {
    // 认证相关
    AUTH: {
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
      CAPTCHA: "/api/auth/captcha",
      VERIFY: "/api/auth/verify",
    },

    // 场景获客
    SCENARIOS: {
      LIST: "/api/scenarios",
      CREATE: "/api/scenarios",
      UPDATE: "/api/scenarios/:id",
      DELETE: "/api/scenarios/:id",
      START: "/api/scenarios/:id/start",
      PAUSE: "/api/scenarios/:id/pause",
      STATS: "/api/scenarios/:id/stats",
    },

    // 设备管理
    DEVICES: {
      LIST: "/api/devices",
      CREATE: "/api/devices",
      UPDATE: "/api/devices/:id",
      DELETE: "/api/devices/:id",
      STATUS: "/api/devices/:id/status",
    },

    // 微信账号
    WECHAT: {
      LIST: "/api/wechat/accounts",
      CREATE: "/api/wechat/accounts",
      UPDATE: "/api/wechat/accounts/:id",
      DELETE: "/api/wechat/accounts/:id",
      BIND: "/api/wechat/accounts/:id/bind",
      UNBIND: "/api/wechat/accounts/:id/unbind",
    },

    // 流量池
    TRAFFIC: {
      LIST: "/api/traffic/pools",
      CREATE: "/api/traffic/pools",
      UPDATE: "/api/traffic/pools/:id",
      DELETE: "/api/traffic/pools/:id",
      STATS: "/api/traffic/pools/:id/stats",
    },

    // 内容库
    CONTENT: {
      LIST: "/api/content/library",
      CREATE: "/api/content/library",
      UPDATE: "/api/content/library/:id",
      DELETE: "/api/content/library/:id",
      UPLOAD: "/api/content/upload",
    },
  },
} as const

// 请求头配置
export const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
} as const

// 响应状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const
