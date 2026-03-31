import { prisma } from "@/lib/prisma";
import { getWorkspaceContext } from "@/lib/data/workspace";

export async function getDashboardStats() {
  const workspace = await getWorkspaceContext();
  const workspaceId = workspace.id;

  const [products, customers, suppliers, bills] = await Promise.all([
    prisma.product.count({ where: { workspaceId } }),
    prisma.customer.count({ where: { workspaceId } }),
    prisma.supplier.count({ where: { workspaceId } }),
    prisma.bill.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 14 }),
  ]);

  const revenueSeries = bills
    .map((bill: (typeof bills)[number]) => ({
      day: bill.createdAt.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      total: Number(bill.total),
    }))
    .reverse();

  return { products, customers, suppliers, bills: bills.length, revenueSeries };
}

export async function getMasterData() {
  const workspace = await getWorkspaceContext();
  const workspaceId = workspace.id;

  const [products, customers, suppliers, businessModes, activeModeSettings] = await Promise.all([
    prisma.product.findMany({
      where: { workspaceId },
      include: { category: true, brand: true, unit: true, variants: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.customer.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.supplier.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.businessMode.findMany({ where: { workspaceId }, orderBy: { name: "asc" } }),
    prisma.businessModeSettings.findFirst({
      where: { workspaceId },
      include: { businessMode: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return {
    workspace,
    products,
    customers,
    suppliers,
    businessModes,
    activeModeSettings,
  };
}

export async function getBillingData() {
  const workspace = await getWorkspaceContext();
  const workspaceId = workspace.id;

  const [products, recentBills] = await Promise.all([
    prisma.product.findMany({
      where: { workspaceId, active: true },
      include: { unit: true },
      orderBy: { name: "asc" },
      take: 400,
    }),
    prisma.bill.findMany({
      where: { workspaceId },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return { workspaceId, products, recentBills };
}
