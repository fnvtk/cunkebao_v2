"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BasicSettings } from "./steps/BasicSettings"
import { FriendRequestSettings } from "./steps/FriendRequestSettings"
import { MessageSettings } from "./steps/MessageSettings"
import { TagSettings } from "./steps/TagSettings"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

const steps = [
  { id: 1, title: "步骤一", subtitle: "基础设置" },
  { id: 2, title: "步骤二", subtitle: "好友申请设置" },
  { id: 3, title: "步骤三", subtitle: "消息设置" },
  { id: 4, title: "步骤四", subtitle: "流量标签设置" },
]

// 场景分类规则
const scenarioRules = {
  LIVE: ["直播", "直播间", "主播", "抖音"],
  COMMENT: ["评论", "互动", "回复", "小红书"],
  GROUP: ["群", "社群", "群聊", "微信群"],
  ARTICLE: ["文章", "笔记", "内容", "公众号"],
}

// 根据计划名称和标签自动判断场景
const determineScenario = (planName: string, tags: any[]) => {
  // 优先使用标签进行分类
  if (tags && tags.length > 0) {
    const firstTag = tags[0]
    if (firstTag.name.includes("直播") || firstTag.name.includes("抖音")) return "douyin"
    if (firstTag.name.includes("评论") || firstTag.name.includes("小红书")) return "xiaohongshu"
    if (firstTag.name.includes("群") || firstTag.name.includes("微信")) return "weixinqun"
    if (firstTag.name.includes("文章") || firstTag.name.includes("公众号")) return "gongzhonghao"
  }

  // 如果没有标签，使用计划名称进行分类
  const planNameLower = planName.toLowerCase()
  if (planNameLower.includes("直播") || planNameLower.includes("抖音")) return "douyin"
  if (planNameLower.includes("评论") || planNameLower.includes("小红书")) return "xiaohongshu"
  if (planNameLower.includes("群") || planNameLower.includes("微信")) return "weixinqun"
  if (planNameLower.includes("文章") || planNameLower.includes("公众号")) return "gongzhonghao"
  return "other"
}

export default function NewAcquisitionPlan() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const source = searchParams.get("source")

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    planName: "",
    scenario: type === "order" ? "order" : "",
    accounts: [],
    materials: [],
    enabled: true,
    remarkType: "phone",
    remarkKeyword: "",
    greeting: "",
    addFriendTimeStart: "09:00",
    addFriendTimeEnd: "18:00",
    addFriendInterval: 1,
    maxDailyFriends: 20,
    messageInterval: 1,
    messageContent: "",
    tags: [],
    selectedDevices: [],
    messagePlans: [],
    importedTags: [],
    sourceWechatId: source || "",
  })

  // 如果是从微信号好友转移过来，自动设置计划名称
  useEffect(() => {
    if (type === "order" && source) {
      const today = new Date().toLocaleDateString("zh-CN").replace(/\//g, "")
      setFormData((prev) => ({
        ...prev,
        planName: `${source}好友转移${today}`,
        scenario: "order",
      }))

      // 模拟加载好友数据
      setTimeout(() => {
        toast({
          title: "好友数据加载成功",
          description: `已从微信号 ${source} 导入好友数据`,
        })
      }, 1000)
    }
  }, [type, source])

  const handleSave = () => {
    // 根据标签和计划名称自动判断场景
    const scenario = formData.scenario || determineScenario(formData.planName, formData.tags)

    console.log("计划已创建:", { ...formData, scenario })
    toast({
      title: "创建成功",
      description: "获客计划已创建完成",
    })

    // 跳转到对应场景页面
    router.push(`/scenarios/${scenario}`)
  }

  const handlePrev = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1))
  }

  const handleNext = () => {
    if (isStepValid()) {
      if (currentStep === steps.length) {
        handleSave()
      } else {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length))
      }
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        if (!formData.planName.trim()) {
          toast({
            title: "请完善信息",
            description: "请填写计划名称",
            variant: "destructive",
          })
          return false
        }
        return true
      case 2:
        // 如果是订单导入场景，跳过好友申请设置验证
        if (formData.scenario === "order") {
          return true
        }
        if (!formData.greeting.trim() || formData.selectedDevices.length === 0) {
          toast({
            title: "请完善信息",
            description: "请填写好友申请信息并选择设备",
            variant: "destructive",
          })
          return false
        }
        return true
      case 3:
        // 如果是订单导入场景，跳过消息设置验证
        if (formData.scenario === "order") {
          return true
        }
        if (formData.messagePlans.length === 0) {
          toast({
            title: "请完善信息",
            description: "请设置至少一条消息",
            variant: "destructive",
          })
          return false
        }
        return true
      case 4:
        return true
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicSettings formData={formData} onChange={setFormData} onNext={handleNext} />
      case 2:
        return (
          <FriendRequestSettings formData={formData} onChange={setFormData} onNext={handleNext} onPrev={handlePrev} />
        )
      case 3:
        return <MessageSettings formData={formData} onChange={setFormData} onNext={handleNext} onPrev={handlePrev} />
      case 4:
        return <TagSettings formData={formData} onChange={setFormData} onComplete={handleSave} onPrev={handlePrev} />
      default:
        return null
    }
  }

  // 如果是订单导入场景，直接跳到标签设置步骤
  useEffect(() => {
    if (formData.scenario === "order" && currentStep === 1 && formData.planName) {
      setCurrentStep(4)
    }
  }, [formData.scenario, currentStep, formData.planName])

  const handleCopyPlan = (planId: string) => {
    toast({
      title: "复制成功",
      description: "计划已复制",
    })
    // Add your copy logic here
  }

  const handleDeletePlan = (planId: string) => {
    // Add your delete logic here
    toast({
      title: "删除成功",
      description: "计划已删除",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[390px] mx-auto bg-white min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center h-14 px-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="ml-2 text-lg font-medium">{formData.sourceWechatId ? "好友转移" : "新建获客计划"}</h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          <div className="px-4 py-6">
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center relative z-10",
                    currentStep >= step.id ? "text-blue-600" : "text-gray-400",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2",
                      currentStep >= step.id
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-400",
                    )}
                  >
                    {step.id}
                  </div>
                  <div className="text-xs mt-1">{step.title}</div>
                  <div className="text-xs mt-0.5 font-medium">{step.subtitle}</div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-4 left-[32px] w-[calc(100%-32px)] h-[2px]",
                        currentStep > step.id ? "bg-blue-600" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 px-4 pb-20">{renderStepContent()}</div>

          <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="flex justify-between max-w-[390px] mx-auto">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrev}>
                  上一步
                </Button>
              )}
              <Button className={cn("min-w-[120px]", currentStep === 1 ? "w-full" : "ml-auto")} onClick={handleNext}>
                {currentStep === steps.length ? "完成" : "下一步"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

