import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Menu, Search, X, ChevronDown, ChevronRight, Folder, Eye, ArrowLeft, Pencil, Trash2, Plus, RotateCcw, Globe, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewSwitch } from '@/components/shop/ViewSwitch';
import { fmt } from '@/lib/shop/products';
import { adminProducts } from '@/lib/shop/admin-products';
import { AdminDemoDialog } from '@/components/shop/AdminDemoDialog';
import { DEMO_STORAGE_KEY, initialDemoData, restoreDemoData, fieldsFor, saveDemoRecord, deleteDemoRecords, type DemoData, type DemoRecord } from '@/lib/shop/admin-demo';
import { adminGroups, adminItems, isAdminSection, type AdminSection } from '@/lib/shop/admin-sections';

export const Route = createFileRoute('/admin-preview')({
  validateSearch: (search: Record<string, unknown>): { section?: AdminSection } => {
    const section = search['section'];
    return isAdminSection(section) ? { section } : {};
  },
  head: () => ({ meta: [
    { title: 'Admin panel preview | Virr Gold' },
    { name: 'description', content: 'CMS преглед на Virr Gold: артикули, страници, банери, медия, менюта, SEO и настройки на магазина.' },
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
    const originalMedia = shopStyles.map(link => link.media);
    for (const link of shopStyles) link.media = 'not all';
    return () => { shopStyles.forEach((link, index) => { link.media = originalMedia[index] ?? ''; }); };
  }, []);
  const search = Route.useSearch();
  const section = isAdminSection(search.section) ? search.section : 'products';
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
  const productView = section === 'products';
  const [data, setData] = useState<DemoData>(initialDemoData);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [editor, setEditor] = useState<{ record?: DemoRecord } | null>(null);
  const [deleting, setDeleting] = useState<string[] | null>(null);
  const [resetting, setResetting] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(DEMO_STORAGE_KEY); if (raw) { const saved = restoreDemoData(raw); if (saved) setData(saved); else setNotice('Невалидни демо данни. Заредени са примерите.'); } }
    catch { setNotice('Запазването в този браузър не е достъпно.'); }
    setReady(true);
  }, []);
  function commit(next: DemoData, message: string) {
    setData(next); setNotice(message);
    try { localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next)); }
    catch { setNotice(message + ' Промените са само за текущото посещение.'); }
  }
  const fields = fieldsFor(section, data);
  const categories = data.categories ?? [];
  const matches = (text: string, value: string) => text.toLocaleLowerCase('bg').includes(value.trim().toLocaleLowerCase('bg'));
  function changeSection(next: AdminSection) {
    setName(''); setCode(''); setQuery({ name: '', code: '' }); setCategory('all'); setSelected([]); setDetail(null); setEditor(null); setDeleting(null); setNotice('');
    void navigate({ to: '/admin-preview', search: { section: next } });
  }
  const sectionRows = data[section] ?? [];
  const rows = sectionRows.filter(row => matches(row.values.join(' '), query.name) && matches(row.values[0] ?? '', query.code) && (!productView || category === 'all' || row.values[2] === category));
  const ids = rows.map(r => r.key);
  function viewRecord(record: DemoRecord) {
    setDetail({ title: record.values[1] ?? record.values[0] ?? '', values: fields.map((field, i): [string, string] => [field.label, productView && i === 7 ? `${record.values[i]} г (${(Number(record.values[i])/31.1035).toLocaleString('bg-BG',{maximumFractionDigits:3})} oz)` : productView && (i === 4 || i === 5) ? (record.values[i] ? fmt(Number(record.values[i])) : '—') : record.values[i] || '—']) });
  }
  function openNew() {
    setName(''); setCode(''); setQuery({ name: '', code: '' }); setCategory('all'); setDetail(null); setEditor({});
  }
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
        <div className="erp-top-groups">{adminGroups.map(g => <Button variant="ghost" key={g.title} className={g.title === group?.title ? 'is-active' : ''} onClick={() => { const first = g.items[0]; if (first) changeSection(first.id); }}>{g.title}<ChevronDown /></Button>)}</div>
        <div className="erp-header-actions"><ViewSwitch view="admin" /><span><Globe />BG</span><Button variant="ghost" size="icon" asChild title="Към магазина"><Link to="/" aria-label="Към магазина"><ArrowLeft /></Link></Button></div>
      </header>
      <main className="erp-main">
        <div className="erp-page-title"><h1>{active?.title}</h1><span className="erp-preview-label"><Eye />Preview</span></div>
        <div className="erp-mode-note">Демо режим · Промените са само в този браузър · Магазинът и HyperERP не се променят</div>
        <div className="erp-crud-toolbar"><Button disabled={!ready} onClick={openNew}><Plus />Нов запис</Button><Button variant="outline" onClick={() => setResetting(true)} disabled={!ready}><RotateCcw />Възстанови примерите</Button></div>
        {notice && <p className="erp-notice" role="status">{notice}</p>}
        <form className="erp-search" onSubmit={e => { e.preventDefault(); setQuery({ name, code }); setSelected([]); }}>
          <label><Search /><input aria-label="Име" placeholder="Име" value={name} maxLength={100} onChange={e => setName(e.target.value)}/></label>
          <input aria-label="Код" placeholder="Код" value={code} maxLength={100} onChange={e => setCode(e.target.value)}/>
          <Button type="submit" variant="outline" size="icon" aria-label="Търсене" title="Търсене"><Search /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Изчисти търсенето" title="Изчисти търсенето" onClick={() => { setName('');setCode('');setQuery({name:'',code:''});setSelected([]); }}><X /></Button>
        </form>
        <div className={`erp-list-layout ${productView ? 'with-categories' : ''}`}>
          {productView && <aside className="erp-categories"><h2>Категории</h2><Button variant="ghost" className={category === 'all' ? 'is-active' : ''} onClick={() => {setCategory('all');setSelected([]);}}><Folder />Всички категории</Button>{categories.map(c => <Button variant="ghost" key={c.key} className={category === c.values[1] ? 'is-active' : ''} onClick={() => {setCategory(c.values[1] ?? 'all');setSelected([]);}}><Folder />{c.values[1]}</Button>)}</aside>}
          <section className="erp-table-panel" aria-label={active?.title}>
            <div className="erp-list-heading"><h2>Списък {productView ? 'с артикули' : 'със записи'}</h2><span>{ids.length}</span>{selected.length > 0 && <div className="erp-selection">Избрани: {selected.length}<Button variant="ghost" size="sm" onClick={() => setSelected([])}>Изчисти</Button><Button variant="ghost" size="icon" className="erp-danger" aria-label="Изтрий избраните" title="Изтрий избраните" onClick={() => setDeleting(selected)}><Trash2 /></Button></div>}</div>
            <div className="erp-table-scroll"><table><thead><tr><th><input type="checkbox" aria-label="Избери всички" checked={allSelected} onChange={() => setSelected(allSelected ? [] : ids)}/></th>{fields.slice(0, productView ? 7 : fields.length).map(field => <th key={field.label}>{field.label}</th>)}{section === 'categories' && <th>Брой артикули</th>}<th>Действия</th></tr></thead>
              <tbody>{rows.map(row => <tr key={row.key} className={selected.includes(row.key) ? 'is-selected' : ''}><td><input type="checkbox" aria-label={`Избери ${row.values[0]}`} checked={selected.includes(row.key)} onChange={() => toggle(row.key)}/></td>{row.values.slice(0, productView ? 7 : fields.length).map((cell,i) => <td key={i} className={productView && i === 3 ? (cell === 'В наличност' ? 'erp-available' : 'erp-unavailable') : undefined}>{productView && (i === 4 || i === 5) ? (cell ? fmt(Number(cell)) : '—') : productView && i === 1 ? <div className="erp-product">{(adminProducts.find(p => p.id === row.values[0])?.image ?? adminProducts[0]?.image) && <img src={adminProducts.find(p => p.id === row.values[0])?.image ?? adminProducts[0]?.image} alt="" />}<strong>{cell}</strong></div> : cell || '—'}</td>)}{section === 'categories' && <td>{(data.products ?? []).filter(p => p.values[2] === row.values[1]).length}</td>}<td><div className="erp-row-actions"><Button variant="ghost" size="icon" title="Преглед" aria-label={`Преглед на ${row.values[0]}`} onClick={() => viewRecord(row)}><Eye /></Button><Button variant="ghost" size="icon" title="Редактиране" aria-label={`Редактирай ${row.values[0]}`} onClick={() => { setDetail(null); setEditor({ record: row }); }}><Pencil /></Button><Button variant="ghost" size="icon" className="erp-danger" title="Изтриване" aria-label={`Изтрий ${row.values[0]}`} onClick={() => setDeleting([row.key])}><Trash2 /></Button></div></td></tr>)}</tbody></table></div>
            {!ids.length && <p className="erp-empty">Няма намерени записи.</p>}
            <div className="erp-table-footer">Показани {ids.length} от {sectionRows.length}<span>Примерен списък</span></div>
          </section>
        </div>
        {detail && <section className="erp-detail" aria-label="Детайли"><div><h2>{detail.title}</h2><Button variant="ghost" size="icon" aria-label="Затвори детайли" onClick={() => setDetail(null)}><X /></Button></div><dl>{detail.values.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>}
        {editor && <AdminDemoDialog key={`${section}-${editor.record?.key ?? 'new'}`} title={editor.record ? 'Редактиране на запис' : 'Нов запис'} fields={fields} record={editor.record} rows={sectionRows} onClose={() => setEditor(null)} onSave={values => {
          let next = saveDemoRecord(data, section, values, editor.record?.key ?? crypto.randomUUID());
          if (section === 'categories' && editor.record && values[1]?.trim() !== editor.record.values[1]) next = { ...next, products: (next.products ?? []).map(p => p.values[2] === editor.record?.values[1] ? { ...p, values: p.values.map((v,i) => i === 2 ? values[1]?.trim() ?? v : v) } : p) };
          commit(next, editor.record ? 'Записът е редактиран.' : 'Записът е добавен.'); setEditor(null); setSelected([]);
        }} />}
        {deleting && <AdminDemoDialog title="Изтриване на записи" confirm={`Да изтрием ли ${deleting.length} демо запис(а)?`} onClose={() => setDeleting(null)} onConfirm={() => {
          if (section === 'categories' && sectionRows.some(r => deleting.includes(r.key) && (data.products ?? []).some(p => p.values[2] === r.values[1]))) { setNotice('Категорията съдържа артикули. Преместете или изтрийте артикулите първо.'); setDeleting(null); return; }
          commit(deleteDemoRecords(data, section, deleting), 'Записите са изтрити.'); setDeleting(null); setSelected([]); setDetail(null);
        }} />}
        {resetting && <AdminDemoDialog title="Възстановяване на примерите" confirm="Да заменим ли всички демо промени във всички менюта с първоначалните примери?" onClose={() => setResetting(false)} onConfirm={() => { commit(initialDemoData(), 'Примерите са възстановени.'); setResetting(false); setSelected([]); setDetail(null); setCategory('all'); }} />}
        <footer className="erp-footer"><span>Virr Gold / {group?.title} <ChevronRight /> {active?.title}</span><span>Admin preview</span></footer>
      </main>
    </div>
  </div>;
}
