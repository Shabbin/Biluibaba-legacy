import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider } from "@/context/AuthProvider";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-dvh bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-white/80 backdrop-blur-md border-b border-border/50">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors" />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium text-muted-foreground">
            Dashboard
          </span>
        </header>
        {/* Page content */}
        <div className="flex-1">
          <AuthProvider>
            <div className="dashboard-content animate-fadeIn">
              {children}
            </div>
          </AuthProvider>
        </div>
      </div>
    </SidebarProvider>
  );
}
