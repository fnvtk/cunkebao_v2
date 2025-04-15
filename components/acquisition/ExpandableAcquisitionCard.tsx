"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, UserPlus } from "lucide-react"

export interface AcquisitionPlan {
  id: string
  name: string
  status: "active" | "paused" | "completed"
  totalAcquired: number
  target: number
  progress: number
  startDate: string
  endDate: string
}

interface ExpandableAcquisitionCardProps {
  plan: AcquisitionPlan
  onEdit?: (id: string) => void
  onPause?: (id: string) => void
  onResume?: (id: string) => void
}

export function ExpandableAcquisitionCard({ plan, onEdit, onPause, onResume }: ExpandableAcquisitionCardProps) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const statusColors = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{plan.name}</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs ${statusColors[plan.status]}`}>
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </span>
            <Button variant="ghost" size="sm" onClick={toggleExpand}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-gray-500" />
            <span className="text-sm">
              {plan.totalAcquired} / {plan.target}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-600 rounded-full h-2" style={{ width: `${Math.min(plan.progress, 100)}%` }}></div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">获客总数</p>
                <p className="text-sm font-medium">{plan.totalAcquired}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">目标数</p>
                <p className="text-sm font-medium">{plan.target}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">开始日期</p>
                <p className="text-sm font-medium">{new Date(plan.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">结束日期</p>
                <p className="text-sm font-medium">{new Date(plan.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(plan.id)}>
                  编辑
                </Button>
              )}
              {plan.status === "active" && onPause && (
                <Button variant="outline" size="sm" onClick={() => onPause(plan.id)}>
                  暂停
                </Button>
              )}
              {plan.status === "paused" && onResume && (
                <Button variant="outline" size="sm" onClick={() => onResume(plan.id)}>
                  恢复
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

