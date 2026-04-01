import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMasterData } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function InventoryPage() {
  const { products } = await getMasterData();

  const lowStock = products.filter((p: (typeof products)[number]) => Number(p.stock) <= 5);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Inventory"
        description="Monitor SKU count and low-stock pressure so billing speed is not impacted by stock gaps."
        actions={
          <>
            <Link href="/app/products" className={cn(buttonVariants({ variant: "outline" }))}>
              Manage products
            </Link>
            <Link href="/app/reports" className={cn(buttonVariants({ variant: "default" }))}>
              Open reports
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{products.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Low stock items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{lowStock.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Variant enabled products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{products.filter((p: (typeof products)[number]) => p.variants.length > 0).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle>Low stock watchlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {lowStock.length === 0 ? (
            <EmptyState
              title="No low stock alerts"
              description="Stock levels are healthy across tracked SKUs."
              className="min-h-48"
            />
          ) : (
            lowStock.map((item: (typeof lowStock)[number]) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
                <span>{item.name}</span>
                <span>{Number(item.stock)} {item.unit.name}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
