"use client"

import "./globals.css"
import "regenerator-runtime/runtime"
import type React from "react"
import ErrorBoundary from "./components/ErrorBoundary"
import { AuthProvider } from "@/app/components/AuthProvider"
import BottomNav from "./components/BottomNav"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-100">
        <AuthProvider>
          <ErrorBoundary>
            <main className="mx-auto bg-white min-h-screen flex flex-col relative pb-16">
              {children}
              {/* 移除条件渲染，确保底部导航始终显示 */}
              <div className="fixed bottom-0 left-0 right-0 z-50">
                <BottomNav />
              </div>
            </main>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}
