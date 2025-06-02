"use client"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface LoginErrorHandlerProps {
  onRetry?: () => void
}

export function LoginErrorHandler({ onRetry }: LoginErrorHandlerProps) {
  const { toast } = useToast()
  const router = useRouter()

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => {
      toast({
        title: "网络已恢复",
        description: "您可以继续登录",
      })
    }

    const handleOffline = () => {
      toast({
        variant: "destructive",
        title: "网络连接已断开",
        description: "请检查您的网络连接后重试",
        action: onRetry
          ? {
              label: "重试",
              onClick: onRetry,
            }
          : undefined,
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast, onRetry])

  // 处理401错误（未授权）
  useEffect(() => {
    const handleUnauthorized = (event: MessageEvent) => {
      if (event.data === "UNAUTHORIZED") {
        toast({
          variant: "destructive",
          title: "登录已过期",
          description: "请重新登录",
        })

        // 清除本地存储的登录信息
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        // 重定向到登录页
        router.push("/login")
      }
    }

    window.addEventListener("message", handleUnauthorized)

    return () => {
      window.removeEventListener("message", handleUnauthorized)
    }
  }, [toast, router])

  return null
}
