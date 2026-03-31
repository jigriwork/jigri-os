"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getWorkspaceContext } from "@/lib/data/workspace";
import { billSchema, customerSchema, productSchema, supplierSchema } from "@/lib/validations/master";
import { settingsSchema } from "@/lib/validations/settings";

async function workspaceId() {
  const workspace = await getWorkspaceContext();
  return workspace.id;
}

export async function saveSettingsAction(input: unknown) {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid data" };

  const wsId = await workspaceId();
  const { companyName, storeName, businessMode, ...toggles } = parsed.data;

  const company = await prisma.company.findFirst({ where: { workspaceId: wsId } });
  if (company) await prisma.company.update({ where: { id: company.id }, data: { name: companyName } });
  else await prisma.company.create({ data: { name: companyName, workspaceId: wsId } });

  const store = await prisma.store.findFirst({ where: { workspaceId: wsId } });
  if (store) await prisma.store.update({ where: { id: store.id }, data: { name: storeName } });
  else await prisma.store.create({ data: { name: storeName, workspaceId: wsId, code: `STORE-${Date.now()}` } });

  let mode = await prisma.businessMode.findFirst({ where: { workspaceId: wsId, code: businessMode } });
  if (!mode) {
    mode = await prisma.businessMode.create({
      data: {
        workspaceId: wsId,
        code: businessMode,
        name: businessMode.replace(/-/g, " "),
      },
    });
  }

  await prisma.businessModeSettings.upsert({
    where: { workspaceId_businessModeId: { workspaceId: wsId, businessModeId: mode.id } },
    update: toggles,
    create: { workspaceId: wsId, businessModeId: mode.id, ...toggles },
  });

  revalidatePath("/app/settings");
  return { ok: true, message: "Settings saved" };
}

export async function upsertProductAction(input: unknown) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid product" };
  const wsId = await workspaceId();
  const data = parsed.data;

  const category = await prisma.category.upsert({
    where: { workspaceId_name: { workspaceId: wsId, name: data.category } },
    update: {},
    create: { workspaceId: wsId, name: data.category },
  });
  const brand = await prisma.brand.upsert({
    where: { workspaceId_name: { workspaceId: wsId, name: data.brand } },
    update: {},
    create: { workspaceId: wsId, name: data.brand },
  });
  const unit = await prisma.unit.upsert({
    where: { workspaceId_name: { workspaceId: wsId, name: data.unit } },
    update: {},
    create: { workspaceId: wsId, name: data.unit },
  });

  const product = await prisma.product.upsert({
    where: { workspaceId_sku: { workspaceId: wsId, sku: data.sku } },
    update: {
      name: data.name,
      price: data.price,
      stock: data.stock,
      categoryId: category.id,
      brandId: brand.id,
      unitId: unit.id,
    },
    create: {
      workspaceId: wsId,
      name: data.name,
      sku: data.sku,
      price: data.price,
      stock: data.stock,
      categoryId: category.id,
      brandId: brand.id,
      unitId: unit.id,
    },
  });

  if (data.variantSku) {
    await prisma.productVariant.upsert({
      where: { sku: data.variantSku },
      update: {
        size: data.variantSize || null,
        color: data.variantColor || null,
      },
      create: {
        productId: product.id,
        sku: data.variantSku,
        size: data.variantSize || null,
        color: data.variantColor || null,
      },
    });
  }

  revalidatePath("/app/products");
  revalidatePath("/app/billing");
  return { ok: true, message: "Product saved" };
}

export async function upsertCustomerAction(input: unknown) {
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid customer" };
  const wsId = await workspaceId();
  const data = parsed.data;

  await prisma.customer.upsert({
    where: { workspaceId_mobile: { workspaceId: wsId, mobile: data.mobile } },
    update: { name: data.name, email: data.email || null },
    create: { workspaceId: wsId, mobile: data.mobile, name: data.name, email: data.email || null },
  });

  revalidatePath("/app/customers");
  revalidatePath("/app/billing");
  return { ok: true, message: "Customer saved" };
}

export async function upsertSupplierAction(input: unknown) {
  const parsed = supplierSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid supplier" };
  const wsId = await workspaceId();
  const data = parsed.data;

  await prisma.supplier.upsert({
    where: { workspaceId_mobile: { workspaceId: wsId, mobile: data.mobile } },
    update: { name: data.name, mobile: data.mobile, email: data.email || null },
    create: {
      workspaceId: wsId,
      name: data.name,
      mobile: data.mobile,
      email: data.email || null,
    },
  });

  revalidatePath("/app/suppliers");
  return { ok: true, message: "Supplier saved" };
}

export async function lookupOrCreateCustomerByMobile(mobile: string, fallbackName?: string) {
  const wsId = await workspaceId();
  let customer = await prisma.customer.findUnique({ where: { workspaceId_mobile: { workspaceId: wsId, mobile } } });

  if (!customer && fallbackName) {
    customer = await prisma.customer.create({
      data: {
        workspaceId: wsId,
        mobile,
        name: fallbackName,
      },
    });
  }

  return customer;
}

export async function findCustomerByMobileAction(mobile: string) {
  const wsId = await workspaceId();
  if (!mobile) return null;

  return prisma.customer.findUnique({
    where: { workspaceId_mobile: { workspaceId: wsId, mobile } },
  });
}

export async function saveBillAction(input: unknown) {
  const parsed = billSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid bill data" };

  const wsId = await workspaceId();
  const data = parsed.data;

  let customerId: string | null = null;
  if (data.customerMobile) {
    const customer = await lookupOrCreateCustomerByMobile(data.customerMobile, data.customerName);
    customerId = customer?.id ?? null;
  }

  const subtotal = data.items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const total = subtotal - data.discount + data.tax;

  const bill = await prisma.bill.create({
    data: {
      workspaceId: wsId,
      customerId,
      billNumber: `BILL-${Date.now()}`,
      status: data.status,
      subtotal,
      discount: data.discount,
      tax: data.tax,
      total,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.qty,
          price: item.price,
          lineTotal: item.qty * item.price,
        })),
      },
    },
  });

  revalidatePath("/app/billing");
  revalidatePath("/app/reports");
  return { ok: true, message: `Bill ${bill.billNumber} saved` };
}
