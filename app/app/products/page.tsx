import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { ProductsModule } from "@/features/products/products-module";
import { getMasterData } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function ProductsPage() {
  const { products } = await getMasterData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Master Data"
        title="Products"
        description="Manage product catalog, SKU structure, and pricing references used by billing and inventory."
        actions={
          <>
            <Link href="/app/billing" className={cn(buttonVariants({ variant: "outline" }))}>
              Open billing
            </Link>
            <Link href="/app/inventory" className={cn(buttonVariants({ variant: "default" }))}>
              Inventory view
            </Link>
          </>
        }
      />

      <ProductsModule
        products={products.map((p: (typeof products)[number]) => ({
          name: p.name,
          sku: p.sku,
          category: p.category.name,
          brand: p.brand.name,
          unit: p.unit.name,
          price: Number(p.price),
          stock: Number(p.stock),
          variantSize: p.variants[0]?.size ?? undefined,
          variantColor: p.variants[0]?.color ?? undefined,
          variantSku: p.variants[0]?.sku ?? undefined,
        }))}
      />
    </div>
  );
}
