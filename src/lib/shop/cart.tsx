import type React from "react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./products";

type Line = { id: string; qty: number; product: Product };
type Ctx = {
  lines: Line[];
  count: number;
  total: number;
  add: (product: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

// Keep one context instance across hot reloads so provider and consumers always match.
const g = globalThis as unknown as { __virrCartCtx?: React.Context<Ctx | null> };
const CartCtx = (g.__virrCartCtx ??= createContext<Ctx | null>(null));
const KEY = "virr-gold-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      setRaw(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
  }, []);
  const save = (l: Line[]) => {
    setRaw(l);
    localStorage.setItem(KEY, JSON.stringify(l));
  };
  const lines = raw.filter((l) => l.product);
  const clamp = (id: string, q: number) => {
    const s = raw.find((l) => l.id === id)?.product.stock ?? 0;
    return Math.max(0, Math.min(s, q));
  };
  const value: Ctx = {
    lines,
    count: lines.reduce((a, l) => a + l.qty, 0),
    total: lines.reduce((a, l) => a + l.qty * l.product.price, 0),
    add: (product, qty = 1) => {
      const id = product.id;
      const ex = raw.find((l) => l.id === id);
      const lim = (q: number) => Math.max(0, Math.min(product.stock, q));
      const next = ex
        ? raw.map((l) => (l.id === id ? { ...l, product, qty: lim(l.qty + qty) } : l))
        : [...raw, { id, product, qty: lim(qty) }];
      save(next.filter((l) => l.qty > 0));
      setOpen(true);
    },
    setQty: (id, qty) =>
      save(raw.map((l) => (l.id === id ? { ...l, qty: clamp(id, qty) } : l)).filter((l) => l.qty > 0)),
    remove: (id) => save(raw.filter((l) => l.id !== id)),
    clear: () => save([]),
    open,
    setOpen,
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
};
