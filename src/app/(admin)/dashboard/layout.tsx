// src/app/dashboard/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Content */}
          <main
            id="main-content"
            className="flex-1 p-4 md:p-8 bg-gradient-to-br from-background via-background to-muted/20"
          >
            <div className="max-w-screen-2xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
