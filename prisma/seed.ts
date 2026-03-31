import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const role = await prisma.role.upsert({
    where: { name: "OWNER" },
    update: {},
    create: { name: "OWNER", permissions: { fullAccess: true } },
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: "jigri-default" },
    update: {},
    create: { name: "JIGRI Default Tenant", slug: "jigri-default" },
  });

  let workspace = await prisma.workspace.findFirst({ where: { tenantId: tenant.id } });
  if (!workspace) {
    workspace = await prisma.workspace.create({ data: { name: "Main Workspace", tenantId: tenant.id } });
  }

  await prisma.company.upsert({
    where: { id: `company-${workspace.id}` },
    update: { name: "JIGRI Retail Pvt Ltd" },
    create: { id: `company-${workspace.id}`, workspaceId: workspace.id, name: "JIGRI Retail Pvt Ltd" },
  });

  await prisma.store.upsert({
    where: { code: "MAIN-STORE" },
    update: { name: "Main Store", workspaceId: workspace.id },
    create: { workspaceId: workspace.id, name: "Main Store", code: "MAIN-STORE" },
  });

  await prisma.user.upsert({
    where: { email: "owner@jigri.local" },
    update: { roleId: role.id, workspaceId: workspace.id, tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      workspaceId: workspace.id,
      roleId: role.id,
      name: "Workspace Owner",
      email: "owner@jigri.local",
      mobile: "9999999999",
    },
  });

  const mode = await prisma.businessMode.upsert({
    where: { workspaceId_code: { workspaceId: workspace.id, code: "retail-standard" } },
    update: { name: "Retail Standard" },
    create: {
      workspaceId: workspace.id,
      name: "Retail Standard",
      code: "retail-standard",
      description: "Retail default mode",
    },
  });

  await prisma.businessModeSettings.upsert({
    where: { workspaceId_businessModeId: { workspaceId: workspace.id, businessModeId: mode.id } },
    update: {},
    create: {
      workspaceId: workspace.id,
      businessModeId: mode.id,
      customerMobileRequired: true,
      barcodeEnabled: true,
      loyaltyEnabled: true,
      dueSalesEnabled: true,
      taxEnabled: true,
      variantsEnabled: true,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
