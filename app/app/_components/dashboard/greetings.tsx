"use client";

import { useAuth } from "@/context/AuthProvider";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Greetings() {
  const user = useAuth();

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF8A80] via-[#FF7A70] to-[#FF6B61] p-8 text-white">
        {/* Decorative elements */}
        <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-[-30px] left-[30%] w-[150px] h-[150px] rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-white/80" />
            <span className="text-sm font-medium text-white/80">
              {greeting}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name || "there"}!
          </h1>
          <p className="text-white/80 max-w-md">
            Here&apos;s what&apos;s happening with your{" "}
            {user.type === "vet" ? "practice" : "store"} today. Stay on top of
            your business.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {user.type === "vendor" ? (
          <>
            <QuickStatCard
              icon={Package}
              label="Products"
              description="Manage your catalog"
              href="/dashboard/products"
              color="bg-blue-50 text-blue-600"
            />
            <QuickStatCard
              icon={ShoppingBag}
              label="Orders"
              description="View all orders"
              href="/dashboard/orders/all"
              color="bg-amber-50 text-amber-600"
            />
            <QuickStatCard
              icon={Clock}
              label="Pending"
              description="Orders awaiting action"
              href="/dashboard/orders/pending"
              color="bg-violet-50 text-violet-600"
            />
            <QuickStatCard
              icon={TrendingUp}
              label="Payments"
              description="Track your earnings"
              href="/dashboard/payments/pending"
              color="bg-emerald-50 text-emerald-600"
            />
          </>
        ) : (
          <>
            <QuickStatCard
              icon={Clock}
              label="Upcoming"
              description="Next appointments"
              href="/dashboard/appointments/upcoming"
              color="bg-blue-50 text-blue-600"
            />
            <QuickStatCard
              icon={Package}
              label="All Appointments"
              description="View full history"
              href="/dashboard/appointments/all"
              color="bg-amber-50 text-amber-600"
            />
            <QuickStatCard
              icon={ShoppingBag}
              label="Profile"
              description="Update your details"
              href="/dashboard/vet/my-profile"
              color="bg-violet-50 text-violet-600"
            />
            <QuickStatCard
              icon={TrendingUp}
              label="Payments"
              description="Track your earnings"
              href="/dashboard/payments/pending"
              color="bg-emerald-50 text-emerald-600"
            />
          </>
        )}
      </div>
    </div>
  );
}

function QuickStatCard({
  icon: Icon,
  label,
  description,
  href,
  color,
}: {
  icon: any;
  label: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-border/60 hover:border-[#FF8A80]/30 hover:shadow-soft transition-all duration-300"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-sm">{label}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#FF8A80] group-hover:translate-x-1 transition-all mt-1" />
    </Link>
  );
}
