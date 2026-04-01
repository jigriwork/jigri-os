import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { DashboardOverview } from "@/features/dashboard/dashboard-overview";
import { getDashboardStats } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Daily operating snapshot with practical shortcuts and readiness indicators for your retail workspace."
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
      <DashboardOverview stats={stats} />
    </div>
  );
}
