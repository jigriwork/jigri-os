"use client";

import { useMemo, useState, useTransition } from "react";

import {
  findCustomerByMobileAction,
  saveBillAction,
  upsertCustomerAction,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { inr } from "@/lib/format";

type PosProduct = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  unit: string;
};

type PosBill = {
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
  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    if (!query) return products.slice(0, 15);

    return products
      .filter((p) =>
        [p.name, p.sku].join(" ").toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 15);
  }, [products, query]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = Math.max(subtotal - discount + tax, 0);

  function addToCart(product: PosProduct) {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, item.stock || item.qty + 1) } : item,
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(productId: string, qty: number) {
    setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, qty: Math.max(1, qty) } : item)));
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function resetBill() {
    setCart([]);
    setDiscount(0);
    setTax(0);
    setCustomerMobile("");
    setCustomerName("");
  }

  function saveBill(status: "SAVED" | "HOLD") {
    if (!cart.length) return;
    startTransition(async () => {
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
    startTransition(async () => {
      const customer = await findCustomerByMobileAction(customerMobile);
      if (customer) setCustomerName(customer.name);
      else if (!customerName) setCustomerName("Quick Customer");
    });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr,1fr,0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Product entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Search by product name or SKU"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="grid max-h-[420px] gap-2 overflow-auto pr-1">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="rounded-lg border p-3 text-left hover:bg-muted"
              >
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sku}</p>
                <p className="mt-1 text-sm">{inr(product.price)}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bill editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-[360px] space-y-2 overflow-auto">
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add products to begin billing.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="rounded-lg border p-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.name}</p>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-destructive">
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, Number(e.target.value))}
                      className="w-20"
                    />
                    <p className="text-sm text-muted-foreground">
                      {inr(item.price)} × {item.qty} = {inr(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              type="number"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Tax"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer & summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Customer mobile"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              onBlur={lookupCustomer}
            />
            <Input
              placeholder="Customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-1 rounded-lg border p-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>- {inr(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{inr(tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
              <span>Total payable</span>
              <span>{inr(total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={resetBill}>
              New bill
            </Button>
            <Button variant="outline" onClick={() => setCart([])}>
              Clear bill
            </Button>
            <Button disabled={isPending} onClick={() => saveBill("HOLD")} variant="secondary">
              Hold bill
            </Button>
            <Button disabled={isPending} onClick={() => saveBill("SAVED")}>
              Save bill
            </Button>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent bills</p>
            <div className="space-y-1 text-sm">
              {recentBills.map((bill) => (
                <div key={bill.billNumber} className="flex items-center justify-between rounded-md border px-2 py-1">
                  <p>{bill.billNumber}</p>
                  <p>{inr(bill.total)}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
