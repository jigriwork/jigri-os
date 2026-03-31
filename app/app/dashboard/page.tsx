import { DashboardOverview } from "@/features/dashboard/dashboard-overview";
import { getDashboardStats } from "@/lib/data/queries";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Business pulse across billing, inventory, and CRM.</p>
      </div>
      <DashboardOverview stats={stats} />
    </div>
  );
}
