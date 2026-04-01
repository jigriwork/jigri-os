import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { SettingsForm } from "@/features/settings/settings-form";
import { getMasterData } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
  const { workspace, activeModeSettings, businessModes } = await getMasterData();
  const company = workspace.companies[0];
  const store = workspace.stores[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Control workspace identity and operating toggles that influence billing, barcode flow, taxes, and variant behavior."
        actions={
          <>
            <Link href="/app/dashboard" className={cn(buttonVariants({ variant: "outline" }))}>
              Dashboard
            </Link>
            <Link href="/app/billing" className={cn(buttonVariants({ variant: "default" }))}>
              Open billing
            </Link>
          </>
        }
      />

      <SettingsForm
        initialValues={{
          companyName: company?.name ?? "",
          storeName: store?.name ?? "",
          businessMode: activeModeSettings?.businessMode?.code ?? businessModes[0]?.code ?? "retail-standard",
          customerMobileRequired: activeModeSettings?.customerMobileRequired ?? true,
          barcodeEnabled: activeModeSettings?.barcodeEnabled ?? true,
          loyaltyEnabled: activeModeSettings?.loyaltyEnabled ?? false,
          dueSalesEnabled: activeModeSettings?.dueSalesEnabled ?? true,
          taxEnabled: activeModeSettings?.taxEnabled ?? true,
          variantsEnabled: activeModeSettings?.variantsEnabled ?? true,
        }}
      />
    </div>
  );
}
