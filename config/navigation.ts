import {
  BarChart3,
  Boxes,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  Truck,
  Users,
} from "lucide-react";

export const appNavigation = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/billing", label: "Billing POS", icon: CreditCard },
  { href: "/app/products", label: "Products", icon: Package },
  { href: "/app/customers", label: "Customers", icon: Users },
  { href: "/app/suppliers", label: "Suppliers", icon: Truck },
  { href: "/app/inventory", label: "Inventory", icon: Boxes },
  { href: "/app/reports", label: "Reports", icon: BarChart3 },
  { href: "/app/settings", label: "Settings", icon: Settings },
] as const;
