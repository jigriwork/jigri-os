import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inr } from "@/lib/format";
import { getBillingData } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function ReportsPage() {
  const { recentBills } = await getBillingData();
  const totalRevenue = recentBills.reduce(
    (acc: number, bill: (typeof recentBills)[number]) => acc + Number(bill.total),
    0,
  );
  const holdCount = recentBills.filter((bill: (typeof recentBills)[number]) => bill.status === "HOLD").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Reports"
        description="Truthful operational summaries from recent bills, useful for cashier and owner review cycles."
        actions={
          <>
            <Link href="/app/billing" className={cn(buttonVariants({ variant: "default" }))}>
              Open billing
            </Link>
            <Link href="/app/dashboard" className={cn(buttonVariants({ variant: "outline" }))}>
              Dashboard
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Total (recent)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{inr(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Saved bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {recentBills.filter((b: (typeof recentBills)[number]) => b.status === "SAVED").length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle>Hold bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{holdCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle>Recent bill feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentBills.length === 0 ? (
            <EmptyState
              title="No bill activity yet"
              description="Create bills to generate report entries here."
              className="min-h-52"
            />
          ) : (
            recentBills.map((bill: (typeof recentBills)[number]) => (
              <div key={bill.id} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{bill.billNumber}</p>
                  <p className="text-muted-foreground">{bill.customer?.name ?? "Walk-in"}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{inr(Number(bill.total))}</p>
                  <p className="text-xs text-muted-foreground">{bill.status}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
