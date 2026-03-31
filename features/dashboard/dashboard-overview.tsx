"use client";

import { BarChart3, Package, Receipt, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", value: stats.products, icon: Package },
          { label: "Customers", value: stats.customers, icon: Users },
          { label: "Suppliers", value: stats.suppliers, icon: BarChart3 },
          { label: "Recent Bills", value: stats.bills, icon: Receipt },
        ].map((item) => (
          <Card key={item.label}>
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

      <Card>
        <CardHeader>
          <CardTitle>Revenue trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#0ea5e9" fill="#0ea5e955" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
