import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { SuppliersModule } from "@/features/suppliers/suppliers-module";
import { getMasterData } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function SuppliersPage() {
  const { suppliers } = await getMasterData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Procurement"
        title="Suppliers"
        description="Track supplier contacts and keep procurement references consistent for inventory and purchase flows."
        actions={
          <>
            <Link href="/app/inventory" className={cn(buttonVariants({ variant: "outline" }))}>
              Inventory
            </Link>
            <Link href="/app/products" className={cn(buttonVariants({ variant: "default" }))}>
              Products
            </Link>
          </>
        }
      />

      <SuppliersModule
        suppliers={suppliers.map((s: (typeof suppliers)[number]) => ({
          name: s.name,
          mobile: s.mobile,
          email: s.email ?? "",
        }))}
      />
    </div>
  );
}
