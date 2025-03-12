import type { Metadata } from "next"
import "./globals.css"
import BottomNav from "./components/BottomNav"
import "regenerator-runtime/runtime"
import type React from "react"
import ErrorBoundary from "./components/ErrorBoundary"
import { VideoTutorialButton } from "@/components/VideoTutorialButton"

export const metadata: Metadata = {
  title: "存客宝",
  description: "智能客户管理系统",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="bg-gray-100">
        <ErrorBoundary>
          <main className="max-w-[390px] mx-auto bg-white min-h-screen flex flex-col relative">
            {children}
            <BottomNav />
            <VideoTutorialButton />
          </main>
        </ErrorBoundary>
      </body>
    </html>
  )
}



import './globals.css'