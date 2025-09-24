import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />
      <div className="px-5 w-full">
        {/* Sidebar Trigger */}
        <SidebarTrigger />
        <div>{children}</div>
      </div>
    </SidebarProvider>
  );
}
