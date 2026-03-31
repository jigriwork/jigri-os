import { z } from "zod";

export const settingsSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  storeName: z.string().min(2, "Store name is required"),
  businessMode: z.string().min(2, "Business mode is required"),
  customerMobileRequired: z.boolean(),
  barcodeEnabled: z.boolean(),
  loyaltyEnabled: z.boolean(),
  dueSalesEnabled: z.boolean(),
  taxEnabled: z.boolean(),
  variantsEnabled: z.boolean(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
