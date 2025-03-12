"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { ContentLibrary, ContentLibraryResponse, ContentLibrarySelectResponse } from "@/types/content-library"

interface ContentSelectorProps {
  formData: any
  onChange: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function ContentSelector({ formData, onChange, onNext, onPrev }: ContentSelectorProps) {
  const [libraries, setLibraries] = useState<ContentLibrary[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchContentLibraries()
  }, [])

  const fetchContentLibraries = async () => {
    setLoading(true)
    try {
      // 实际项目中这里应该调用API
      const response: ContentLibraryResponse = {
        code: 0,
        message: "success",
        data: {
          libraries: [
            {
              id: "1",
              name: "微信好友广告",
              source: "微信",
              creator: "海尼",
              contentCount: 0,
              lastUpdated: "2024-02-09 12:30",
              type: "moments",
              status: "inactive",
            },
            {
              id: "2",
              name: "开发群",
              source: "微信",
              creator: "karuo",
              contentCount: 0,
              lastUpdated: "2024-02-09 12:30",
              type: "group",
              status: "inactive",
            },
          ],
          total: 2,
        },
      }

      if (response.code === 0) {
        setLibraries(response.data.libraries)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      toast({
        title: "获取失败",
        description: "无法获取内容库列表",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchContentLibraries()
  }

  const filteredLibraries = libraries.filter((library) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "friends" && library.type === "moments") ||
      (activeTab === "groups" && library.type === "group")
    const matchesSearch = library.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleSelectLibrary = async (library: ContentLibrary) => {
    try {
      // 实际项目中这里应该调用API
      const response: ContentLibrarySelectResponse = {
        code: 0,
        message: "success",
        data: {
          success: true,
          libraryId: library.id,
          name: library.name,
        },
      }

      if (response.code === 0 && response.data.success) {
        onChange({
          ...formData,
          selectedLibrary: library.id,
          contentFormat: library.type,
        })
        setIsDialogOpen(false)
        toast({
          title: "选择成功",
          description: `已选择内容库：${library.name}`,
        })
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      toast({
        title: "选择失败",
        description: "无法选择内容库",
        variant: "destructive",
      })
    }
  }

  const handleFinish = async () => {
    try {
      // 实际项目中这里应该调用API创建计划
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "创建成功",
        description: "新计划已创建",
      })
      onNext()
    } catch (error) {
      toast({
        title: "创建失败",
        description: "无法创建新计划",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {formData.selectedLibrary
                ? `已选择：${libraries.find((lib) => lib.id === formData.selectedLibrary)?.name}`
                : "选择内容库"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>选择内容库</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索内容库..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>

              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="friends">微信好友</TabsTrigger>
                  <TabsTrigger value="groups">聊天群</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                {filteredLibraries.map((library) => (
                  <div
                    key={library.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                      formData.selectedLibrary === library.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-500"
                    }`}
                    onClick={() => handleSelectLibrary(library)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{library.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-2">
                          <span>来源：{library.source}</span>
                          <span>•</span>
                          <span>创建人：{library.creator}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">内容数量：{library.contentCount}</Badge>
                          <Badge variant="outline">更新时间：{new Date(library.lastUpdated).toLocaleString()}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className={library.status === "inactive" ? "bg-gray-100" : ""}>
                      {library.status === "active" ? "启用" : "已停用"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            上一步
          </Button>
          <Button onClick={handleFinish} disabled={!formData.selectedLibrary}>
            完成
          </Button>
        </div>
      </div>
    </Card>
  )
}

