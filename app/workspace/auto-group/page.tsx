"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, Users, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog } from "@/components/ui/dialog"
import { NewPlanForm } from "./components/new-plan-form"

interface Plan {
  id: string
  name: string
  groupCount: number
  groupSize: number
  totalFriends: number
  tags: string[]
  status: "running" | "stopped" | "completed"
  lastUpdated: string
}

const mockPlans: Plan[] = [
  {
    id: "1",
    name: "品牌推广群",
    groupCount: 6,
    groupSize: 38,
    totalFriends: 228,
    tags: ["品牌", "推广"],
    status: "running",
    lastUpdated: "2024-02-24 10:30",
  },
  {
    id: "2",
    name: "客户服务群",
    groupCount: 4,
    groupSize: 50,
    totalFriends: 200,
    tags: ["客服", "售后"],
    status: "stopped",
    lastUpdated: "2024-02-23 15:45",
  },
]

export default function AutoGroupPage() {
  const [newPlanOpen, setNewPlanOpen] = useState(false)

  const getStatusColor = (status: Plan["status"]) => {
    switch (status) {
      case "running":
        return "bg-green-500/10 text-green-500"
      case "stopped":
        return "bg-red-500/10 text-red-500"
      case "completed":
        return "bg-blue-500/10 text-blue-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getStatusText = (status: Plan["status"]) => {
    switch (status) {
      case "running":
        return "运行中"
      case "stopped":
        return "已停止"
      case "completed":
        return "已完成"
      default:
        return status
    }
  }

  return (
    <div className="container p-4 mx-auto max-w-md">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">微信自动拉群</h1>
          <Button onClick={() => setNewPlanOpen(true)} className="bg-blue-500 hover:bg-blue-600">
            <PlusCircle className="w-4 h-4 mr-2" />
            新建计划
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">进行中</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {mockPlans.map((plan) => (
                  <Card key={plan.id} className="border border-gray-100">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">{plan.name}</CardTitle>
                        <Badge className={getStatusColor(plan.status)}>{getStatusText(plan.status)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          已建群数：{plan.groupCount}
                        </div>
                        <div className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          群规模：{plan.groupSize}
                        </div>
                        <div className="flex items-center">
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          更新时间：{plan.lastUpdated}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {plan.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          编辑
                        </Button>
                        <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600">
                          停止
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="completed">
            <div className="h-[calc(100vh-200px)] flex items-center justify-center text-gray-500">暂无已完成的计划</div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={newPlanOpen} onOpenChange={setNewPlanOpen}>
        <NewPlanForm onClose={() => setNewPlanOpen(false)} />
      </Dialog>
    </div>
  )
}

