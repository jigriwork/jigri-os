"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { saveSettingsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";

type SettingsFormProps = {
  initialValues: SettingsInput;
};

const toggleFields: Array<{ key: keyof Pick<
  SettingsInput,
  | "customerMobileRequired"
  | "barcodeEnabled"
  | "loyaltyEnabled"
  | "dueSalesEnabled"
  | "taxEnabled"
  | "variantsEnabled"
>; label: string }> = [
  { key: "customerMobileRequired", label: "Customer mobile required" },
  { key: "barcodeEnabled", label: "Barcode enabled" },
  { key: "loyaltyEnabled", label: "Loyalty enabled" },
  { key: "dueSalesEnabled", label: "Due sales enabled" },
  { key: "taxEnabled", label: "Tax enabled" },
  { key: "variantsEnabled", label: "Variants enabled" },
];

export function SettingsForm({ initialValues }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialValues,
  });
  const toggleValues = useWatch({ control: form.control });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await saveSettingsAction(values);
    });
  });

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle>Workspace configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2.5">
            <label className="text-sm font-medium">Company name</label>
            <Input {...form.register("companyName")} />
          </div>
          <div className="space-y-2.5">
            <label className="text-sm font-medium">Store name</label>
            <Input {...form.register("storeName")} />
          </div>
          <div className="space-y-2.5 md:col-span-2">
            <label className="text-sm font-medium">Business mode code</label>
            <Input {...form.register("businessMode")} placeholder="retail-standard" />
          </div>

          <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
            {toggleFields.map((field) => (
              <label key={field.key} className="flex items-center justify-between rounded-xl border bg-muted/20 p-3.5 text-sm">
                <span>{field.label}</span>
                <Switch
                  checked={Boolean(toggleValues[field.key])}
                  onCheckedChange={(checked) => form.setValue(field.key, checked)}
                />
              </label>
            ))}
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
