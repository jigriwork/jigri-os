import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inr } from "@/lib/format";
import { getBillingData } from "@/lib/data/queries";

export default async function ReportsPage() {
  const { recentBills } = await getBillingData();
  const totalRevenue = recentBills.reduce(
    (acc: number, bill: (typeof recentBills)[number]) => acc + Number(bill.total),
    0,
  );
  const holdCount = recentBills.filter((bill: (typeof recentBills)[number]) => bill.status === "HOLD").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">Quick operational reports and revenue snapshots.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total (recent)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{inr(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Saved bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {recentBills.filter((b: (typeof recentBills)[number]) => b.status === "SAVED").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hold bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{holdCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent bill feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentBills.map((bill: (typeof recentBills)[number]) => (
            <div key={bill.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
              <div>
                <p className="font-medium">{bill.billNumber}</p>
                <p className="text-muted-foreground">{bill.customer?.name ?? "Walk-in"}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{inr(Number(bill.total))}</p>
                <p className="text-xs text-muted-foreground">{bill.status}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
