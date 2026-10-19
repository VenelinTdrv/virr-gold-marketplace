import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/shop/cart";
import { fmt, pricePerGram, type Product } from "@/lib/shop/products";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const out = p.stock === 0;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition hover:-translate-y-1">
      <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-square overflow-hidden bg-secondary">
        <img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {p.badge && <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-accent-foreground">{p.badge}</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{p.mint} · {p.fineness}</p>
        <Link to="/product/$id" params={{ id: p.id }} className="mt-1 font-bold leading-snug hover:text-primary">{p.name}</Link>
        <div className="mt-auto pt-4">
          <p className="text-xl font-extrabold text-primary-deep">{fmt(p.price)}</p>
          <p className="text-xs text-muted-foreground">{fmt(pricePerGram(p))} / g · Изкупуваме за {fmt(p.buyback)}</p>
          <p className={`mt-1 text-xs font-semibold ${out ? "text-destructive" : p.stock < 10 ? "text-accent-foreground" : "text-primary"}`}>
            {out ? "Изчерпан" : p.stock < 10 ? `Последни ${p.stock} бр.` : "В наличност"}
          </p>
          <button disabled={out} onClick={() => add(p.id)} className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground">
            {out ? "Уведоми ме" : "Добави в количката"}
          </button>
        </div>
      </div>
    </div>
  );
}
