"use client";

import { Menu, Sparkles, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { appNavigation } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeNav = appNavigation.find((item) => pathname.startsWith(item.href));

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        {mobileOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-black/45 backdrop-blur-[1px] md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[17.5rem] flex-col border-r bg-background p-4 transition-transform duration-200 md:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 rounded-2xl border bg-primary px-4 py-4 text-primary-foreground shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/70">JIGRI OS</p>
            <p className="mt-1 text-lg font-semibold leading-tight">Retail Operating System</p>
            <p className="mt-1 text-xs text-primary-foreground/75">Billing, inventory, CRM, and control all in one</p>
          </div>

          <nav className="space-y-1.5">
            {appNavigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "border-primary/25 bg-primary/10 font-medium text-primary shadow-sm"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border bg-muted/40 p-3 text-xs text-muted-foreground">
            <div className="mb-1.5 flex items-center gap-1.5 font-medium text-foreground">
              <Store className="size-3.5" /> Workspace active
            </div>
            <p>Retail mode configured for cashier operations and daily business control.</p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col md:pl-[17.5rem]">
          <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-3 md:px-8">
              <div className="flex items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileOpen((prev) => !prev)}
                >
                  <Menu className="size-5" />
                </Button>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">Workspace</p>
                  <p className="text-sm font-semibold">{activeNav?.label ?? "Operations"}</p>
                </div>
              </div>

              <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
                <Sparkles className="size-3.5" />
                Billing, inventory, CRM, and control all in one
              </div>

              <Badge variant="secondary">PWA Ready</Badge>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto w-full max-w-[1600px] px-3 py-4 md:px-8 md:py-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
