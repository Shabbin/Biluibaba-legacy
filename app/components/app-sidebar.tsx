"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "@/lib/axios";

import { toast } from "@/hooks/use-toast";

import {
  DollarSign,
  Home,
  ShoppingBag,
  ChevronDown,
  ShoppingCart,
  User2,
  ChevronUp,
  IdCard,
  AlarmClock,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const router = useRouter();
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

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Biluibaba Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user.type === "vendor" && (
                <>
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href="#">
                            <ShoppingCart />
                            <span>Products</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </Link>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/products">
                                <span>List Your Products</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/products/published">
                                <span>Published Products</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/products/upload">
                                <span>Upload New Product</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href="#">
                            <ShoppingBag />
                            <span>Orders</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </Link>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/orders/pending">
                                <span>Pending Orders</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/orders/all">
                                <span>All Orders</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/orders/cancelled">
                                <span>Cancelled Orders</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </>
              )}

              {user.type === "vet" && (
                <>
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href="#">
                            <IdCard />
                            <span>Vet Profile</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </Link>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/vet/appointment-slots">
                                <span>Appointment Slots</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/vet/toggle-availability">
                                <span>Toggle Availability & Pricing</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/vet/my-profile">
                                <span>My Profile</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link href="#">
                            <AlarmClock />
                            <span>Appointments</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </Link>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/appointments/upcoming">
                                <span>Upcoming Appointments</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>

                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/appointments/cancelled">
                                <span>Cancelled Appointments</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/dashboard/appointments/all">
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

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <DollarSign />
                        <span>Payment</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/dashboard/payments/pending">
                            <span>Pending Payments</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/dashboard/payments/refund">
                            <span>Refund Payments</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/dashboard/payments/request">
                            <span>Request Payments</span>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
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
