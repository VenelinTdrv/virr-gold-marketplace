import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { CATEGORIES, fmt, pricePerGram } from "@/lib/shop/products";
import { getCatalog } from "@/lib/shop/erp.functions";
import { useCart } from "@/lib/shop/cart";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustBar } from "@/components/shop/Layout";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    const all = await getCatalog();
    const product = all.find((x) => x.id === params.id);
    if (!product) throw notFound();
    return { product, all };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.product
      ? [
          { title: `${loaderData.product.name} | Virr Gold Shop` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} | Virr Gold Shop` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [{ title: "Продуктът не е намерен | Virr Gold Shop" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const data = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  if (!data?.product) return null;
  const { product: p, all } = data;
  const out = p.stock === 0;
  const related = all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const specs = [
    ["Тегло", `${p.weightG} g`],
    ["Чистота", p.fineness],
    ["Производител", p.mint],
    ["Държава", p.country],
    ...(p.year ? [["Година", String(p.year)]] : []),
    ["Цена на грам", fmt(pricePerGram(p))],
    ["Обратно изкупуване", fmt(p.buyback)],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"><ChevronLeft className="h-4 w-4" /> Към магазина</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-card shadow-card">
          <img src={p.image} alt={p.name} width={816} height={816} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{CATEGORIES.find((c) => c.id === p.category)?.label}</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{p.name}</h1>
          <p className="mt-4 text-muted-foreground">{p.description}</p>
          <p className="mt-6 text-4xl font-extrabold text-primary-deep">{fmt(p.price)}</p>
          <p className="text-sm text-muted-foreground">Освободено от ДДС · {fmt(pricePerGram(p))} / g</p>
          <p className={`mt-2 text-sm font-semibold ${out ? "text-destructive" : "text-primary"}`}>{out ? "Изчерпан" : `В наличност: ${p.stock} бр.`}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-input bg-card">
              <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Намали"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button className="p-3" onClick={() => setQty(Math.min(p.stock || 1, qty + 1))} aria-label="Увеличи"><Plus className="h-4 w-4" /></button>
            </div>
            <button disabled={out} onClick={() => add(p, qty)} className="flex-1 rounded-full bg-primary py-3.5 font-bold text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground">
              {out ? "Изчерпан" : "Добави в количката"}
            </button>
          </div>
          <dl className="mt-8 divide-y divide-border rounded-2xl bg-card shadow-card">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between px-5 py-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      <div className="mt-12"><TrustBar /></div>
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-display text-2xl font-bold">Подобни продукти</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
