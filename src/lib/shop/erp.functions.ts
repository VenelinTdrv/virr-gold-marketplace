import { createServerFn } from "@tanstack/react-start";
import { PRODUCTS, type Product } from "./products";

/**
 * ERP adapter. When ERP_API_URL is set, catalog and stock are read from the
 * ERP and orders are pushed to it. Without it, sample data is used.
 * Expected ERP endpoints (adjust mapping once the real API is known):
 *   GET  {ERP_API_URL}/products  -> Product[]
 *   POST {ERP_API_URL}/orders    -> { id: string }
 */
function erp() {
  const url = process.env["ERP_API_URL"];
  const key = process.env["ERP_API_KEY"];
  if (!url) return null;
  return {
    url: url.replace(/\/$/, ""),
    headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
  };
}

export const getCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  const c = erp();
  if (!c) return PRODUCTS;
  try {
    const r = await fetch(`${c.url}/products`, { headers: c.headers });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()) as Product[];
  } catch (e) {
    console.error("ERP catalog failed, using sample data", e);
    return PRODUCTS;
  }
});

type OrderInput = {
  customer: { name: string; phone: string; email: string; address: string; payment: string };
  lines: { id: string; qty: number }[];
};

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((d: OrderInput) => {
    if (!d?.lines?.length) throw new Error("Празна поръчка");
    if (!d.customer?.name || !d.customer?.email) throw new Error("Липсват данни");
    return d;
  })
  .handler(async ({ data }) => {
    const catalog = await getCatalog();
    for (const l of data.lines) {
      const p = catalog.find((x) => x.id === l.id);
      if (!p || l.qty < 1 || l.qty > p.stock) throw new Error(`Недостатъчна наличност: ${p?.name ?? l.id}`);
    }
    const c = erp();
    if (!c) return { id: `DEMO-${Date.now().toString(36).toUpperCase()}`, demo: true };
    const r = await fetch(`${c.url}/orders`, { method: "POST", headers: c.headers, body: JSON.stringify(data) });
    if (!r.ok) throw new Error("ERP отказа поръчката");
    const j = (await r.json()) as { id: string };
    return { id: j.id, demo: false };
  });
