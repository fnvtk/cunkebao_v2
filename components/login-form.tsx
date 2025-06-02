"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authenticate } from "@/lib/actions/auth-actions"

export default function LoginForm() {
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const result = await authenticate(account, password)

      if (result?.error) {
        toast({
          title: "登录失败",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "登录成功",
          description: "正在跳转...",
        })
        router.push("/profile")
      }
    } catch (error) {
      toast({
        title: "登录失败",
        description: "发生了一些错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>用户密码登录</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account">账号</Label>
            <Input
              id="account"
              placeholder="请输入账号"
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              placeholder="请输入密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button disabled={isLoading} className="w-full">
            {isLoading ? "登录中..." : "登录"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
