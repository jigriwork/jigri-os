import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const OFFLINE_WORKSPACE_ID = "offline-workspace";

type WorkspaceContext = Prisma.WorkspaceGetPayload<{
  include: {
    companies: true;
    stores: true;
    businessModes: true;
    modeSettings: { include: { businessMode: true } };
  };
}>;

const offlineMode: WorkspaceContext["businessModes"][number] = {
  id: "offline-mode",
  workspaceId: OFFLINE_WORKSPACE_ID,
  name: "Offline fallback",
  code: "offline-fallback",
  description: "Temporary fallback while database service is unreachable.",
};

const OFFLINE_WORKSPACE: WorkspaceContext = {
  id: OFFLINE_WORKSPACE_ID,
  tenantId: "offline-tenant",
  name: "Offline Workspace",
  createdAt: new Date(0),
  updatedAt: new Date(0),
  companies: [],
  stores: [],
  businessModes: [offlineMode],
  modeSettings: [
    {
      id: "offline-mode-settings",
      workspaceId: OFFLINE_WORKSPACE_ID,
      businessModeId: offlineMode.id,
      customerMobileRequired: true,
      barcodeEnabled: true,
      loyaltyEnabled: false,
      dueSalesEnabled: true,
      taxEnabled: true,
      variantsEnabled: true,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      businessMode: offlineMode,
    },
  ],
};

export function isDatabaseConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Cannot fetch data from service") ||
    message.includes("fetch failed") ||
    message.includes("Can't reach database") ||
    message.includes("Server has closed the connection") ||
    message.includes("Connection refused")
  );
}

export async function getWorkspaceContext() {
  try {
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
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      throw error;
    }

    console.warn("[workspace] Database unavailable, serving offline fallback context.", error);
    return OFFLINE_WORKSPACE;
  }
}
