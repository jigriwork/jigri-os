import { SuppliersModule } from "@/features/suppliers/suppliers-module";
import { getMasterData } from "@/lib/data/queries";

export default async function SuppliersPage() {
  const { suppliers } = await getMasterData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Suppliers</h1>
        <p className="text-sm text-muted-foreground">Supplier master records and contact system.</p>
      </div>

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
