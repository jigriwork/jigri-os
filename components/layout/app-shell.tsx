"use client";

import { Menu } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r bg-background p-4 transition-transform duration-200 md:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 rounded-xl bg-primary p-4 text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">JIGRI OS</p>
            <p className="mt-1 text-lg font-semibold">Business Operating System</p>
          </div>
          <nav className="space-y-1">
            {appNavigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col md:pl-72">
          <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
            <div className="flex h-14 items-center justify-between px-4 md:px-6">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                <Menu className="size-5" />
              </Button>
              <p className="text-sm font-medium">Billing, inventory, CRM, and control all in one</p>
              <Badge variant="secondary">PWA Ready</Badge>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
