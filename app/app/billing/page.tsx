import { PosBilling } from "@/features/billing/pos-billing";
import { getBillingData } from "@/lib/data/queries";

export default async function BillingPage() {
  const { products, recentBills } = await getBillingData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing POS</h1>
        <p className="text-sm text-muted-foreground">Fast touch-friendly POS for desktop, tablet, and mobile.</p>
      </div>

      <PosBilling
        products={products.map((p: (typeof products)[number]) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          price: Number(p.price),
          stock: Number(p.stock),
          unit: p.unit.name,
        }))}
        recentBills={recentBills.map((bill: (typeof recentBills)[number]) => ({
          billNumber: bill.billNumber,
          total: Number(bill.total),
          status: bill.status,
          customerName: bill.customer?.name ?? null,
        }))}
      />
    </div>
  );
}
