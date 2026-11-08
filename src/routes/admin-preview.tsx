import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, LayoutDashboard, Package, ShoppingBag, Users, Search, Eye, X, Database, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRODUCTS, CATEGORIES, fmt } from '@/lib/shop/products';
import { previewOrders, previewCustomers } from '@/lib/shop/admin-preview';

export const Route = createFileRoute('/admin-preview')({
  head: () => ({ meta: [
    { title: 'Admin preview | Virr Gold' },
    { name: 'description', content: 'Демонстрационен административен преглед на продукти, поръчки и клиенти във Virr Gold.' },
    { property: 'og:title', content: 'Admin preview | Virr Gold' },
    { property: 'og:description', content: 'Преглед на административния панел с примерни данни.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  component: AdminPreview,
});

const views = [
  { id: 'overview', title: 'Общ преглед', icon: LayoutDashboard },
  { id: 'products', title: 'Продукти', icon: Package },
  { id: 'orders', title: 'Поръчки', icon: ShoppingBag },
  { id: 'customers', title: 'Клиенти', icon: Users },
] as const;
type View = typeof views[number]['id'];
function AdminPreview() {
  const [view, setView] = useState<View>('overview');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const order = previewOrders.find(o => o.id === selectedOrder);
  const matches = (value: string) => value.toLocaleLowerCase('bg').includes(search.trim().toLocaleLowerCase('bg'));
  const products = PRODUCTS.filter(p => matches(`${p.name} ${p.mint}`) && (status === 'all' || (status === 'available' ? p.stock > 0 : p.stock === 0)));
  const orders = previewOrders.filter(o => matches(`${o.id} ${o.customer} ${o.product}`) && (status === 'all' || o.status === status));
  const customers = previewCustomers.filter(c => matches(`${c.id} ${c.name} ${c.type}`));
  function changeView(next: View) { setView(next); setSearch(''); setStatus('all'); setSelectedOrder(null); }
  const total = previewOrders.reduce((sum, o) => sum + o.total, 0);
  function orderTable(rows: typeof previewOrders) {
    return <div className="admin-table-scroll"><table><thead><tr><th>Поръчка / Клиент</th><th>Продукт</th><th>Сума</th><th>Статус</th><th>Дата</th><th><span className="admin-hidden-label">Детайли</span></th></tr></thead><tbody>{rows.map(o => <tr key={o.id}><td><strong>{o.id}</strong><small>{o.customer}</small></td><td>{o.product}</td><td className="admin-price">{fmt(o.total)}</td><td><span className={`admin-status ${o.status === 'Завършена' ? 'is-positive' : ''}`}>{o.status}</span></td><td>{o.date}</td><td><Button variant="ghost" size="icon" title="Преглед на поръчка" aria-label={`Преглед на ${o.id}`} onClick={() => setSelectedOrder(o.id)}><Eye /></Button></td></tr>)}</tbody></table>{rows.length === 0 && <p className="admin-empty">Няма намерени поръчки.</p>}</div>;
  }
  return <div className="admin-preview">
    <aside className="admin-sidebar">
      <Link to="/" className="admin-brand">VIRR <span>GOLD</span></Link>
      <span className="admin-caption">ADMIN PREVIEW</span>
      <nav aria-label="Административен преглед">{views.map(v => <Button key={v.id} variant={view === v.id ? 'secondary' : 'ghost'} aria-pressed={view === v.id} onClick={() => changeView(v.id)}><v.icon />{v.title}</Button>)}</nav>
      <div className="admin-sidebar-bottom"><Database /><span>Собствена ERP<small>Не е свързана</small></span></div>
      <Button asChild variant="outline"><Link to="/"><ArrowLeft />Към магазина</Link></Button>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><span>Virr Gold <span className="text-muted-foreground">/ Администрация</span></span><span className="admin-preview-badge"><Eye />Само преглед</span></header>
      <div className="admin-content">
        <div className="admin-title"><div><p className="admin-caption">КОНТРОЛЕН ПАНЕЛ</p><h1>{views.find(v => v.id === view)?.title}</h1></div><Button asChild variant="outline"><Link to="/"><ArrowUpRight />Магазин</Link></Button></div>
        <div className="admin-notice"><Eye /><p><strong>Демонстрационен режим</strong> · Примерни продукти, поръчки и клиенти. Без реални лични данни и без промени в ERP.</p></div>
        {view === 'overview' ? <>
          <div className="admin-metrics">{[
            { label: 'Стойност на поръчките', value: fmt(total), icon: ShoppingBag, note: '5 примерни поръчки' },
            { label: 'Продукти', value: PRODUCTS.length, icon: Package, note: 'В демонстрационния каталог' },
            { label: 'Клиенти', value: previewCustomers.length, icon: Users, note: 'Изцяло примерни профили' },
            { label: 'Нови поръчки', value: previewOrders.filter(o => o.status === 'Нова').length, icon: CircleCheck, note: 'Очакват потвърждение' },
          ].map(m => <article key={m.label}><div><span>{m.label}</span><m.icon /></div><strong>{m.value}</strong><small>{m.note}</small></article>)}</div>
          <section className="admin-section"><div className="admin-section-head"><h2>Последни поръчки</h2><Button variant="ghost" onClick={() => changeView('orders')}>Всички поръчки <ArrowUpRight /></Button></div>{orderTable(previewOrders)}</section>
          <section className="admin-section"><div className="admin-section-head"><h2>Наличности за внимание</h2><Button variant="ghost" onClick={() => changeView('products')}>Каталог <ArrowUpRight /></Button></div><div className="admin-stock-list">{PRODUCTS.filter(p => p.stock <= 6).map(p => <article key={p.id}><img src={p.image} alt={p.name}/><div><strong>{p.name}</strong><small>{p.mint}</small></div><span className={p.stock ? 'text-primary' : 'text-destructive'}>{p.stock ? `${p.stock} бр.` : 'Изчерпан'}</span></article>)}</div></section>
        </> : <>
          <div className="admin-toolbar"><label><Search aria-hidden="true"/><input aria-label="Търсене в админ прегледа" placeholder={view === 'products' ? 'Търси продукт или рафинерия…' : view === 'orders' ? 'Търси поръчка или клиент…' : 'Търси клиент…'} value={search} onChange={e => setSearch(e.target.value)}/></label>
            {view !== 'customers' && <select aria-label="Статус" value={status} onChange={e => setStatus(e.target.value)}><option value="all">Всички статуси</option>{view === 'products' ? <><option value="available">В наличност</option><option value="out">Изчерпан</option></> : ['Нова','Потвърдена','Изпратена','Завършена'].map(s => <option key={s}>{s}</option>)}</select>}
            <span>{view === 'products' ? products.length : view === 'orders' ? orders.length : customers.length} резултата</span>
          </div>
          {view === 'orders' ? orderTable(orders) : view === 'products' ? <div className="admin-table-scroll"><table><thead><tr><th>Продукт</th><th>Вид / Рафинерия</th><th>Цена продава</th><th>Цена купува</th><th>Наличност</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><div className="admin-product"><img src={p.image} alt={p.name}/><div><strong>{p.name}</strong><small>{p.id}</small></div></div></td><td>{CATEGORIES.find(c => c.id === p.category)?.label}<small>{p.mint}</small></td><td className="admin-price">{fmt(p.price)}</td><td>{fmt(p.buyback)}</td><td><span className={`admin-status ${p.stock ? 'is-positive' : 'is-out'}`}>{p.stock ? `В наличност · ${p.stock} бр.` : 'Изчерпан'}</span></td></tr>)}</tbody></table>{!products.length && <p className="admin-empty">Няма намерени продукти.</p>}</div> : <div className="admin-table-scroll"><table><thead><tr><th>Клиент</th><th>Вид</th><th>Поръчки</th><th>Обща стойност</th></tr></thead><tbody>{customers.map(c => <tr key={c.id}><td><strong>{c.name}</strong><small>{c.id}</small></td><td>{c.type}</td><td>{c.orders}</td><td className="admin-price">{fmt(c.total)}</td></tr>)}</tbody></table>{!customers.length && <p className="admin-empty">Няма намерени клиенти.</p>}</div>}
        </>}
        {order && <section className="admin-order-detail" aria-label="Детайли на поръчката"><div className="admin-section-head"><h2>{order.id}</h2><Button variant="ghost" size="icon" aria-label="Затвори детайли" onClick={() => setSelectedOrder(null)}><X /></Button></div><dl>{[['Клиент',order.customer],['Продукт',order.product],['Обща сума',fmt(order.total)],['Плащане',order.payment],['Статус',order.status],['Дата',order.date]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>}
        <footer className="admin-footer">VIRR GOLD <span>Демонстрационен административен преглед</span></footer>
      </div>
    </main>
  </div>;
}