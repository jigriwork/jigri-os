import { CustomersModule } from "@/features/customers/customers-module";
import { getMasterData } from "@/lib/data/queries";

export default async function CustomersPage() {
  const { customers } = await getMasterData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">Mobile-first customer records for retail CRM.</p>
      </div>

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
