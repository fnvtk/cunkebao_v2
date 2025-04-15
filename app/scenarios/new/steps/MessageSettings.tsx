"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, Plus, Trash2 } from "lucide-react"

export interface Message {
  id: string
  type: "text" | "image" | "link"
  content: string
}

export interface MessageSettingsProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  welcomeMessage: string
  setWelcomeMessage: (message: string) => void
}

export function MessageSettings({ messages, setMessages, welcomeMessage, setWelcomeMessage }: MessageSettingsProps) {
  const addMessage = (type: "text" | "image" | "link") => {
    setMessages([...messages, { id: Math.random().toString(36).substring(2, 9), type, content: "" }])
  }

  const updateMessage = (id: string, content: string) => {
    setMessages(messages.map((message) => (message.id === id ? { ...message, content } : message)))
  }

  const removeMessage = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="welcome">欢迎消息</Label>
            <Textarea
              id="welcome"
              placeholder="好友添加成功后发送的第一条消息"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label>消息序列</Label>
            <p className="text-xs text-gray-500">设置自动发送的消息序列，按顺序发送</p>
          </div>

          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-2">
                {message.type === "text" && (
                  <Textarea
                    placeholder="输入文本消息"
                    value={message.content}
                    onChange={(e) => updateMessage(message.id, e.target.value)}
                    className="flex-1"
                  />
                )}
                {message.type === "image" && (
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="图片URL"
                        value={message.content}
                        onChange={(e) => updateMessage(message.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon" type="button">
                        <Upload size={16} />
                      </Button>
                    </div>
                    {message.content && (
                      <div className="relative w-20 h-20">
                        <img
                          src={message.content || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover rounded border"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {message.type === "link" && (
                  <Input
                    placeholder="输入链接URL"
                    value={message.content}
                    onChange={(e) => updateMessage(message.id, e.target.value)}
                    className="flex-1"
                  />
                )}
                <Button variant="ghost" size="icon" type="button" onClick={() => removeMessage(message.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => addMessage("text")}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              添加文本
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => addMessage("image")}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              添加图片
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => addMessage("link")}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              添加链接
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

