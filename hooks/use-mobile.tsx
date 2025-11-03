"use client"

import { useState, useEffect } from "react"

/**
 * 检测是否为移动端设备的Hook
 * @param breakpoint 断点像素值，默认768px
 * @returns boolean 是否为移动端
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === "undefined") {
      return
    }

    // 初始检查
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // 立即执行一次检查
    checkIsMobile()

    // 添加窗口大小变化监听器
    const handleResize = () => {
      checkIsMobile()
    }

    window.addEventListener("resize", handleResize)

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [breakpoint])

  return isMobile
}

export const useMobile = useIsMobile

/**
 * 获取设备类型的Hook
 * @returns 设备类型信息
 */
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<{
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    screenWidth: number
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const updateDeviceType = () => {
      const width = window.innerWidth

      setDeviceType({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        screenWidth: width,
      })
    }

    // 立即执行一次
    updateDeviceType()

    // 添加监听器
    window.addEventListener("resize", updateDeviceType)

    return () => {
      window.removeEventListener("resize", updateDeviceType)
    }
  }, [])

  return deviceType
}

/**
 * 检测触摸设备的Hook
 * @returns boolean 是否为触摸设备
 */
export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    // 检测是否支持触摸
    const checkTouchSupport = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      )
    }

    setIsTouchDevice(checkTouchSupport())
  }, [])

  return isTouchDevice
}

/**
 * 获取用户代理信息的Hook
 * @returns 用户代理信息
 */
export function useUserAgent() {
  const [userAgent, setUserAgent] = useState<{
    isIOS: boolean
    isAndroid: boolean
    isWindows: boolean
    isMac: boolean
    isChrome: boolean
    isSafari: boolean
    isFirefox: boolean
    isEdge: boolean
    isMobileDevice: boolean
  }>({
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMac: false,
    isChrome: false,
    isSafari: false,
    isFirefox: false,
    isEdge: false,
    isMobileDevice: false,
  })

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.userAgent) {
      return
    }

    const ua = navigator.userAgent.toLowerCase()

    setUserAgent({
      isIOS: /iphone|ipad|ipod/.test(ua),
      isAndroid: /android/.test(ua),
      isWindows: /windows/.test(ua),
      isMac: /macintosh|mac os x/.test(ua),
      isChrome: /chrome/.test(ua) && !/edge/.test(ua),
      isSafari: /safari/.test(ua) && !/chrome/.test(ua),
      isFirefox: /firefox/.test(ua),
      isEdge: /edge/.test(ua),
      isMobileDevice: /mobile|android|iphone|ipad|phone/.test(ua),
    })
  }, [])

  return userAgent
}

// 默认导出主要的Hook
export default useIsMobile
