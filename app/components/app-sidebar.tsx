"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import axios from "@/lib/axios";

import { toast } from "@/hooks/use-toast";

import {
  DollarSign,
  LayoutDashboard,
  ShoppingBag,
  ChevronDown,
  ShoppingCart,
  ChevronUp,
  IdCard,
  AlarmClock,
  LogOut,
  Settings,
  CreditCard,
  PawPrint,
  Package,
  PackagePlus,
  PackageCheck,
  ClipboardList,
  ClipboardX,
  Clock,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  Stethoscope,
  ToggleLeft,
  UserCircle,
  Wallet,
  RefreshCcw,
  HandCoins,
} from "lucide-react";

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
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string; type?: string }>({});

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();

      if (data.user) setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      let { data } = await axios.post("/api/app/logout");
      if (data.success) {
        toast({
          title: "Logout successful",
          description: "Redirecting you to login page...",
        });
        return router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (prefix: string) => pathname.startsWith(prefix);

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="py-2">
        {/* Brand header */}
        <div className="px-4 py-4 mb-2">
          <Link href="/dashboard" className="">
            <Image src="/logo.png" alt="Biluibaba Logo" width={120} height={30}/>
            
               <p className="text-xs mt-2">{user.type || "Dashboard"}</p>
            
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

              {/* Vendor: Products */}
              {user.type === "vendor" && (
                <>
                  <Collapsible
                    defaultOpen={isGroupActive("/dashboard/products")}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="rounded-lg mx-2">
                          <Package className="w-4 h-4" />
                          <span>Products</span>
                          <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive("/dashboard/products")}
                            >
                              <Link href="/dashboard/products">
                                <ClipboardList className="w-3.5 h-3.5" />
                                <span>All Products</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(
                                "/dashboard/products/published"
                              )}
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
                              isActive={isActive("/dashboard/products/upload")}
                            >
                              <Link href="/dashboard/products/upload">
                                <PackagePlus className="w-3.5 h-3.5" />
                                <span>Upload New</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  {/* Vendor: Orders */}
                  <Collapsible
                    defaultOpen={isGroupActive("/dashboard/orders")}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="rounded-lg mx-2">
                          <ShoppingBag className="w-4 h-4" />
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
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>All Orders</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(
                                "/dashboard/orders/cancelled"
                              )}
                            >
                              <Link href="/dashboard/orders/cancelled">
                                <ClipboardX className="w-3.5 h-3.5" />
                                <span>Cancelled</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </>
              )}

              {/* Vet sections */}
              {user.type === "vet" && (
                <>
                  <Collapsible
                    defaultOpen={isGroupActive("/dashboard/vet")}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="rounded-lg mx-2">
                          <Stethoscope className="w-4 h-4" />
                          <span>Vet Profile</span>
                          <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(
                                "/dashboard/vet/appointment-slots"
                              )}
                            >
                              <Link href="/dashboard/vet/appointment-slots">
                                <CalendarClock className="w-3.5 h-3.5" />
                                <span>Appointment Slots</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(
                                "/dashboard/vet/toggle-availability"
                              )}
                            >
                              <Link href="/dashboard/vet/toggle-availability">
                                <ToggleLeft className="w-3.5 h-3.5" />
                                <span>Availability & Pricing</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive("/dashboard/vet/my-profile")}
                            >
                              <Link href="/dashboard/vet/my-profile">
                                <UserCircle className="w-3.5 h-3.5" />
                                <span>My Profile</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <Collapsible
                    defaultOpen={isGroupActive("/dashboard/appointments")}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="rounded-lg mx-2">
                          <AlarmClock className="w-4 h-4" />
                          <span>Appointments</span>
                          <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(
                                "/dashboard/appointments/upcoming"
                              )}
                            >
                              <Link href="/dashboard/appointments/upcoming">
                                <CalendarCheck className="w-3.5 h-3.5" />
                                <span>Upcoming</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(
                                "/dashboard/appointments/cancelled"
                              )}
                            >
                              <Link href="/dashboard/appointments/cancelled">
                                <CalendarX className="w-3.5 h-3.5" />
                                <span>Cancelled</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(
                                "/dashboard/appointments/all"
                              )}
                            >
                              <Link href="/dashboard/appointments/all">
                                <ClipboardList className="w-3.5 h-3.5" />
                                <span>All Appointments</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Payments section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold px-4 mb-1">
            Finance
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                defaultOpen={isGroupActive("/dashboard/payments")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="rounded-lg mx-2">
                      <Wallet className="w-4 h-4" />
                      <span>Payments</span>
                      <ChevronDown className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-5 border-l border-border/50 pl-3">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/payments/pending")}
                        >
                          <Link href="/dashboard/payments/pending">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/payments/refund")}
                        >
                          <Link href="/dashboard/payments/refund">
                            <RefreshCcw className="w-3.5 h-3.5" />
                            <span>Refunds</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive("/dashboard/payments/request")}
                        >
                          <Link href="/dashboard/payments/request">
                            <HandCoins className="w-3.5 h-3.5" />
                            <span>Request Payout</span>
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

      {/* Footer — User menu */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12 rounded-lg mx-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold truncate max-w-[140px]">
                      {user.name || "User"}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {user.type || "Account"}
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
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Billing</span>
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
