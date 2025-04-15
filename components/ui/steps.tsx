import React from "react"
import { cn } from "@/lib/utils"

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number
  children: React.ReactNode
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  status?: "wait" | "process" | "finish" | "error"
}

export function Steps({ current, children, className, ...props }: StepsProps) {
  const childrenArray = React.Children.toArray(children)
  const steps = childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        status: index < current ? "finish" : index === current ? "process" : "wait",
        ...child.props,
      })
    }
    return child
  })

  return (
    <div className={cn("steps-container flex flex-col gap-4", className)} {...props}>
      {steps}
    </div>
  )
}

export function Step({ title, description, icon, status = "wait", className, ...props }: StepProps) {
  const statusClasses = {
    wait: "border-gray-300 text-gray-500",
    process: "border-blue-500 text-blue-500 bg-blue-100",
    finish: "border-green-500 text-green-500 bg-green-100",
    error: "border-red-500 text-red-500 bg-red-100",
  }

  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2", statusClasses[status])}>
        {icon || (status === "finish" ? "✓" : status === "error" ? "✗" : "")}
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium">{title}</div>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>
    </div>
  )
}

