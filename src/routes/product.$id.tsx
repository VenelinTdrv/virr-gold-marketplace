import { Button } from "@/components/ui/button";
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
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
          ...(loaderData.product.image.startsWith("https://") ? [{ property: "og:image", content: loaderData.product.image }, { name: "twitter:image", content: loaderData.product.image }] : []),
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
        <div className="overflow-hidden rounded-md bg-image-surface">
          <img src={p.image} alt={p.name} width={816} height={816} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{CATEGORIES.find((c) => c.id === p.category)?.label}</p>
          <h1 className="mt-2 font-display text-4xl font-medium md:text-5xl">{p.name}</h1>
          <p className="mt-4 text-muted-foreground">{p.description}</p>
          <p className="mt-6 text-3xl font-semibold text-primary-deep">{fmt(p.price)}</p>
          <p className="text-sm text-muted-foreground">Освободено от ДДС · {fmt(pricePerGram(p))} / g</p>
          <p className={`mt-2 text-sm font-semibold ${out ? "text-destructive" : "text-primary"}`}>{out ? "Изчерпан" : `В наличност: ${p.stock} бр.`}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-sm border border-input bg-card">
              <Button variant="ghost" className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Намали"><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <Button variant="ghost" className="p-3" onClick={() => setQty(Math.min(p.stock || 1, qty + 1))} aria-label="Увеличи"><Plus className="h-4 w-4" /></Button>
            </div>
            <Button variant="ghost" disabled={out} onClick={() => add(p, qty)} className="flex-1 rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground py-3.5 font-bold text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground">
              {out ? "Изчерпан" : "Добави в количката"}
            </Button>
          </div>
          <dl className="mt-8 divide-y divide-border rounded-md bg-card shadow-card">
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
