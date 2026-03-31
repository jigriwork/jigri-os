export type AppToggleSettings = {
  customerMobileRequired: boolean;
  barcodeEnabled: boolean;
  loyaltyEnabled: boolean;
  dueSalesEnabled: boolean;
  taxEnabled: boolean;
  variantsEnabled: boolean;
};

export type SettingsPayload = {
  companyName: string;
  storeName: string;
  businessMode: string;
} & AppToggleSettings;

export type ProductPayload = {
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
