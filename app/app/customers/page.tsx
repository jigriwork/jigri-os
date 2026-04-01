import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { CustomersModule } from "@/features/customers/customers-module";
import { getMasterData } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function CustomersPage() {
  const { customers } = await getMasterData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Customers"
        description="Maintain mobile-first customer records to speed up billing lookup and repeat retention workflows."
        actions={
          <>
            <Link href="/app/billing" className={cn(buttonVariants({ variant: "default" }))}>
              Open billing
            </Link>
            <Link href="/app/reports" className={cn(buttonVariants({ variant: "outline" }))}>
              View reports
            </Link>
          </>
        }
      />

      <CustomersModule
        customers={customers.map((c: (typeof customers)[number]) => ({
          name: c.name,
          mobile: c.mobile,
          email: c.email ?? "",
        }))}
      />
    </div>
  );
}
