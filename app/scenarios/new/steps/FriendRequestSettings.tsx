"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export interface FriendRequestSettingsProps {
  verificationMessage: string
  setVerificationMessage: (message: string) => void
  replyMessage: string
  setReplyMessage: (message: string) => void
  useAutoReply: boolean
  setUseAutoReply: (useAutoReply: boolean) => void
  autoReplyDelay: number
  setAutoReplyDelay: (delay: number) => void
}

export function FriendRequestSettings({
  verificationMessage,
  setVerificationMessage,
  replyMessage,
  setReplyMessage,
  useAutoReply,
  setUseAutoReply,
  autoReplyDelay,
  setAutoReplyDelay,
}: FriendRequestSettingsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="verification">好友验证消息</Label>
            <Textarea
              id="verification"
              placeholder="请输入好友验证消息"
              value={verificationMessage}
              onChange={(e) => setVerificationMessage(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">发送好友请求时显示的验证消息</p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-reply" className="cursor-pointer">
              自动回复
            </Label>
            <Switch id="auto-reply" checked={useAutoReply} onCheckedChange={setUseAutoReply} />
          </div>

          {useAutoReply && (
            <>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="reply-message">自动回复消息</Label>
                <Textarea
                  id="reply-message"
                  placeholder="对方通过好友请求后自动回复的内容"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="delay">回复延迟（秒）</Label>
                <Input
                  id="delay"
                  type="number"
                  min={0}
                  max={60}
                  placeholder="回复延迟时间"
                  value={autoReplyDelay}
                  onChange={(e) => setAutoReplyDelay(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500">设置回复消息的延迟时间，使交互更自然</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

