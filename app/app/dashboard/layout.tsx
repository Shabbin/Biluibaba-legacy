import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider } from "@/context/AuthProvider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <SidebarTrigger />
        <AuthProvider>{children}</AuthProvider>
      </div>
    </SidebarProvider>
  );
}
