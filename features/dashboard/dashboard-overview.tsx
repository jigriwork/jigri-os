"use client";

import {
  Boxes,
  CircleDollarSign,
  ClipboardList,
  Package,
  Receipt,
  Settings2,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

type DashboardOverviewProps = {
  stats: {
    products: number;
    customers: number;
    suppliers: number;
    bills: number;
    revenueSeries: Array<{ day: string; total: number }>;
  };
};

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  const revenueTotal = stats.revenueSeries.reduce((sum, point) => sum + point.total, 0);
  const todayRevenue = stats.revenueSeries[stats.revenueSeries.length - 1]?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", value: stats.products, icon: Package },
          { label: "Customers", value: stats.customers, icon: Users },
          { label: "Suppliers", value: stats.suppliers, icon: Truck },
          { label: "Recent Bills", value: stats.bills, icon: Receipt },
        ].map((item) => (
          <Card key={item.label} className="rounded-2xl border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <item.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Operations center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Start billing", href: "/app/billing", icon: ShoppingCart },
                { label: "Manage products", href: "/app/products", icon: Package },
                { label: "Customer CRM", href: "/app/customers", icon: Users },
                { label: "Inventory control", href: "/app/inventory", icon: Boxes },
                { label: "Purchase suppliers", href: "/app/suppliers", icon: Truck },
                { label: "Workspace settings", href: "/app/settings", icon: Settings2 },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-xl border bg-background px-3 py-2.5 text-sm transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <action.icon className="size-4 text-muted-foreground" />
                    {action.label}
                  </span>
                  <span className="text-xs text-muted-foreground">Open</span>
                </Link>
              ))}
            </div>

            <div className="rounded-xl border bg-muted/25 p-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Business readiness</p>
              <div className="mt-3 space-y-2 text-sm">
                {[
                  ["Products configured", stats.products > 0],
                  ["Customers added", stats.customers > 0],
                  ["Suppliers added", stats.suppliers > 0],
                  ["Billing activity started", stats.bills > 0],
                ].map(([label, ready]) => (
                  <div key={String(label)} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                    <span>{label}</span>
                    <Badge variant={ready ? "secondary" : "outline"}>{ready ? "Ready" : "Pending"}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Revenue snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border bg-primary/10 p-3">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">Recent total</p>
              <p className="mt-1 text-2xl font-bold text-primary">{inr(revenueTotal)}</p>
            </div>

            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Latest day</span>
                <span className="font-semibold">{inr(todayRevenue)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Tracked days</span>
                <span className="font-semibold">{stats.revenueSeries.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="text-muted-foreground">Bill count</span>
                <span className="font-semibold">{stats.bills}</span>
              </div>
            </div>

            {stats.revenueSeries.length ? (
              <div className="rounded-xl border p-3 text-xs text-muted-foreground">
                <p className="mb-2 font-semibold text-foreground">Recent days</p>
                <div className="space-y-1.5">
                  {stats.revenueSeries.slice(-5).map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <span>{day.day}</span>
                      <span className="font-medium text-foreground">{inr(day.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                title="No billing data yet"
                description="Start billing to see truthful revenue summaries here."
                icon={<CircleDollarSign className="size-5" />}
                action={
                  <Link href="/app/billing" className={cn(buttonVariants({ size: "sm" }))}>
                    <ClipboardList className="size-4" /> Open billing
                  </Link>
                }
                className="min-h-52"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
