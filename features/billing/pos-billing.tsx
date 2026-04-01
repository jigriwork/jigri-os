"use client";

import {
  Barcode,
  Minus,
  PauseCircle,
  PlayCircle,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  ShoppingCart,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useMemo, useRef, useState, useTransition } from "react";

import {
  findCustomerByMobileAction,
  saveBillAction,
  upsertCustomerAction,
} from "@/app/actions";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

type PosProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  unit: string;
};

type PosBill = {
  id: string;
  billNumber: string;
  total: number;
  customerName: string | null;
  status: string;
};

type CartItem = PosProduct & { qty: number };

export function PosBilling({ products, recentBills }: { products: PosProduct[]; recentBills: PosBill[] }) {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerLookupState, setCustomerLookupState] = useState<"idle" | "found" | "new">("idle");
  const [actionNotice, setActionNotice] = useState("");
  const [isSaving, startSaveTransition] = useTransition();
  const [isLookingUp, startLookupTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const customerMobileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredProducts = useMemo(() => {
    if (!query) return products.slice(0, 15);

    return products
      .filter((p) =>
        [p.name, p.sku].join(" ").toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 15);
  }, [products, query]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalBeforeRoundOff = Math.max(subtotal - discount + tax, 0);
  const roundOff = Math.round(totalBeforeRoundOff) - totalBeforeRoundOff;
  const payable = Math.max(totalBeforeRoundOff + roundOff, 0);
  const holdBills = recentBills.filter((bill) => bill.status === "HOLD");

  function addToCart(product: PosProduct) {
    setActionNotice("");
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        const maxQty = found.stock > 0 ? found.stock : found.qty + 1;
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, maxQty) } : item,
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(productId: string, qty: number) {
    setActionNotice("");
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        const maxQty = item.stock > 0 ? item.stock : qty;
        return { ...item, qty: Math.max(1, Math.min(qty, maxQty)) };
      }),
    );
  }

  function removeItem(productId: string) {
    setActionNotice("");
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function resetBill() {
    setCart([]);
    setDiscount(0);
    setTax(0);
    setCustomerMobile("");
    setCustomerName("");
    setCustomerLookupState("idle");
    setActionNotice("");
  }

  function saveBill(status: "SAVED" | "HOLD") {
    if (!cart.length) return;
    startSaveTransition(async () => {
      if (customerMobile && customerName) {
        await upsertCustomerAction({ mobile: customerMobile, name: customerName, email: "" });
      }

      await saveBillAction({
        customerMobile,
        customerName,
        discount,
        tax,
        status,
        items: cart.map((item) => ({ productId: item.id, qty: item.qty, price: item.price })),
      });
      resetBill();
    });
  }

  function lookupCustomer() {
    if (!customerMobile) return;
    startLookupTransition(async () => {
      const customer = await findCustomerByMobileAction(customerMobile);
      if (customer) {
        setCustomerName(customer.name);
        setCustomerLookupState("found");
      } else {
        if (!customerName) setCustomerName("Quick Customer");
        setCustomerLookupState("new");
      }
    });
  }

  function showPlaceholderAction(message: string) {
    setActionNotice(message);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-4">
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>Product entry</CardTitle>
                  <p className="text-xs text-muted-foreground">Search by name, SKU, or barcode and press Enter to add fast.</p>
                </div>
                <Badge variant="secondary">{cart.reduce((acc, item) => acc + item.qty, 0)} items</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    className="h-10 pl-9"
                    placeholder="Search product / SKU / barcode"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const firstProduct = filteredProducts[0];
                        if (firstProduct) addToCart(firstProduct);
                      }
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  className="h-10 gap-1.5"
                  onClick={() => showPlaceholderAction("Barcode scanner integration can be wired here.")}
                >
                  <Barcode className="size-4" /> Scan
                </Button>
              </div>

              <div className="grid max-h-56 gap-2 overflow-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="rounded-xl border bg-background px-3 py-2.5 text-left transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{product.sku}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-semibold">{inr(product.price)}</span>
                      <span className="text-muted-foreground">Stock {product.stock}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-4" /> Bill items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <EmptyState
                  title="No items in this bill yet"
                  description="Start by searching a product or scanning a barcode. First match can be added quickly with Enter key."
                  className="min-h-64"
                />
              ) : (
                <div className="overflow-hidden rounded-xl border">
                  <div className="overflow-x-auto">
                    <div className="grid min-w-[760px] grid-cols-[minmax(0,1.8fr)_150px_110px_90px_120px_40px] bg-muted/40 px-3 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      <span>Item</span>
                      <span>Qty</span>
                      <span>Rate</span>
                      <span>Disc</span>
                      <span>Total</span>
                      <span />
                    </div>
                  </div>
                  <div className="max-h-[420px] overflow-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="grid min-w-[760px] grid-cols-[minmax(0,1.8fr)_150px_110px_90px_120px_40px] items-center border-t px-3 py-2.5 text-sm"
                      >
                        <div>
                          <p className="line-clamp-1 font-medium">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.sku}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button size="icon-xs" variant="outline" onClick={() => updateQty(item.id, item.qty - 1)}>
                            <Minus className="size-3" />
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            max={item.stock || undefined}
                            value={item.qty}
                            className="h-8 w-14 text-center"
                            onChange={(e) => updateQty(item.id, Number(e.target.value) || 1)}
                          />
                          <Button size="icon-xs" variant="outline" onClick={() => updateQty(item.id, item.qty + 1)}>
                            <Plus className="size-3" />
                          </Button>
                        </div>

                        <p>{inr(item.price)}</p>
                        <p className="text-muted-foreground">—</p>
                        <p className="font-semibold">{inr(item.price * item.qty)}</p>

                        <Button size="icon-xs" variant="ghost" onClick={() => removeItem(item.id)}>
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:sticky xl:top-20 xl:h-fit">
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle>Customer & totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Customer mobile</label>
                <Input
                  ref={customerMobileInputRef}
                  placeholder="Enter mobile"
                  value={customerMobile}
                  onChange={(e) => {
                    setCustomerMobile(e.target.value);
                    setCustomerLookupState("idle");
                  }}
                  onBlur={lookupCustomer}
                />
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      "font-medium",
                      customerLookupState === "found" && "text-emerald-600",
                      customerLookupState === "new" && "text-amber-600",
                      customerLookupState === "idle" && "text-muted-foreground",
                    )}
                  >
                    {isLookingUp
                      ? "Looking up customer..."
                      : customerLookupState === "found"
                        ? "Existing customer found"
                        : customerLookupState === "new"
                          ? "New customer will be created"
                          : "Lookup runs on field blur"}
                  </span>
                  <Button size="xs" variant="ghost" onClick={lookupCustomer} disabled={!customerMobile || isLookingUp}>
                    Lookup
                  </Button>
                </div>

                <Input
                  placeholder="Customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="rounded-xl border bg-muted/25 p-3">
                <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Bill adjustments</p>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  <Input
                    type="number"
                    value={discount}
                    min={0}
                    placeholder="Bill discount"
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    value={tax}
                    min={0}
                    placeholder="Tax"
                    onChange={(e) => setTax(Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2 rounded-xl border bg-background p-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{inr(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>- {inr(discount)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{inr(tax)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Round off</span>
                  <span>{inr(roundOff)}</span>
                </div>

                <div className="mt-1 rounded-lg bg-primary/10 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wide text-primary uppercase">Payable</span>
                    <span className="text-2xl font-bold text-primary">{inr(payable)}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Button disabled={isSaving || cart.length === 0} className="h-10" onClick={() => saveBill("SAVED")}>
                  <Save className="size-4" /> Complete & save bill
                </Button>
                <Button
                  variant="secondary"
                  disabled={isSaving || cart.length === 0}
                  className="h-10"
                  onClick={() => saveBill("HOLD")}
                >
                  <PauseCircle className="size-4" /> Hold bill
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Recent bills</p>
                <div className="space-y-1.5">
                  {recentBills.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-2 text-xs text-muted-foreground">No recent bills yet.</p>
                  ) : (
                    recentBills.slice(0, 6).map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between rounded-lg border px-2.5 py-2 text-xs">
                        <div>
                          <p className="font-semibold">{bill.billNumber}</p>
                          <p className="text-muted-foreground">{bill.customerName ?? "Walk-in"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{inr(bill.total)}</p>
                          <p className={cn("font-medium", bill.status === "HOLD" ? "text-amber-600" : "text-emerald-600")}>
                            {bill.status}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="sticky bottom-2 z-10 rounded-2xl border bg-background/95 py-3 shadow-lg backdrop-blur">
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={resetBill}>
              <RotateCcw className="size-4" /> New Bill
            </Button>
            <Button variant="outline" disabled={isSaving || cart.length === 0} onClick={() => saveBill("HOLD")}>
              <PauseCircle className="size-4" /> Hold Bill
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                showPlaceholderAction(
                  holdBills.length
                    ? "Resume hold fetch is pending backend support for hold bill line recovery."
                    : "No hold bills available to resume right now.",
                )
              }
            >
              <PlayCircle className="size-4" /> Resume Hold
            </Button>
            <Button variant="outline" onClick={() => setCart([])}>
              <Trash2 className="size-4" /> Clear
            </Button>
            <Button disabled={isSaving || cart.length === 0} onClick={() => saveBill("SAVED")}>
              <Save className="size-4" /> Save Bill
            </Button>
            <Button variant="outline" onClick={() => showPlaceholderAction("Print layout placeholder ready for invoice template wiring.")}>
              <Printer className="size-4" /> Print
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                customerMobileInputRef.current?.focus();
                if (!customerName) setCustomerName("Quick Customer");
              }}
            >
              <UserPlus className="size-4" /> Add Customer
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-1">Lines {cart.length}</span>
            <span className="rounded-md bg-muted px-2 py-1">Payable {inr(payable)}</span>
            {actionNotice ? <span className="rounded-md bg-amber-100 px-2 py-1 text-amber-700">{actionNotice}</span> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
