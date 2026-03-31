import { ProductsModule } from "@/features/products/products-module";
import { getMasterData } from "@/lib/data/queries";

export default async function ProductsPage() {
  const { products } = await getMasterData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-sm text-muted-foreground">Category, brand, unit, and product master data.</p>
      </div>

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
