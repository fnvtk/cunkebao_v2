"use client"

import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings, Moon, Sun } from 'lucide-react'
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from 'next-themes'

export function SettingsDropdown() {
  const isMobile = useMobile()
  const [isDesktopView, setIsDesktopView] = useState(!isMobile)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    setIsDesktopView(!isMobile)
  }, [isMobile])

  const handleToggleView = () => {
    setIsDesktopView((prev) => !prev)
  }

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggleView}>
          {isDesktopView ? "切换到移动端视图" : "切换到桌面端视图"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleTheme}>
          {theme === 'light' ? "切换到深色模式" : "切换到浅色模式"}
          {theme === 'light' ? <Moon className="h-4 w-4 ml-2" /> : <Sun className="h-4 w-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
