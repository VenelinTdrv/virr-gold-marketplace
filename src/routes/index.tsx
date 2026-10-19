import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import hero from "@/assets/hero-luxury.jpg";
import { CATEGORIES, WEIGHT_RANGES, pricePerGram, type Category } from "@/lib/shop/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustBar } from "@/components/shop/Layout";
import { getCatalog } from "@/lib/shop/erp.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Инвестиционно злато | Virr Gold Shop" },
      { name: "description", content: "Купете златни кюлчета, инвестиционни и нумизматични монети с обратно изкупуване до 48 часа." },
      { property: "og:title", content: "Инвестиционно злато | Virr Gold Shop" },
      { property: "og:description", content: "Златни кюлчета и монети с LBMA сертификат и застрахована доставка." },
    ],
  }),
  loader: () => getCatalog(),
  component: Shop,
});

const SORTS = [
  { id: "popular", label: "Препоръчани" },
  { id: "price-asc", label: "Цена: възходящо" },
  { id: "price-desc", label: "Цена: низходящо" },
  { id: "ppg", label: "Най-ниска цена на грам" },
  { id: "weight", label: "Тегло" },
];

function Shop() {
  const PRODUCTS = Route.useLoaderData() ?? [];
  const MINTS = Array.from(new Set(PRODUCTS.map((x) => x.mint))).sort();
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [weights, setWeights] = useState<string[]>([]);
  const [mints, setMints] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(120000);
  const [sort, setSort] = useState("popular");
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const list = useMemo(() => {
    const r = PRODUCTS.filter(
      (p) =>
        (!q || (p.name + p.mint + p.country).toLowerCase().includes(q.toLowerCase())) &&
        (!cats.length || cats.includes(p.category)) &&
        (!weights.length || WEIGHT_RANGES.some((w) => weights.includes(w.id) && w.test(p.weightG))) &&
        (!mints.length || mints.includes(p.mint)) &&
        (!inStock || p.stock > 0) &&
        p.price <= maxPrice,
    );
    const s = [...r];
    if (sort === "price-asc") s.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") s.sort((a, b) => b.price - a.price);
    if (sort === "ppg") s.sort((a, b) => pricePerGram(a) - pricePerGram(b));
    if (sort === "weight") s.sort((a, b) => a.weightG - b.weightG);
    return s;
  }, [PRODUCTS, q, cats, weights, mints, inStock, maxPrice, sort]);

  const active = cats.length + weights.length + mints.length + (inStock ? 1 : 0) + (maxPrice < 120000 ? 1 : 0);
  const reset = () => { setCats([]); setWeights([]); setMints([]); setInStock(false); setMaxPrice(120000); };

  const filters = (
    <div className="space-y-6">
      <Group title="Категория">
        {CATEGORIES.map((c) => (
          <Check key={c.id} label={c.label} count={PRODUCTS.filter((p) => p.category === c.id).length} checked={cats.includes(c.id)} onChange={() => toggle(cats, c.id, setCats)} />
        ))}
      </Group>
      <Group title="Тегло">
        {WEIGHT_RANGES.map((w) => (
          <Check key={w.id} label={w.label} checked={weights.includes(w.id)} onChange={() => toggle(weights, w.id, setWeights)} />
        ))}
      </Group>
      <Group title={`Макс. цена: ${maxPrice.toLocaleString("bg-BG")} €`}>
        <input type="range" min={100} max={120000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary" />
      </Group>
      <Group title="Производител">
        {MINTS.map((m) => (
          <Check key={m} label={m} checked={mints.includes(m)} onChange={() => toggle(mints, m, setMints)} />
        ))}
      </Group>
      <Check label="Само в наличност" checked={inStock} onChange={() => setInStock(!inStock)} />
      {active > 0 && <Button variant="ghost" onClick={reset} className="text-sm font-semibold text-primary hover:underline">Изчисти филтрите ({active})</Button>}
    </div>
  );

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Златни кюлчета и монети" width={1600} height={800} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-shade" />
        <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">VIRR · GOLD COLLECTION</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-medium leading-tight text-hero-text md:text-5xl">Инвестиционно злато</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-hero-text/80">Кюлчета, инвестиционни и колекционерски монети от водещи световни рафинерии. С гарантирано обратно изкупуване.</p>
          <a href="#catalog" className="mt-8 inline-block rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground px-7 py-3 font-bold text-primary-foreground hover:opacity-90">Разгледай колекцията <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="border-b border-border py-5"><TrustBar /></div>

        <div className="mb-5 mt-8 flex items-baseline justify-between"><h2 className="font-display text-3xl font-medium">Колекцията</h2><span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">VIRR GOLD</span></div>
        <div className="flex flex-wrap gap-2 border-b border-border pb-5">
          <Chip active={!cats.length} onClick={() => setCats([])}>Всички</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={cats.length === 1 && cats[0] === c.id} onClick={() => setCats([c.id])}>{c.label}</Chip>
          ))}
        </div>

        <div id="catalog" className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="hidden lg:block"><div className="sticky top-24 border-r border-border pr-6">{filters}</div></aside>

          <div>
            <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex sm:items-center">
              <div className="relative min-w-0 sm:flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Търси продукт, монетен двор…" className="w-full rounded-sm border border-input bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button variant="ghost" onClick={() => setMobileFilters(true)} className="inline-flex items-center gap-2 rounded-sm border border-input bg-card px-4 py-2.5 text-sm font-semibold lg:hidden">
                <SlidersHorizontal className="h-4 w-4" /> Филтри{active ? ` (${active})` : ""}
              </Button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="col-span-2 rounded-sm border border-input bg-card px-4 py-2.5 text-sm sm:col-span-1">
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{list.length} продукта</p>
            {list.length ? (
              <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 md:gap-5">
                {list.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            ) : (
              <div className="rounded-md bg-card p-10 text-center shadow-card">
                <p className="font-semibold">Няма продукти по тези критерии.</p>
                <Button variant="ghost" onClick={reset} className="mt-3 text-sm font-semibold text-primary hover:underline">Изчисти филтрите</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-hero-ink/70" onClick={() => setMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-md bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Филтри</h2>
              <Button variant="ghost" onClick={() => setMobileFilters(false)} aria-label="Затвори"><X className="h-5 w-5" /></Button>
            </div>
            {filters}
            <Button variant="ghost" onClick={() => setMobileFilters(false)} className="mt-6 w-full rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground py-3 font-bold text-primary-foreground">Покажи {list.length} продукта</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><p className="mb-3 text-sm font-bold">{title}</p><div className="space-y-2">{children}</div></div>;
}
function Check({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-primary" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
    </label>
  );
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button variant="ghost" onClick={onClick} className={`rounded-sm px-4 py-2 text-sm font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent text-secondary-foreground hover:bg-secondary"}`}>{children}</Button>
  );
}
