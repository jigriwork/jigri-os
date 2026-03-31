import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMasterData } from "@/lib/data/queries";

export default async function InventoryPage() {
  const { products } = await getMasterData();

  const lowStock = products.filter((p: (typeof products)[number]) => Number(p.stock) <= 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="text-sm text-muted-foreground">Stock visibility across products and variants.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low stock items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{lowStock.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Variant enabled products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{products.filter((p: (typeof products)[number]) => p.variants.length > 0).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Low stock watchlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">No low stock alerts.</p>
          ) : (
            lowStock.map((item: (typeof lowStock)[number]) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
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
