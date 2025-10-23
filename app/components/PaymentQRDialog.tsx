"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Smartphone, Clock, CheckCircle, XCircle, RefreshCw, Copy, AlertTriangle } from "lucide-react"

interface PaymentQRDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageInfo: {
    id: string
    name: string
    amount: number
    price: number
    validity: number
    discount?: number
  }
}

type PaymentStatus = "pending" | "success" | "failed" | "expired"
type PaymentMethod = "wechat" | "alipay"

export function PaymentQRDialog({ open, onOpenChange, packageInfo }: PaymentQRDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wechat")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
  const [countdown, setCountdown] = useState(300) // 5分钟倒计时
  const [orderId, setOrderId] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  // 生成订单ID和二维码
  useEffect(() => {
    if (open) {
      const newOrderId = `CKB${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      setOrderId(newOrderId)

      // 模拟生成二维码URL
      const mockQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `${paymentMethod}://pay?orderId=${newOrderId}&amount=${packageInfo.price}&product=${packageInfo.name}`,
      )}`
      setQrCodeUrl(mockQRCode)

      // 重置状态
      setPaymentStatus("pending")
      setCountdown(300)
    }
  }, [open, paymentMethod, packageInfo])

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (open && paymentStatus === "pending" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setPaymentStatus("expired")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [open, paymentStatus, countdown])

  // 模拟支付状态检查
  useEffect(() => {
    let statusTimer: NodeJS.Timeout
    if (open && paymentStatus === "pending") {
      statusTimer = setInterval(() => {
        // 模拟随机支付成功（实际应该调用后端API检查支付状态）
        if (Math.random() > 0.95) {
          setPaymentStatus("success")
        }
      }, 2000)
    }
    return () => clearInterval(statusTimer)
  }, [open, paymentStatus])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    // 这里可以添加toast提示
  }

  const handleRefreshQR = () => {
    setCountdown(300)
    setPaymentStatus("pending")
    const newOrderId = `CKB${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    setOrderId(newOrderId)

    const mockQRCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `${paymentMethod}://pay?orderId=${newOrderId}&amount=${packageInfo.price}&product=${packageInfo.name}`,
    )}`
    setQrCodeUrl(mockQRCode)
  }

  const handleClose = () => {
    onOpenChange(false)
    // 延迟重置状态，避免关闭动画时看到状态变化
    setTimeout(() => {
      setPaymentStatus("pending")
      setCountdown(300)
    }, 300)
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />
      case "failed":
        return <XCircle className="h-12 w-12 text-red-500" />
      case "expired":
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />
      default:
        return <Clock className="h-12 w-12 text-blue-500" />
    }
  }

  const getStatusText = () => {
    switch (paymentStatus) {
      case "success":
        return "支付成功"
      case "failed":
        return "支付失败"
      case "expired":
        return "二维码已过期"
      default:
        return "等待支付"
    }
  }

  const getStatusDescription = () => {
    switch (paymentStatus) {
      case "success":
        return "算力包已成功添加到您的账户"
      case "failed":
        return "支付过程中出现问题，请重试"
      case "expired":
        return "请刷新二维码重新支付"
      default:
        return `请在 ${formatTime(countdown)} 内完成支付`
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">购买算力包</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 商品信息 */}
          <Card className="bg-gray-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{packageInfo.name}</h3>
                  <p className="text-sm text-gray-600">{packageInfo.amount.toLocaleString()} 算力点</p>
                  <p className="text-xs text-gray-500">有效期 {packageInfo.validity} 天</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-600">¥{packageInfo.price}</div>
                  {packageInfo.discount && (
                    <Badge variant="destructive" className="text-xs">
                      -{packageInfo.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogHeader>

        <div className="space-y-4">
          {paymentStatus === "pending" && (
            <>
              {/* 支付方式选择 */}
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wechat" className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">微</span>
                    </div>
                    <span>微信支付</span>
                  </TabsTrigger>
                  <TabsTrigger value="alipay" className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">支</span>
                    </div>
                    <span>支付宝</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="wechat" className="mt-4">
                  <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-200">
                      <img
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt="微信支付二维码"
                        className="w-48 h-48 mx-auto"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=192&width=192&text=微信支付二维码"
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-sm">请使用微信扫码支付</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="alipay" className="mt-4">
                  <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-200">
                      <img
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt="支付宝支付二维码"
                        className="w-48 h-48 mx-auto"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=192&width=192&text=支付宝二维码"
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-sm">请使用支付宝扫码支付</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* 倒计时和订单信息 */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">支付剩余时间</span>
                    </div>
                    <div className="font-mono text-blue-900 font-bold">{formatTime(countdown)}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-blue-700">订单号:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-blue-900">{orderId}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyOrderId}
                        className="h-6 w-6 text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* 支付状态显示 */}
          {paymentStatus !== "pending" && (
            <div className="text-center space-y-4 py-8">
              {getStatusIcon()}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{getStatusText()}</h3>
                <p className="text-sm text-gray-600">{getStatusDescription()}</p>
              </div>

              {paymentStatus === "expired" && (
                <Button onClick={handleRefreshQR} className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新二维码
                </Button>
              )}

              {paymentStatus === "success" && (
                <div className="space-y-3">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-3">
                      <div className="text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>算力包:</span>
                          <span className="font-medium">{packageInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>算力点数:</span>
                          <span className="font-medium">+{packageInfo.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>有效期:</span>
                          <span className="font-medium">{packageInfo.validity}天</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Button onClick={handleClose} className="w-full">
                    完成
                  </Button>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="space-y-3">
                  <Button onClick={handleRefreshQR} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重新支付
                  </Button>
                  <Button onClick={handleClose} variant="ghost">
                    取消
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 支付说明 */}
          {paymentStatus === "pending" && (
            <Card className="bg-gray-50">
              <CardContent className="p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">支付说明</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>• 请在5分钟内完成支付，超时后需重新生成二维码</p>
                  <p>• 支付成功后算力将立即到账</p>
                  <p>• 如遇问题请联系客服：400-123-4567</p>
                  <p>• 支持7天无理由退款（未使用部分）</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
