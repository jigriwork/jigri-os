import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { PosBilling } from "@/features/billing/pos-billing";
import { getBillingData } from "@/lib/data/queries";

export default async function BillingPage() {
  const { products, recentBills } = await getBillingData();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Billing"
        title="Billing POS"
        description="High-speed retail billing screen with customer lookup, dense line-item editing, and clear payable flow."
        meta={
          <>
            <Badge variant="secondary">{products.length} active products</Badge>
            <Badge variant="secondary">{recentBills.length} recent bills</Badge>
          </>
        }
      />

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
          id: bill.id,
          billNumber: bill.billNumber,
          total: Number(bill.total),
          status: bill.status,
          customerName: bill.customer?.name ?? null,
        }))}
      />
    </div>
  );
}
