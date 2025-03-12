"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, X } from "lucide-react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeamMember {
  id: string
  name: string
  role: string
  status: "active" | "inactive"
}

interface OrderTag {
  phone: string
  wechat: string
  source?: string
  orderAmount?: number
  orderDate?: string
}

interface WechatFriend {
  id: string
  nickname: string
  wechatId: string
  remark: string
  addedDate: string
}

interface TagSettingsProps {
  formData: any
  onChange: (data: any) => void
  onComplete: () => void
  onPrev?: () => void
}

export function TagSettings({ formData, onChange, onComplete, onPrev }: TagSettingsProps) {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(formData.teamMembers || [])
  const [selectedRole, setSelectedRole] = useState("member")
  const [newMemberName, setNewMemberName] = useState("")
  const [importedTags, setImportedTags] = useState<OrderTag[]>([])
  const [wechatFriends, setWechatFriends] = useState<WechatFriend[]>([])
  const [activeTab, setActiveTab] = useState(formData.sourceWechatId ? "friends" : "team")

  // 如果是从微信号好友转移过来，加载好友数据
  useEffect(() => {
    if (formData.sourceWechatId) {
      // 模拟加载微信好友数据
      const mockFriends = Array.from({ length: 50 }, (_, i) => ({
        id: `friend-${i + 1}`,
        nickname: `好友${i + 1}`,
        wechatId: `wxid_${Math.random().toString(36).substr(2, 8)}`,
        remark: Math.random() > 0.5 ? `备注${i + 1}` : "",
        addedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      }))
      setWechatFriends(mockFriends)
      setActiveTab("friends")
    }
  }, [formData.sourceWechatId])

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newMemberName,
        role: selectedRole,
        status: "active",
      }
      const updatedMembers = [...teamMembers, newMember]
      setTeamMembers(updatedMembers)
      onChange({ ...formData, teamMembers: updatedMembers })
      setNewMemberName("")
    }
  }

  const handleRemoveMember = (id: string) => {
    const updatedMembers = teamMembers.filter((member) => member.id !== id)
    setTeamMembers(updatedMembers)
    onChange({ ...formData, teamMembers: updatedMembers })
  }

  const handleToggleStatus = (id: string) => {
    const updatedMembers = teamMembers.map((member) => {
      if (member.id === id) {
        return {
          ...member,
          status: member.status === "active" ? "inactive" : "active",
        }
      }
      return member
    })
    setTeamMembers(updatedMembers)
    onChange({ ...formData, teamMembers: updatedMembers })
  }

  const handleComplete = () => {
    // 根据当前标签页确定要保存的数据
    if (activeTab === "friends" && wechatFriends.length > 0) {
      // 将微信好友转换为标签
      const friendTags = wechatFriends.map((friend) => ({
        phone: "",
        wechat: friend.wechatId,
        source: formData.sourceWechatId,
        orderAmount: undefined,
        orderDate: friend.addedDate,
      }))
      onChange({ ...formData, importedTags: friendTags })
    } else if (activeTab === "import" && importedTags.length > 0) {
      onChange({ ...formData, importedTags })
    }

    onComplete()
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="team">打粉团队</TabsTrigger>
          <TabsTrigger value="import">标签导入</TabsTrigger>
          {formData.sourceWechatId && <TabsTrigger value="friends">微信好友</TabsTrigger>}
        </TabsList>

        <TabsContent value="team" className="mt-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="输入成员名称"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leader">组长</SelectItem>
                    <SelectItem value="member">组员</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddMember}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  添加成员
                </Button>
              </div>

              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      <Badge variant="outline">{member.role === "leader" ? "组长" : "组员"}</Badge>
                      <Badge
                        variant={member.status === "active" ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(member.id)}
                      >
                        {member.status === "active" ? "已启用" : "已停用"}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="mt-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">标签导入</h3>
              </div>

              {importedTags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">已导入 {importedTags.length} 条数据</h4>
                  <div className="max-h-[300px] overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>电话号码</TableHead>
                          <TableHead>微信号</TableHead>
                          <TableHead>来源</TableHead>
                          <TableHead>订单金额</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importedTags.slice(0, 5).map((tag, index) => (
                          <TableRow key={index}>
                            <TableCell>{tag.phone}</TableCell>
                            <TableCell>{tag.wechat}</TableCell>
                            <TableCell>{tag.source}</TableCell>
                            <TableCell>{tag.orderAmount}</TableCell>
                          </TableRow>
                        ))}
                        {importedTags.length > 5 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500">
                              还有 {importedTags.length - 5} 条数据未显示
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {formData.sourceWechatId && (
          <TabsContent value="friends" className="mt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-medium">微信好友列表</h3>
                  </div>
                  <Badge variant="outline">共 {wechatFriends.length} 位好友</Badge>
                </div>

                <div className="max-h-[400px] overflow-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>昵称</TableHead>
                        <TableHead>微信号</TableHead>
                        <TableHead>备注</TableHead>
                        <TableHead>添加时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wechatFriends.map((friend) => (
                        <TableRow key={friend.id}>
                          <TableCell>{friend.nickname}</TableCell>
                          <TableCell>{friend.wechatId}</TableCell>
                          <TableCell>{friend.remark || "-"}</TableCell>
                          <TableCell>{friend.addedDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="text-sm text-gray-500">
                  <p>• 这些好友将被导入为订单标签</p>
                  <p>• 导入后可用于创建获客计划</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-between">
        {onPrev && (
          <Button variant="outline" onClick={onPrev}>
            上一步
          </Button>
        )}
        <Button onClick={handleComplete} className={onPrev ? "ml-auto" : "w-full"}>
          完成
        </Button>
      </div>
    </div>
  )
}

