"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { saveSettingsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";

type SettingsFormProps = {
  initialValues: SettingsInput;
};

export function SettingsForm({ initialValues }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await saveSettingsAction(values);
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company name</label>
            <Input {...form.register("companyName")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Store name</label>
            <Input {...form.register("storeName")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Business mode code</label>
            <Input {...form.register("businessMode")} placeholder="retail-standard" />
          </div>

          <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
            {[
              ["customerMobileRequired", "Customer mobile required"],
              ["barcodeEnabled", "Barcode enabled"],
              ["loyaltyEnabled", "Loyalty enabled"],
              ["dueSalesEnabled", "Due sales enabled"],
              ["taxEnabled", "Tax enabled"],
              ["variantsEnabled", "Variants enabled"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                {label}
                <input type="checkbox" {...form.register(key as keyof SettingsInput)} className="size-4" />
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
