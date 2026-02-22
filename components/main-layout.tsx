"use client"

import * as React from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/logo"
import { UserMenu } from "@/components/user-menu"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Link href="/" className="flex items-center">
              <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 0L20.4545 5.33333L0 25.3333V14.6667L15 0Z" fill="#06D1D4"></path>
<path d="M2.90827 28.177L15 40L30 25.3334V14.6667L20.4545 5.33337L0 25.3334L0.0041688 25.3375L20.4545 5.33337V20.6667L11.25 29.6667V20.1324L2.90827 28.177Z" fill="#3628A0"></path>
</svg>
           
            <span className="ml-2 text-lg font-semibold text-blue-600 hidden sm:inline">
              PathoLens
            </span>
          </Link>
          
          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 ml-6">
          
            <Link
  href="/"
  className="px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 rounded-md hover:text-blue-600 hover:bg-blue-50 active:scale-95"
>
  Dashboard
</Link>
<Link
  href="/lab-reports"
  className="px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 rounded-md hover:text-blue-600 hover:bg-blue-50 active:scale-95"
>
  Lab Reports
</Link>
          </nav>

          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 overflow-auto bg-gray-50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

