"use client"

import { CardDescription } from "@/components/ui/card"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2, Shield, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { loginWithPassword, loginWithCode, sendVerificationCode, saveUserInfo, checkLoginStatus } from "@/lib/api/auth"

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()

  // 状态管理
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [activeTab, setActiveTab] = useState("password")

  // 密码登录表单
  const [passwordForm, setPasswordForm] = useState({
    account: "",
    password: "",
  })

  // 验证码登录表单
  const [codeForm, setCodeForm] = useState({
    account: "",
    code: "",
  })

  // 检查是否已登录
  useEffect(() => {
    if (checkLoginStatus()) {
      router.push("/")
    }
  }, [router])

  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // 密码登录
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordForm.account || !passwordForm.password) {
      toast({
        title: "参数错误",
        description: "请输入账号和密码",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("开始密码登录:", passwordForm.account)

      const result = await loginWithPassword(passwordForm.account, passwordForm.password)

      console.log("登录成功:", result)

      // 保存登录信息
      if (result?.data?.token && result?.data?.user) {
        saveUserInfo(result.data.token, result.data.user)

        toast({
          title: "登录成功",
          description: `欢迎回来，${result.data.user.nickname || result.data.user.username}！`,
        })

        // 跳转到首页
        router.push("/")
      } else {
        throw new Error("登录响应数据格式错误")
      }
    } catch (error) {
      console.error("密码登录失败:", error)
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "登录失败，请检查账号密码",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 发送验证码
  const handleSendCode = async () => {
    if (!codeForm.account) {
      toast({
        title: "参数错误",
        description: "请输入手机号",
        variant: "destructive",
      })
      return
    }

    if (countdown > 0) {
      return
    }

    try {
      console.log("发送验证码:", codeForm.account)

      await sendVerificationCode(codeForm.account)

      toast({
        title: "发送成功",
        description: "验证码已发送到您的手机",
      })

      // 开始倒计时
      setCountdown(60)
    } catch (error) {
      console.error("发送验证码失败:", error)
      toast({
        title: "发送失败",
        description: error instanceof Error ? error.message : "发送验证码失败",
        variant: "destructive",
      })
    }
  }

  // 验证码登录
  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!codeForm.account || !codeForm.code) {
      toast({
        title: "参数错误",
        description: "请输入手机号和验证码",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("开始验证码登录:", codeForm.account)

      const result = await loginWithCode(codeForm.account, codeForm.code)

      console.log("登录成功:", result)

      // 保存登录信息
      if (result?.data?.token && result?.data?.user) {
        saveUserInfo(result.data.token, result.data.user)

        toast({
          title: "登录成功",
          description: `欢迎回来，${result.data.user.nickname || result.data.user.username}！`,
        })

        // 跳转到首页
        router.push("/")
      } else {
        throw new Error("登录响应数据格式错误")
      }
    } catch (error) {
      console.error("验证码登录失败:", error)
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "登录失败，请检查验证码",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 键盘事件处理
  const handleKeyPress = (e: React.KeyboardEvent, formType: "password" | "code") => {
    if (e.key === "Enter") {
      if (formType === "password") {
        handlePasswordLogin(e as any)
      } else {
        handleCodeLogin(e as any)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">存客宝</CardTitle>
          <CardDescription className="text-gray-600">智能获客管理平台</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>密码登录</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>验证码登录</span>
              </TabsTrigger>
            </TabsList>

            {/* 密码登录 */}
            <TabsContent value="password" className="space-y-4">
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account">账号</Label>
                  <Input
                    id="account"
                    type="text"
                    placeholder="请输入手机号或用户名"
                    value={passwordForm.account}
                    onChange={(e) => setPasswordForm({ ...passwordForm, account: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, "password")}
                    disabled={isLoading}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入密码"
                      value={passwordForm.password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, "password")}
                      disabled={isLoading}
                      className="h-12 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "登录中..." : "登录"}
                </Button>
              </form>
            </TabsContent>

            {/* 验证码登录 */}
            <TabsContent value="code" className="space-y-4">
              <form onSubmit={handleCodeLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={codeForm.account}
                    onChange={(e) => setCodeForm({ ...codeForm, account: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, "code")}
                    disabled={isLoading}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">验证码</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="code"
                      type="text"
                      placeholder="请输入验证码"
                      value={codeForm.code}
                      onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value })}
                      onKeyPress={(e) => handleKeyPress(e, "code")}
                      disabled={isLoading}
                      className="h-12"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendCode}
                      disabled={isLoading || countdown > 0 || !codeForm.account}
                      className="h-12 whitespace-nowrap min-w-[100px]"
                    >
                      {countdown > 0 ? `${countdown}s` : "发送验证码"}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "登录中..." : "登录"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* 登录提示 */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>登录即表示您同意我们的服务条款和隐私政策</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
