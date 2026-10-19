import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";

type Line = { id: string; qty: number };
type Ctx = {
  lines: (Line & { product: Product })[];
  count: number;
  total: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartCtx = createContext<Ctx | null>(null);
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
  const lines = raw
    .map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.id)! }))
    .filter((l) => l.product);
  const clamp = (id: string, q: number) => {
    const s = PRODUCTS.find((p) => p.id === id)?.stock ?? 0;
    return Math.max(0, Math.min(s, q));
  };
  const value: Ctx = {
    lines,
    count: lines.reduce((a, l) => a + l.qty, 0),
    total: lines.reduce((a, l) => a + l.qty * l.product.price, 0),
    add: (id, qty = 1) => {
      const ex = raw.find((l) => l.id === id);
      const next = ex
        ? raw.map((l) => (l.id === id ? { ...l, qty: clamp(id, l.qty + qty) } : l))
        : [...raw, { id, qty: clamp(id, qty) }];
      save(next.filter((l) => l.qty > 0));
      setOpen(true);
    },
    setQty: (id, qty) =>
      save(raw.map((l) => (l.id === id ? { ...l, qty: clamp(id, qty) } : l)).filter((l) => l.qty > 0)),
    remove: (id) => save(raw.filter((l) => l.id !== id)),
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
