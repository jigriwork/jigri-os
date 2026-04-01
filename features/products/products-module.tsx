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
    <div className="grid gap-6 xl:grid-cols-[390px,minmax(0,1fr)]">
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle>Add / update product</CardTitle>
          <p className="text-sm text-muted-foreground">Create new SKU records or update existing product references.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input {...form.register("name")} placeholder="Product name" className="h-9" />
            <Input {...form.register("sku")} placeholder="SKU" className="h-9" />
            <div className="grid grid-cols-2 gap-2">
              <Input {...form.register("category")} placeholder="Category" className="h-9" />
              <Input {...form.register("brand")} placeholder="Brand" className="h-9" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input {...form.register("unit")} placeholder="Unit" className="h-9" />
              <Input type="number" step="0.01" {...form.register("stock", { valueAsNumber: true })} placeholder="Stock" className="h-9" />
            </div>
            <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} placeholder="Price" className="h-9" />

            <div className="rounded-xl border bg-muted/20 p-2.5">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Variant (optional)</p>
              <Input {...form.register("variantSku")} placeholder="Variant SKU" className="mb-2 h-9" />
              <div className="grid grid-cols-2 gap-2">
                <Input {...form.register("variantSize")} placeholder="Size" className="h-9" />
                <Input {...form.register("variantColor")} placeholder="Color" className="h-9" />
              </div>
            </div>

            <Button disabled={isPending} type="submit" className="h-9 w-full">
              {isPending ? "Saving..." : "Save product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle>Product catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={products}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Search products"
            emptyTitle="No products available"
            emptyDescription="Add a product from the form to start billing and stock tracking."
          />
        </CardContent>
      </Card>
    </div>
  );
}
