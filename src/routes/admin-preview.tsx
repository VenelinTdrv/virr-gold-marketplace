import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Menu, Search, X, ChevronDown, ChevronRight, Folder, Eye, ArrowLeft, MoreVertical, Globe, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewSwitch } from '@/components/shop/ViewSwitch';
import { PRODUCTS, CATEGORIES, fmt } from '@/lib/shop/products';
import { previewOrders, previewCustomers } from '@/lib/shop/admin-preview';
import { adminGroups, adminItems, adminTables, isAdminSection, type AdminSection, type PreviewTable } from '@/lib/shop/admin-sections';

export const Route = createFileRoute('/admin-preview')({
  validateSearch: (search: Record<string, unknown>): { section?: AdminSection } => {
    const section = search['section'];
    return isAdminSection(section) ? { section } : {};
  },
  head: () => ({ meta: [
    { title: 'Admin panel preview | Virr Gold' },
    { name: 'description', content: 'Примерен административен панел на Virr Gold по HyperERP: артикули, операции, справки и администрация.' },
    { property: 'og:title', content: 'Admin panel preview | Virr Gold' },
    { property: 'og:description', content: 'Административен преглед с примерни данни, без реални промени в HyperERP.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  component: AdminPreview,
});

function AdminPreview() {
  useEffect(() => {
    // The uploaded shop stylesheet has global selectors and survives client navigation.
    const shopStyles = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).filter(link => link.href.endsWith('/gold/custom.css'));
    for (const link of shopStyles) link.disabled = true;
    return () => { for (const link of shopStyles) link.disabled = false; };
  }, []);
  const { section = 'products' } = Route.useSearch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [closedGroups, setClosedGroups] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [query, setQuery] = useState({ name: '', code: '' });
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<{ title: string; values: [string, string][] } | null>(null);
  const active = adminItems.find(i => i.id === section);
  const group = adminGroups.find(g => g.items.some(i => i.id === section));
  const productView = ['products', 'product-stock', 'out-of-stock'].includes(section);
  const matches = (text: string, value: string) => text.toLocaleLowerCase('bg').includes(value.trim().toLocaleLowerCase('bg'));
  function changeSection(next: AdminSection) {
    setName(''); setCode(''); setQuery({ name: '', code: '' }); setCategory('all'); setSelected([]); setDetail(null);
    void navigate({ to: '/admin-preview', search: { section: next } });
  }
  let table: PreviewTable;
  if (['orders','sales','payments'].includes(section)) {
    table = { columns: ['Номер','Клиент','Артикул','Сума','Статус','Дата'], rows: previewOrders.filter(o => section !== 'sales' || o.status === 'Завършена').map(o => [o.id,o.customer,o.product,fmt(o.total),section === 'payments' ? o.payment : o.status,o.date]) };
  } else if (section === 'customers') {
    table = { columns: ['Код','Име','Вид','Поръчки','Обща стойност'], rows: previewCustomers.map(c => [c.id,c.name,c.type,String(c.orders),fmt(c.total)]) };
  } else if (section === 'categories') {
    table = { columns: ['Код','Категория','Брой артикули'], rows: CATEGORIES.map(c => [c.id,c.label,String(PRODUCTS.filter(p => p.category === c.id).length)]) };
  } else table = adminTables[section] ?? { columns: ['Код','Име'], rows: [] };
  const products = PRODUCTS.filter(p => matches(p.name + ' ' + p.mint,query.name) && matches(p.id,query.code) && (category === 'all' || p.category === category) && (section !== 'out-of-stock' || p.stock === 0));
  const rows = table.rows.filter(row => matches(row.join(' '),query.name) && matches(row[0] ?? '',query.code));
  const ids = productView ? products.map(p => p.id) : rows.map(r => r[0] ?? '');
  function toggle(id: string) { setSelected(current => current.includes(id) ? current.filter(v => v !== id) : [...current,id]); }
  const allSelected = ids.length > 0 && ids.every(id => selected.includes(id));
  return <div className={`erp-preview ${collapsed ? 'is-collapsed' : ''}`}>
    <aside className="erp-sidebar">
      <div className="erp-brand"><span className="erp-brand-icon">V</span><span>Virr Gold</span></div>
      <nav aria-label="Административно меню">{adminGroups.map(g => <div className="erp-nav-group" key={g.title}>
        <Button variant="ghost" className="erp-group-toggle" aria-expanded={!closedGroups.includes(g.title)} title={g.title} onClick={() => setClosedGroups(current => current.includes(g.title) ? current.filter(v => v !== g.title) : [...current,g.title])}><span>{g.title}</span><ChevronDown /></Button>
        {!closedGroups.includes(g.title) && g.items.map(item => <Button key={item.id} variant="ghost" title={item.title} className={`erp-nav-item ${item.id === section ? 'is-active' : ''}`} aria-current={item.id === section ? 'page' : undefined} onClick={() => changeSection(item.id)}><item.icon /><span>{item.title}</span></Button>)}
      </div>)}</nav>
      <div className="erp-sidebar-account"><span className="erp-avatar">VP</span><div><strong>Preview профил</strong><small>Без реални права</small></div></div>
    </aside>
    <div className="erp-workspace">
      <header className="erp-header">
        <Button variant="ghost" size="icon" aria-label={collapsed ? 'Покажи менюто' : 'Свий менюто'} title={collapsed ? 'Покажи менюто' : 'Свий менюто'} onClick={() => setCollapsed(v => !v)}>{collapsed ? <Menu /> : <PanelLeftClose />}</Button>
        <div className="erp-top-groups">{adminGroups.map(g => <Button variant="ghost" key={g.title} className={g.title === group?.title ? 'is-active' : ''} onClick={() => changeSection(g.items[0].id)}>{g.title}<ChevronDown /></Button>)}</div>
        <div className="erp-header-actions"><ViewSwitch view="admin" /><span><Globe />BG</span><Button variant="ghost" size="icon" asChild title="Към магазина"><Link to="/" aria-label="Към магазина"><ArrowLeft /></Link></Button></div>
      </header>
      <main className="erp-main">
        <div className="erp-page-title"><h1>{active?.title}</h1><span className="erp-preview-label"><Eye />Preview</span></div>
        <div className="erp-mode-note">Примерни данни · HyperERP не е свързан · Без реални промени</div>
        <form className="erp-search" onSubmit={e => { e.preventDefault(); setQuery({ name, code }); setSelected([]); }}>
          <label><Search /><input aria-label="Име" placeholder="Име" value={name} maxLength={100} onChange={e => setName(e.target.value)}/></label>
          <input aria-label="Код" placeholder="Код" value={code} maxLength={100} onChange={e => setCode(e.target.value)}/>
          <Button type="submit" variant="outline" size="icon" aria-label="Търсене" title="Търсене"><Search /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Изчисти търсенето" title="Изчисти търсенето" onClick={() => { setName('');setCode('');setQuery({name:'',code:''});setSelected([]); }}><X /></Button>
        </form>
        <div className={`erp-list-layout ${productView ? 'with-categories' : ''}`}>
          {productView && <aside className="erp-categories"><h2>Категории</h2><Button variant="ghost" className={category === 'all' ? 'is-active' : ''} onClick={() => {setCategory('all');setSelected([]);}}><Folder />Всички категории</Button>{CATEGORIES.map(c => <Button variant="ghost" key={c.id} className={category === c.id ? 'is-active' : ''} onClick={() => {setCategory(c.id);setSelected([]);}}><Folder />{c.label}</Button>)}</aside>}
          <section className="erp-table-panel" aria-label={active?.title}>
            <div className="erp-list-heading"><h2>Списък {productView ? 'с артикули' : 'със записи'}</h2><span>{ids.length}</span>{selected.length > 0 && <div className="erp-selection">Избрани: {selected.length}<Button variant="ghost" size="sm" onClick={() => setSelected([])}>Изчисти</Button></div>}</div>
            <div className="erp-table-scroll"><table><thead><tr><th><input type="checkbox" aria-label="Избери всички" checked={allSelected} onChange={() => setSelected(allSelected ? [] : ids)}/></th>{(productView ? ['Код','Име','Категория','Наличност','Цена продава','Цена купува','Рафинерия'] : table.columns).map(col => <th key={col}>{col}</th>)}<th>Действия</th></tr></thead>
              <tbody>{productView ? products.map(p => <tr key={p.id} className={selected.includes(p.id) ? 'is-selected' : ''}><td><input type="checkbox" aria-label={`Избери ${p.name}`} checked={selected.includes(p.id)} onChange={() => toggle(p.id)}/></td><td>{p.id}</td><td><div className="erp-product"><img src={p.image} alt=""/><strong>{p.name}</strong></div></td><td>{CATEGORIES.find(c => c.id === p.category)?.label}</td><td className={p.stock ? 'erp-available' : 'erp-unavailable'}>{p.stock ? `${p.stock} бр.` : 'Изчерпан'}</td><td>{fmt(p.price)}</td><td>{fmt(p.buyback)}</td><td>{p.mint}</td><td><Button size="icon" variant="ghost" title="Преглед на артикул" aria-label={`Преглед на ${p.name}`} onClick={() => setDetail({ title:p.name, values:[['Код',p.id],['Рафинерия',p.mint],['Грамаж',`${p.weightG} г (${(p.weightG/31.1035).toLocaleString('bg-BG',{maximumFractionDigits:3})} oz)`],['Проба',p.fineness],['Цена продава',fmt(p.price)],['Цена купува',fmt(p.buyback)],['Наличност',`${p.stock} бр.`]] })}><MoreVertical /></Button></td></tr>) : rows.map(row => <tr key={row[0]} className={selected.includes(row[0] ?? '') ? 'is-selected' : ''}><td><input type="checkbox" aria-label={`Избери ${row[0]}`} checked={selected.includes(row[0] ?? '')} onChange={() => toggle(row[0] ?? '')}/></td>{row.map((cell,i) => <td key={i}>{cell}</td>)}<td><Button variant="ghost" size="icon" title="Преглед на запис" aria-label={`Преглед на ${row[0]}`} onClick={() => setDetail({title:row[0] ?? '',values:table.columns.map((col,i) => [col,row[i] ?? ''])})}><MoreVertical /></Button></td></tr>)}</tbody></table></div>
            {!ids.length && <p className="erp-empty">Няма намерени записи.</p>}
            <div className="erp-table-footer">Показани {ids.length} от {ids.length}<span>Примерен списък</span></div>
          </section>
        </div>
        {detail && <section className="erp-detail" aria-label="Детайли"><div><h2>{detail.title}</h2><Button variant="ghost" size="icon" aria-label="Затвори детайли" onClick={() => setDetail(null)}><X /></Button></div><dl>{detail.values.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>}
        <footer className="erp-footer"><span>Virr Gold / {group?.title} <ChevronRight /> {active?.title}</span><span>Admin preview</span></footer>
      </main>
    </div>
  </div>;
}
