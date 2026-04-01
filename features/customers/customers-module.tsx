"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { upsertCustomerAction } from "@/app/actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customerSchema } from "@/lib/validations/master";
import { z } from "zod";

type CustomerRow = {
  name: string;
  mobile: string;
  email: string;
};

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CustomersModule({ customers }: { customers: CustomerRow[] }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", mobile: "", email: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await upsertCustomerAction(values);
      form.reset();
    });
  });

  const columns: ColumnDef<CustomerRow>[] = [
    { accessorKey: "name", header: "Customer" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "email", header: "Email" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle>Add customer</CardTitle>
          <p className="text-sm text-muted-foreground">Capture customer identity for fast billing lookup and CRM continuity.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input {...form.register("mobile")} className="h-9" placeholder="Mobile (primary)" />
            <Input {...form.register("name")} className="h-9" placeholder="Name" />
            <Input {...form.register("email")} className="h-9" placeholder="Email (optional)" />
            <Button className="h-9 w-full" disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save customer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={customers}
            columns={columns}
            searchKey="mobile"
            searchPlaceholder="Search by mobile"
            emptyTitle="No customer records"
            emptyDescription="Add a customer to enable mobile-based lookup during billing."
          />
        </CardContent>
      </Card>
    </div>
  );
}
