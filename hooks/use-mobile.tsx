"use client"

import { useState, useEffect } from "react"

const MOBILE_MAX_WIDTH = 768 // Adjust as needed

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH)
    }

    // Initial check
    checkScreenSize()

    // Subscribe to the window resize event
    window.addEventListener("resize", checkScreenSize)

    // Unsubscribe on unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  return isMobile
}
