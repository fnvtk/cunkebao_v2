"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Phone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { WeChatIcon } from "@/components/icons/wechat-icon"
import { AppleIcon } from "@/components/icons/apple-icon"
import { useToast } from "@/components/ui/use-toast"

interface LoginForm {
  phone: string
  password: string
  verificationCode: string
  agreeToTerms: boolean
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<"password" | "verification">("password")
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<LoginForm>({
    phone: "",
    password: "",
    verificationCode: "",
    agreeToTerms: false,
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, agreeToTerms: checked }))
  }

  const validateForm = () => {
    if (!form.phone) {
      toast({
        variant: "destructive",
        title: "请输入手机号",
        description: "手机号不能为空",
      })
      return false
    }

    if (!form.agreeToTerms) {
      toast({
        variant: "destructive",
        title: "请同意用户协议",
        description: "需要同意用户协议和隐私政策才能继续",
      })
      return false
    }

    if (activeTab === "password" && !form.password) {
      toast({
        variant: "destructive",
        title: "请输入密码",
        description: "密码不能为空",
      })
      return false
    }

    if (activeTab === "verification" && !form.verificationCode) {
      toast({
        variant: "destructive",
        title: "请输入验证码",
        description: "验证码不能为空",
      })
      return false
    }

    return true
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 成功后跳转
      router.push("/profile")

      toast({
        title: "登录成功",
        description: "欢迎回来！",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "登录失败",
        description: "请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendVerificationCode = async () => {
    if (!form.phone) {
      toast({
        variant: "destructive",
        title: "请输入手机号",
        description: "发送验证码需要手机号",
      })
      return
    }

    setIsLoading(true)
    try {
      // 模拟发送验证码
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "验证码已发送",
        description: "请查看手机短信",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "发送失败",
        description: "请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col px-4 py-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <Tabs
          defaultValue="password"
          className="w-full"
          onValueChange={(v) => setActiveTab(v as "password" | "verification")}
        >
          <TabsList className="w-full bg-transparent border-b border-gray-200">
            <TabsTrigger
              value="verification"
              className="flex-1 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 border-b-2 border-transparent"
            >
              验证码登录
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="flex-1 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 border-b-2 border-transparent"
            >
              密码登录
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <p className="text-gray-600 mb-6">你所在地区仅支持 手机号 / 微信 / Apple 登录</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="手机号"
                  className="pl-16 border-gray-300 text-gray-900 h-12"
                  disabled={isLoading}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  +86
                </span>
              </div>

              <TabsContent value="password" className="m-0">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="密码"
                    className="pr-12 border-gray-300 text-gray-900 h-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="verification" className="m-0">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    name="verificationCode"
                    value={form.verificationCode}
                    onChange={handleInputChange}
                    placeholder="验证码"
                    className="border-gray-300 text-gray-900 h-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-32 h-12 border-gray-300 text-gray-600 hover:text-gray-900"
                    onClick={handleSendVerificationCode}
                    disabled={isLoading}
                  >
                    发送验证码
                  </Button>
                </div>
              </TabsContent>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={form.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                  className="border-gray-300 data-[state=checked]:bg-blue-500"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  已阅读并同意
                  <a href="#" className="text-blue-500 mx-1">
                    用户协议
                  </a>
                  与
                  <a href="#" className="text-blue-500 ml-1">
                    隐私政策
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">或</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <WeChatIcon className="w-6 h-6 mr-2 text-[#07C160]" />
                  使用微信登录
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <AppleIcon className="w-6 h-6 mr-2" />
                  使用 Apple 登录
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <a href="#" className="text-sm text-gray-500">
                联系我们
              </a>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

