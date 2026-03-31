"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { upsertProductAction } from "@/app/actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { inr } from "@/lib/format";
import { productSchema } from "@/lib/validations/master";
import { z } from "zod";

type ProductRow = {
  name: string;
  sku: string;
  category: string;
  brand: string;
  unit: string;
  price: number;
  stock: number;
  variantSku?: string;
  variantSize?: string;
  variantColor?: string;
};

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductsModule({ products }: { products: ProductRow[] }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "General",
      brand: "Generic",
      unit: "pcs",
      price: 0,
      stock: 0,
      variantSku: "",
      variantSize: "",
      variantColor: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await upsertProductAction(values);
      form.reset({ ...values, name: "", sku: "" });
    });
  });

  const columns: ColumnDef<ProductRow>[] = [
    { accessorKey: "name", header: "Product" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "brand", header: "Brand" },
    { accessorKey: "unit", header: "Unit" },
    { accessorKey: "stock", header: "Stock" },
    {
      id: "variant",
      header: "Variant",
      cell: ({ row }) => [row.original.variantSize, row.original.variantColor].filter(Boolean).join("/") || "—",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => inr(Number(row.original.price || 0)),
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Add / update product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input {...form.register("name")} placeholder="Product name" />
            <Input {...form.register("sku")} placeholder="SKU" />
            <Input {...form.register("category")} placeholder="Category" />
            <Input {...form.register("brand")} placeholder="Brand" />
            <Input {...form.register("unit")} placeholder="Unit" />
            <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} placeholder="Price" />
            <Input type="number" step="0.01" {...form.register("stock", { valueAsNumber: true })} placeholder="Stock" />
            <Input {...form.register("variantSku")} placeholder="Variant SKU (optional)" />
            <div className="grid grid-cols-2 gap-2">
              <Input {...form.register("variantSize")} placeholder="Size" />
              <Input {...form.register("variantColor")} placeholder="Color" />
            </div>
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? "Saving..." : "Save product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={products} columns={columns} searchKey="name" searchPlaceholder="Search products" />
        </CardContent>
      </Card>
    </div>
  );
}
