import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, X, Minus, Plus, Trash2, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { useCart } from "@/lib/shop/cart";
import { fmt } from "@/lib/shop/products";
import type { ReactNode } from "react";

export function ShopHeader() {
  const { count, setOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link to="/" className="flex min-w-0 items-baseline gap-3">
          <span className="font-display text-3xl font-medium tracking-normal text-primary">VIRR</span>
          <span className="hidden truncate text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:inline">GOLD COLLECTION</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-secondary-foreground md:flex">
          <a href="https://virr.io" className="hover:text-primary">Virr.io</a>
          <Link to="/" className="hover:text-primary">Магазин</Link>
          <a href="#buyback" className="hover:text-primary">Обратно изкупуване</a>
        </nav>
        <Button variant="ghost"
          onClick={() => setOpen(true)}
          className="relative inline-flex shrink-0 items-center gap-2 rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          aria-label="Отвори количката"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Количка</span>
          {count > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-sm bg-card px-1 text-xs text-primary-deep">{count}</span>
          )}
        </Button>
      </div>
    </header>
  );
}

export function TrustBar() {
  const items = [
    { icon: ShieldCheck, t: "LBMA сертифицирано злато" },
    { icon: Truck, t: "Застрахована доставка" },
    { icon: RefreshCcw, t: "Обратно изкупуване до 48 ч" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ icon: I, t }) => (
        <div key={t} className="flex items-center justify-start gap-3 text-xs font-medium sm:justify-center">
          <I className="h-5 w-5 shrink-0 text-primary" /> {t}
        </div>
      ))}
    </div>
  );
}

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty, remove } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-hero-ink/70" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-xl font-bold">Вашата количка</h2>
          <Button variant="ghost" onClick={() => setOpen(false)} aria-label="Затвори"><X className="h-5 w-5" /></Button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {lines.length === 0 && <p className="text-muted-foreground">Количката е празна.</p>}
          {lines.map((l) => (
            <div key={l.id} className="flex gap-3">
              <img src={l.product.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{l.product.name}</p>
                <p className="text-sm text-muted-foreground">{fmt(l.product.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <QtyBtn onClick={() => setQty(l.id, l.qty - 1)}><Minus className="h-3 w-3" /></QtyBtn>
                  <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                  <QtyBtn onClick={() => setQty(l.id, l.qty + 1)}><Plus className="h-3 w-3" /></QtyBtn>
                  <Button variant="ghost" onClick={() => remove(l.id)} className="ml-auto text-muted-foreground hover:text-destructive" aria-label="Премахни"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3 border-t border-border p-5">
          <div className="flex justify-between text-sm text-muted-foreground"><span>Доставка</span><span>{total >= 1000 || total === 0 ? "Безплатна" : fmt(15)}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Общо</span><span>{fmt(total + (total > 0 && total < 1000 ? 15 : 0))}</span></div>
          <p className="text-xs text-muted-foreground">Инвестиционното злато е освободено от ДДС.</p>
          <Link to="/cart" onClick={() => setOpen(false)} className="block rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground py-3 text-center font-bold text-primary-foreground hover:opacity-90">Към поръчка</Link>
        </div>
      </aside>
    </div>
  );
}

function QtyBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <Button variant="ghost" onClick={onClick} className="grid h-7 w-7 place-items-center rounded-sm border border-border hover:bg-secondary">{children}</Button>;
}

export function ShopFooter() {
  return (
    <footer id="buyback" className="mt-16 border-t border-border bg-card text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl font-medium">VIRR</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-70">Money never sleeps</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-bold">Обратно изкупуване</p>
          <p className="mt-2">Изкупуваме обратно всеки продукт, закупен от нас, по актуална борсова цена в рамките на 48 часа.</p>
        </div>
        <div className="text-sm opacity-90">
          <p className="font-bold">Сигурност</p>
          <p className="mt-2">Всички пратки са застраховани и доставяни дискретно. Плащане по банков път или с карта.</p>
        </div>
      </div>
    </footer>
  );
}
