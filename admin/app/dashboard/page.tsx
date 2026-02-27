"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  ShoppingCart,
  PawPrint,
  TrendingUp,
  DollarSign,
  BarChart3,
  Loader2,
} from "lucide-react";
import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";

interface Stats {
  users: { total: number; newThisMonth: number };
  products: { total: number; published: number; unpublished: number };
  orders: { total: number; pending: number; delivered: number; cancelled: number; recentCount: number };
  vendors: { total: number; approved: number; pending: number };
  adoptions: { total: number };
  revenue: { total: number };
}

export default function Page() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin/stats");
        if (data.success) setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
            Welcome back, Admin!
          </h1>
          <p className="text-white/80 max-w-md">
            Here&apos;s an overview of your platform. Manage vendors, review
            products, and keep everything running smoothly.
          </p>
        </div>
      </div>

      {/* Live Stats */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`৳${formatCurrency(stats.revenue.total)}`}
            subtitle={`${stats.orders.recentCount} orders this month`}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Products"
            value={stats.products.total.toString()}
            subtitle={`${stats.products.unpublished} awaiting review`}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={Clock}
            label="Pending Orders"
            value={stats.orders.pending.toString()}
            subtitle={`${stats.orders.total} total orders`}
            color="bg-amber-50 text-amber-600"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.users.total.toString()}
            subtitle={`+${stats.users.newThisMonth} this month`}
            color="bg-violet-50 text-violet-600"
          />
        </div>
      ) : null}

      {/* Quick navigation stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard
          icon={ShoppingCart}
          label="Products"
          description="Manage all products"
          href="/dashboard/products/published"
          color="bg-blue-50 text-blue-600"
          count={stats?.products.published}
        />
        <QuickStatCard
          icon={ShoppingBag}
          label="Vendors"
          description="Review vendor accounts"
          href="/dashboard/vendor/approved"
          color="bg-amber-50 text-amber-600"
          count={stats?.vendors.approved}
        />
        <QuickStatCard
          icon={Clock}
          label="Pending Orders"
          description="Orders awaiting action"
          href="/dashboard/orders/pending"
          color="bg-violet-50 text-violet-600"
          count={stats?.orders.pending}
        />
        <QuickStatCard
          icon={Users}
          label="Users"
          description="Registered customers"
          href="/dashboard/users"
          color="bg-emerald-50 text-emerald-600"
          count={stats?.users.total}
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard
          icon={Package}
          label="Unpublished Products"
          description="Review and approve new product listings from vendors"
          href="/dashboard/products/unpublished"
          badge={stats?.products.unpublished}
        />
        <QuickActionCard
          icon={Clock}
          label="Pending Vendors"
          description="Review new vendor applications awaiting your approval"
          href="/dashboard/vendor/pending"
          badge={stats?.vendors.pending}
        />
        <QuickActionCard
          icon={PawPrint}
          label="Adoptions"
          description="Manage pet adoption listings and applications"
          href="/dashboard/adoptions/pending"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
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
  count,
}: {
  icon: any;
  label: string;
  description: string;
  href: string;
  color: string;
  count?: number;
}) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-border">
        <div className="flex items-start justify-between">
          <div
            className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            {count !== undefined && (
              <span className="text-lg font-bold text-foreground">{count}</span>
            )}
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function QuickActionCard({
  icon: Icon,
  label,
  description,
  href,
  badge,
}: {
  icon: any;
  label: string;
  description: string;
  href: string;
  badge?: number;
}) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-[#FF8A80]/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0EE] flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#FF8A80]" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          {badge !== undefined && badge > 0 && (
            <span className="ml-auto text-xs font-bold bg-[#FF8A80] text-white px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#FF8A80] group-hover:gap-2 transition-all">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
