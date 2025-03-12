"use client"

import { useState } from "react"
import { Plus, Trash2, RefreshCw, MoreVertical, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import "regenerator-runtime/runtime"

interface GroupSync {
  id: string
  name: string
  targetGroup: string
  contentLib: string
  creator: string
  sentCount: number
  lastSyncTime: Date
  createTime: Date
  syncStatus: "pending" | "running" | "completed"
  enabled: boolean
}

const mockData: GroupSync[] = [
  {
    id: "1",
    name: "每日早安问候",
    targetGroup: "业务交流群1",
    contentLib: "早安问候语库",
    creator: "张三",
    sentCount: 156,
    lastSyncTime: new Date(),
    createTime: new Date(),
    syncStatus: "running",
    enabled: true,
  },
  {
    id: "2",
    name: "周末营销推广",
    targetGroup: "产品推广群",
    contentLib: "营销文案库",
    creator: "李四",
    sentCount: 89,
    lastSyncTime: new Date(),
    createTime: new Date(),
    syncStatus: "completed",
    enabled: true,
  },
]

export default function GroupSyncPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSelectAll = () => {
    if (selectedItems.length === mockData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(mockData.map((item) => item.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  return (
    <div className="flex-1 overflow-y-auto pb-16">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">社群同步</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled={selectedItems.length === 0}>
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新建
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox checked={selectedItems.length === mockData.length} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>社群同步名称</TableHead>
                  <TableHead>推送社群</TableHead>
                  <TableHead>内容库</TableHead>
                  <TableHead>新建人</TableHead>
                  <TableHead>已推送条数</TableHead>
                  <TableHead>上次推送时间</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>循环推送</TableHead>
                  <TableHead>启用</TableHead>
                  <TableHead className="w-12">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleSelectItem(item.id)}
                      />
                    </TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.targetGroup}</TableCell>
                    <TableCell>{item.contentLib}</TableCell>
                    <TableCell>{item.creator}</TableCell>
                    <TableCell>{item.sentCount}</TableCell>
                    <TableCell>{format(item.lastSyncTime, "yyyy-MM-dd HH:mm:ss")}</TableCell>
                    <TableCell>{format(item.createTime, "yyyy-MM-dd HH:mm:ss")}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.syncStatus === "running"
                            ? "bg-green-100 text-green-800"
                            : item.syncStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.syncStatus === "running" ? "进行中" : item.syncStatus === "pending" ? "待执行" : "已完成"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Check className={`h-4 w-4 ${item.enabled ? "text-green-500" : "text-gray-300"}`} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>编辑</DropdownMenuItem>
                          <DropdownMenuItem>删除</DropdownMenuItem>
                          <DropdownMenuItem>查看详情</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}

