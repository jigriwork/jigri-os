import { prisma } from "@/lib/prisma";

export async function getWorkspaceContext() {
  let workspace = await prisma.workspace.findFirst({
    include: {
      companies: true,
      stores: true,
      businessModes: true,
      modeSettings: { include: { businessMode: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!workspace) {
    const role = await prisma.role.upsert({
      where: { name: "OWNER" },
      update: {},
      create: { name: "OWNER", permissions: { all: true } },
    });

    const tenant = await prisma.tenant.create({
      data: {
        name: "Default Tenant",
        slug: `tenant-${Date.now()}`,
      },
    });

    workspace = await prisma.workspace.create({
      data: {
        tenantId: tenant.id,
        name: "Main Workspace",
        companies: {
          create: {
            name: "JIGRI Retail Pvt Ltd",
          },
        },
        stores: {
          create: {
            name: "Main Store",
            code: `STORE-${Date.now()}`,
          },
        },
        businessModes: {
          create: {
            name: "Retail Standard",
            code: "retail-standard",
            description: "Default retail mode",
          },
        },
      },
      include: {
        companies: true,
        stores: true,
        businessModes: true,
        modeSettings: { include: { businessMode: true } },
      },
    });

    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        workspaceId: workspace.id,
        roleId: role.id,
        name: "Owner",
        email: `owner-${Date.now()}@jigri.local`,
      },
    });

    const createdMode = workspace.businessModes[0];
    if (createdMode) {
      await prisma.businessModeSettings.create({
        data: {
          workspaceId: workspace.id,
          businessModeId: createdMode.id,
        },
      });
    }

    workspace = await prisma.workspace.findUniqueOrThrow({
      where: { id: workspace.id },
      include: {
        companies: true,
        stores: true,
        businessModes: true,
        modeSettings: { include: { businessMode: true } },
      },
    });
  }

  return workspace;
}
