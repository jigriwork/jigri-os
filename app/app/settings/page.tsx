import { SettingsForm } from "@/features/settings/settings-form";
import { getMasterData } from "@/lib/data/queries";

export default async function SettingsPage() {
  const { workspace, activeModeSettings, businessModes } = await getMasterData();
  const company = workspace.companies[0];
  const store = workspace.stores[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure company, stores, and business behavior toggles.</p>
      </div>

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
