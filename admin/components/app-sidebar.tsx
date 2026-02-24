"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ClipboardList,
  Stethoscope,
  PawPrint,
  Settings,
  PackageCheck,
  PackagePlus,
  Clock,
  CheckCircle,
  LogOut,
  CreditCard,
  ShieldCheck,
  Image,
  Star,
  Megaphone,
  Grid3X3,
  Layers,
  Sparkles,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import axios from "@/lib/axios";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (prefix: string) => pathname.startsWith(prefix);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/admin/logout");
      if (data.success) {
        toast({
          title: "Logout successful",
          description: "Redirecting to login page...",
        });
        return router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="py-2">
        {/* Brand header */}
        <div className="px-4 py-4 mb-2">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Biluibaba</p>
              <p className="text-[11px] text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold px-4 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard Home */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  className="rounded-lg mx-2"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Users */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/users"}
                  className="rounded-lg mx-2"
                >
                  <Link href="/dashboard/users">
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Products */}
              <Collapsible
                defaultOpen={isGroupActive("/dashboard/products")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="rounded-lg mx-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Products</span>
                      <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/products/published")}
                        >
                          <Link href="/dashboard/products/published">
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Published</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/products/unpublished")}
                        >
                          <Link href="/dashboard/products/unpublished">
                            <PackagePlus className="w-3.5 h-3.5" />
                            <span>Unpublished</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Vendors */}
              <Collapsible
                defaultOpen={isGroupActive("/dashboard/vendor")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="rounded-lg mx-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Vendors</span>
                      <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/vendor/approved")}
                        >
                          <Link href="/dashboard/vendor/approved">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approved</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/vendor/pending")}
                        >
                          <Link href="/dashboard/vendor/pending">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Approval</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Orders */}
              <Collapsible
                defaultOpen={isGroupActive("/dashboard/orders")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="rounded-lg mx-2">
                      <ClipboardList className="w-4 h-4" />
                      <span>Orders</span>
                      <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/orders/pending")}
                        >
                          <Link href="/dashboard/orders/pending">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/orders/all")}
                        >
                          <Link href="/dashboard/orders/all">
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span>All Orders</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Vets */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/dashboard/vets")}
                  className="rounded-lg mx-2"
                >
                  <Link href="/dashboard/users">
                    <Stethoscope className="w-4 h-4" />
                    <span>Vets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Adoptions */}
              <Collapsible
                defaultOpen={isGroupActive("/dashboard/adoptions")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="rounded-lg mx-2">
                      <PawPrint className="w-4 h-4" />
                      <span>Adoptions</span>
                      <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/adoptions/approved")}
                        >
                          <Link href="/dashboard/adoptions/approved">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approved</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/adoptions/pending")}
                        >
                          <Link href="/dashboard/adoptions/pending">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/adoptions/orders")}
                        >
                          <Link href="/dashboard/adoptions/orders">
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span>Adoption Orders</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Site Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold px-4 mb-1">
            Site Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                defaultOpen={isGroupActive("/dashboard/site-settings")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="rounded-lg mx-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                      <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/site-settings/product-landing-slider")}
                        >
                          <Link href="/dashboard/site-settings/product-landing-slider">
                            <Image className="w-3.5 h-3.5" />
                            <span>Product Slider</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/site-settings/popular-category-product")}
                        >
                          <Link href="/dashboard/site-settings/popular-category-product">
                            <Star className="w-3.5 h-3.5" />
                            <span>Popular & Featured</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/site-settings/banner-feature-products")}
                        >
                          <Link href="/dashboard/site-settings/banner-feature-products">
                            <Megaphone className="w-3.5 h-3.5" />
                            <span>Product Banner</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/site-settings/best-deals")}
                        >
                          <Link href="/dashboard/site-settings/best-deals">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Best Deals</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/site-settings/brand-in-spotlight")}
                        >
                          <Link href="/dashboard/site-settings/brand-in-spotlight">
                            <Layers className="w-3.5 h-3.5" />
                            <span>Brand Spotlight</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/site-settings/vet-landing-slider")}
                        >
                          <Link href="/dashboard/site-settings/vet-landing-slider">
                            <Image className="w-3.5 h-3.5" />
                            <span>Vet Sliders</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/site-settings/vet-grid-banners")}
                        >
                          <Link href="/dashboard/site-settings/vet-grid-banners">
                            <Grid3X3 className="w-3.5 h-3.5" />
                            <span>Vet Grid Banners</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/site-settings/adoption")}
                        >
                          <Link href="/dashboard/site-settings/adoption">
                            <PawPrint className="w-3.5 h-3.5" />
                            <span>Adoption</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — Admin menu */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12 rounded-lg mx-2">
                  <div className="w-8 h-8 flex-shrink-0">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] text-white text-xs font-bold">
                        A
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold truncate max-w-[140px]">
                      Administrator
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Super Admin
                    </span>
                  </div>
                  <ChevronUp className="ml-auto w-4 h-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] rounded-xl shadow-lg border border-border/50"
              >
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
