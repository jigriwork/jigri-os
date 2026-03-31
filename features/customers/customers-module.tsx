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
    <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Add customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input {...form.register("mobile")} placeholder="Mobile (primary)" />
            <Input {...form.register("name")} placeholder="Name" />
            <Input {...form.register("email")} placeholder="Email (optional)" />
            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save customer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={customers} columns={columns} searchKey="mobile" searchPlaceholder="Search by mobile" />
        </CardContent>
      </Card>
    </div>
  );
}
