export interface ServiceAccount {
  id: string
  name: string
  avatar: string
}

export interface WechatGroup {
  id: string
  name: string
  avatar: string
  serviceAccount: ServiceAccount
}

export interface ContentTarget {
  id: string
  avatar: string
}

export interface ContentLibrary {
  id: string
  name: string
  targets: ContentTarget[]
}

export interface GroupPushTask {
  id: string
  name: string
  pushTimeStart: string
  pushTimeEnd: string
  dailyPushCount: number
  pushOrder: "earliest" | "latest"
  isLoopPush: boolean
  isImmediatePush: boolean
  isEnabled: boolean
  groups: WechatGroup[]
  contentLibraries: ContentLibrary[]
  createdAt: string
  updatedAt: string
}

