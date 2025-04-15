"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

export interface Tag {
  id: string
  name: string
  color: string
}

export interface TagSettingsProps {
  tags: Tag[]
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
  isAutoTag: boolean
  setIsAutoTag: (isAutoTag: boolean) => void
}

export function TagSettings({ tags, setTags, isAutoTag, setIsAutoTag }: TagSettingsProps) {
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim()) {
      // Generate a random color
      const colors = [
        "bg-red-100 text-red-800",
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-yellow-100 text-yellow-800",
        "bg-purple-100 text-purple-800",
        "bg-pink-100 text-pink-800",
        "bg-indigo-100 text-indigo-800",
        "bg-teal-100 text-teal-800",
      ]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      setTags([...tags, { id: Math.random().toString(36).substring(2, 9), name: newTag.trim(), color: randomColor }])
      setNewTag("")
    }
  }

  const removeTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-tag" className="cursor-pointer">
              启用自动标签
            </Label>
            <div className="flex items-center space-x-2">
              <div
                className={`px-2 py-1 rounded text-xs ${
                  isAutoTag ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
                onClick={() => setIsAutoTag(!isAutoTag)}
              >
                {isAutoTag ? "启用" : "禁用"}
              </div>
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="new-tag">添加标签</Label>
            <div className="flex gap-2">
              <Input
                id="new-tag"
                placeholder="输入新标签"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" onClick={addTag} disabled={!newTag.trim()}>
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>已添加标签</Label>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge key={tag.id} className={`${tag.color} flex items-center gap-1`}>
                    {tag.name}
                    <X size={14} className="cursor-pointer" onClick={() => removeTag(tag.id)} />
                  </Badge>
                ))
              ) : (
                <div className="text-sm text-gray-500">暂无标签</div>
              )}
            </div>
          </div>

          {isAutoTag && (
            <div className="p-3 bg-blue-50 rounded text-sm text-blue-800">
              启用自动标签后，系统将根据用户行为和互动自动为客户添加相应标签，便于后续精准运营。
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

