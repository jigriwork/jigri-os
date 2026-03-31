import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  category: z.string().min(2),
  brand: z.string().min(2),
  unit: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().min(0),
  variantSku: z.string().optional(),
  variantSize: z.string().optional(),
  variantColor: z.string().optional(),
});

export const customerSchema = z.object({
  mobile: z.string().min(8),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
});

export const supplierSchema = z.object({
  name: z.string().min(2),
  mobile: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
});

export const billSchema = z.object({
  customerMobile: z.string().optional(),
  customerName: z.string().optional(),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  status: z.enum(["SAVED", "HOLD"]),
  items: z.array(
    z.object({
      productId: z.string(),
      qty: z.number().positive(),
      price: z.number().min(0),
    }),
  ),
});
