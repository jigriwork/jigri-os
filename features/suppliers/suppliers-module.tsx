"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { upsertSupplierAction } from "@/app/actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supplierSchema } from "@/lib/validations/master";
import { z } from "zod";

type SupplierRow = {
  name: string;
  mobile: string;
  email: string;
};

type SupplierFormValues = z.infer<typeof supplierSchema>;

export function SuppliersModule({ suppliers }: { suppliers: SupplierRow[] }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: "", mobile: "", email: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await upsertSupplierAction(values);
      form.reset();
    });
  });

  const columns: ColumnDef<SupplierRow>[] = [
    { accessorKey: "name", header: "Supplier" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "email", header: "Email" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Add supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input {...form.register("name")} placeholder="Supplier name" />
            <Input {...form.register("mobile")} placeholder="Mobile" />
            <Input {...form.register("email")} placeholder="Email (optional)" />
            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save supplier"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={suppliers} columns={columns} searchKey="name" searchPlaceholder="Search suppliers" />
        </CardContent>
      </Card>
    </div>
  );
}
