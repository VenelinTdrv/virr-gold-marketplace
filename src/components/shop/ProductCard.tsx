import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/shop/cart";
import { fmt, pricePerGram, type Product } from "@/lib/shop/products";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const out = p.stock === 0;
  return (
    <div className="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition duration-300 hover:border-primary/60">
      <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-square overflow-hidden bg-image-surface">
        <img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {p.badge && <span className="absolute left-3 top-3 rounded-sm bg-gold px-3 py-1 text-xs font-bold text-accent-foreground">{p.badge}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{p.mint} · {p.fineness}</p>
        <Link to="/product/$id" params={{ id: p.id }} className="mt-2 min-h-12 text-base font-medium leading-snug hover:text-primary">{p.name}</Link>
        <div className="mt-auto pt-4">
          <p className="text-xl font-semibold text-primary-deep">{fmt(p.price)}</p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{fmt(pricePerGram(p))} / g<br />Изкупуваме за {fmt(p.buyback)}</p>
          <p className={`mt-1 text-xs font-semibold ${out ? "text-destructive" : p.stock < 10 ? "text-accent-foreground" : "text-positive"}`}>
            {out ? "Изчерпан" : p.stock < 10 ? `Последни ${p.stock} бр.` : "В наличност"}
          </p>
          <Button variant="ghost" disabled={out} onClick={() => add(p)} className="mt-4 h-10 w-full rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground">
            {out ? "Изчерпан" : "Добави в количката"}
          </Button>
        </div>
      </div>
    </div>
  );
}
