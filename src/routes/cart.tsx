import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitOrder } from "@/lib/shop/erp.functions";
import { useCart } from "@/lib/shop/cart";
import { fmt } from "@/lib/shop/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Поръчка | Virr Gold Shop" },
      { name: "description", content: "Завършете поръчката си за инвестиционно злато." },
      { property: "og:title", content: "Поръчка | Virr Gold Shop" },
      { property: "og:description", content: "Завършете поръчката си за инвестиционно злато." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, total } = useCart();
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const send = useServerFn(submitOrder);
  const { clear } = useCart();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) || "");
    setBusy(true); setErr("");
    try {
      const r = await send({ data: { customer: { name: g("name"), phone: g("phone"), email: g("email"), address: g("address"), payment: g("pay") }, lines: lines.map((l) => ({ id: l.id, qty: l.qty })) } });
      clear(); setDone(r.id);
    } catch (x) { setErr(x instanceof Error ? x.message : "Грешка при поръчката"); }
    setBusy(false);
  };
  const shipping = total > 0 && total < 1000 ? 15 : 0;
  if (done)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-medium">Благодарим за поръчката!</h1>
        <p className="mt-3 font-semibold">Номер на поръчка: {done}</p>
        <p className="mt-3 text-muted-foreground">Ще се свържем с вас за потвърждение и плащане.</p>
        <Link to="/" className="mt-8 inline-block rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground px-6 py-3 font-bold text-primary-foreground">Обратно към магазина</Link>
      </div>
    );
  if (!lines.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Количката е празна</h1>
        <Link to="/" className="mt-6 inline-block rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground px-6 py-3 font-bold text-primary-foreground">Разгледай продуктите</Link>
      </div>
    );
  const field = "w-full rounded-md border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-display text-4xl font-medium">Данни за доставка</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <input required name="name" placeholder="Име и фамилия" className={field} />
          <input required type="tel" name="phone" placeholder="Телефон" className={field} />
        </div>
        <input required type="email" name="email" placeholder="Имейл" className={field} />
        <input required name="address" placeholder="Адрес / офис на куриер" className={field} />
        <p className="pt-4 font-bold">Начин на плащане</p>
        {["Банков превод", "Карта", "Плащане в офис"].map((m, i) => (
          <label key={m} className="flex items-center gap-3 rounded-md border border-input bg-card px-4 py-3 text-sm">
            <input type="radio" name="pay" value={m} defaultChecked={i === 0} className="accent-primary" /> {m}
          </label>
        ))}
        <label className="flex items-start gap-2 pt-2 text-sm">
          <input required type="checkbox" className="mt-1 accent-primary" /> Съгласен съм с общите условия и политиката за поверителност.
        </label>
        {err && <p className="text-sm font-semibold text-destructive">{err}</p>}
        <Button variant="ghost" disabled={busy} className="w-full rounded-sm bg-primary hover:bg-primary/90 hover:text-primary-foreground py-3.5 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">{busy ? "Изпращане…" : "Потвърди поръчката"}</Button>
      </form>
      <aside className="h-fit rounded-md bg-card p-6 shadow-card">
        <h2 className="font-bold">Обобщение</h2>
        <div className="mt-4 space-y-3">
          {lines.map((l) => (
            <div key={l.id} className="flex justify-between gap-3 text-sm"><span className="min-w-0 truncate">{l.qty} × {l.product.name}</span><span className="shrink-0 font-semibold">{fmt(l.qty * l.product.price)}</span></div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between"><span>Доставка</span><span>{shipping ? fmt(shipping) : "Безплатна"}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Общо</span><span>{fmt(total + shipping)}</span></div>
        </div>
      </aside>
    </div>
  );
}
