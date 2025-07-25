// API 基础配置
export const API_CONFIG = {
  // 基础URL配置
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://ckbapi.quwanzhi.com",

  // API版本
  VERSION: "v1",

  // 请求超时时间（毫秒）
  TIMEOUT: 30000,

  // 重试次数
  RETRY_COUNT: 3,

  // 重试延迟（毫秒）
  RETRY_DELAY: 1000,
}

// API 端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },

  // 用户管理
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
    DETAIL: "/users/:id",
  },

  // 客户管理
  CUSTOMERS: {
    LIST: "/customers",
    CREATE: "/customers",
    BATCH_CREATE: "/customers/batch",
    UPDATE: "/customers/:id",
    DELETE: "/customers/:id",
    DETAIL: "/customers/:id",
    IMPORT: "/customers/import",
    EXPORT: "/customers/export",
  },

  // 场景管理
  SCENARIOS: {
    LIST: "/scenarios",
    CREATE: "/scenarios",
    UPDATE: "/scenarios/:id",
    DELETE: "/scenarios/:id",
    DETAIL: "/scenarios/:id",
    START: "/scenarios/:id/start",
    STOP: "/scenarios/:id/stop",
    PAUSE: "/scenarios/:id/pause",
    COPY: "/scenarios/:id/copy",
    STATS: "/scenarios/:id/stats",
    API_CONFIG: "/scenarios/:id/api-config",
  },

  // 设备管理
  DEVICES: {
    LIST: "/devices",
    CREATE: "/devices",
    UPDATE: "/devices/:id",
    DELETE: "/devices/:id",
    DETAIL: "/devices/:id",
    STATUS: "/devices/:id/status",
    HEARTBEAT: "/devices/:id/heartbeat",
    LOGS: "/devices/:id/logs",
  },

  // 微信账号管理
  WECHAT_ACCOUNTS: {
    LIST: "/wechat-accounts",
    CREATE: "/wechat-accounts",
    UPDATE: "/wechat-accounts/:id",
    DELETE: "/wechat-accounts/:id",
    DETAIL: "/wechat-accounts/:id",
    LOGIN: "/wechat-accounts/:id/login",
    LOGOUT: "/wechat-accounts/:id/logout",
    FRIENDS: "/wechat-accounts/:id/friends",
    GROUPS: "/wechat-accounts/:id/groups",
  },

  // 流量池管理
  TRAFFIC_POOLS: {
    LIST: "/traffic-pools",
    CREATE: "/traffic-pools",
    UPDATE: "/traffic-pools/:id",
    DELETE: "/traffic-pools/:id",
    DETAIL: "/traffic-pools/:id",
    KEYWORDS: "/traffic-pools/:id/keywords",
    STATS: "/traffic-pools/:id/stats",
  },

  // 内容库管理
  CONTENT_LIBRARY: {
    LIST: "/content-library",
    CREATE: "/content-library",
    UPDATE: "/content-library/:id",
    DELETE: "/content-library/:id",
    DETAIL: "/content-library/:id",
    TAGS: "/content-library/tags",
    CATEGORIES: "/content-library/categories",
  },

  // 工作空间
  WORKSPACE: {
    MOMENTS_SYNC: "/workspace/moments-sync",
    GROUP_PUSH: "/workspace/group-push",
    AUTO_LIKE: "/workspace/auto-like",
    AUTO_GROUP: "/workspace/auto-group",
    GROUP_SYNC: "/workspace/group-sync",
    TRAFFIC_DISTRIBUTION: "/workspace/traffic-distribution",
    AI_ASSISTANT: "/workspace/ai-assistant",
    AI_ANALYZER: "/workspace/ai-analyzer",
    AI_STRATEGY: "/workspace/ai-strategy",
  },

  // 统计数据
  STATISTICS: {
    DASHBOARD: "/statistics/dashboard",
    SCENARIOS: "/statistics/scenarios",
    DEVICES: "/statistics/devices",
    CUSTOMERS: "/statistics/customers",
    DAILY: "/statistics/daily",
    MONTHLY: "/statistics/monthly",
  },

  // 系统配置
  SYSTEM: {
    CONFIG: "/system/config",
    LOGS: "/system/logs",
    HEALTH: "/system/health",
    VERSION: "/system/version",
  },

  // 计费管理
  BILLING: {
    ACCOUNT_INFO: "/billing/account",
    RECORDS: "/billing/records",
    RECHARGE: "/billing/recharge",
    CONSUME: "/billing/consume",
    BALANCE: "/billing/balance",
  },
}

// 本地存储键名配置
export const STORAGE_KEYS = {
  // 认证相关
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",

  // 用户偏好
  THEME: "theme",
  LANGUAGE: "language",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",

  // 缓存数据
  SCENARIOS_CACHE: "scenarios_cache",
  DEVICES_CACHE: "devices_cache",
  CUSTOMERS_CACHE: "customers_cache",

  // 临时数据
  FORM_DRAFT: "form_draft",
  SEARCH_HISTORY: "search_history",
  FILTER_SETTINGS: "filter_settings",
}

// HTTP 状态码配置
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
}

// 错误码配置
export const ERROR_CODES = {
  // 通用错误
  SUCCESS: 0,
  UNKNOWN_ERROR: 1000,
  NETWORK_ERROR: 1001,
  TIMEOUT_ERROR: 1002,

  // 认证错误
  AUTH_FAILED: 2001,
  TOKEN_EXPIRED: 2002,
  TOKEN_INVALID: 2003,
  PERMISSION_DENIED: 2004,

  // 参数错误
  INVALID_PARAMS: 3001,
  MISSING_PARAMS: 3002,
  INVALID_FORMAT: 3003,

  // 业务错误
  RESOURCE_NOT_FOUND: 4001,
  RESOURCE_ALREADY_EXISTS: 4002,
  RESOURCE_IN_USE: 4003,
  OPERATION_FAILED: 4004,

  // 系统错误
  DATABASE_ERROR: 5001,
  CACHE_ERROR: 5002,
  EXTERNAL_API_ERROR: 5003,
  FILE_UPLOAD_ERROR: 5004,
}

// 错误消息配置
export const ERROR_MESSAGES = {
  [ERROR_CODES.SUCCESS]: "操作成功",
  [ERROR_CODES.UNKNOWN_ERROR]: "未知错误",
  [ERROR_CODES.NETWORK_ERROR]: "网络连接失败",
  [ERROR_CODES.TIMEOUT_ERROR]: "请求超时",

  [ERROR_CODES.AUTH_FAILED]: "认证失败",
  [ERROR_CODES.TOKEN_EXPIRED]: "登录已过期，请重新登录",
  [ERROR_CODES.TOKEN_INVALID]: "登录信息无效",
  [ERROR_CODES.PERMISSION_DENIED]: "权限不足",

  [ERROR_CODES.INVALID_PARAMS]: "参数错误",
  [ERROR_CODES.MISSING_PARAMS]: "缺少必要参数",
  [ERROR_CODES.INVALID_FORMAT]: "参数格式错误",

  [ERROR_CODES.RESOURCE_NOT_FOUND]: "资源不存在",
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: "资源已存在",
  [ERROR_CODES.RESOURCE_IN_USE]: "资源正在使用中",
  [ERROR_CODES.OPERATION_FAILED]: "操作失败",

  [ERROR_CODES.DATABASE_ERROR]: "数据库错误",
  [ERROR_CODES.CACHE_ERROR]: "缓存错误",
  [ERROR_CODES.EXTERNAL_API_ERROR]: "外部接口错误",
  [ERROR_CODES.FILE_UPLOAD_ERROR]: "文件上传失败",
}

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
}

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/avi", "video/mov"],
  ALLOWED_AUDIO_TYPES: ["audio/mp3", "audio/wav", "audio/aac"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
}

// WebSocket 配置
export const WEBSOCKET_CONFIG = {
  URL: process.env.NEXT_PUBLIC_WS_URL || "wss://ckbapi.quwanzhi.com/ws",
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 30000,
}

// 缓存配置
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5分钟
  LONG_TTL: 30 * 60 * 1000, // 30分钟
  SHORT_TTL: 1 * 60 * 1000, // 1分钟
}

// 导出所有配置
export default {
  API_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  HTTP_STATUS,
  ERROR_CODES,
  ERROR_MESSAGES,
  PAGINATION_CONFIG,
  UPLOAD_CONFIG,
  WEBSOCKET_CONFIG,
  CACHE_CONFIG,
}
