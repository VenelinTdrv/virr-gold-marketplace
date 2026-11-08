import { adminItems, adminTables, type AdminSection } from './admin-sections';
import { adminProducts } from './admin-products';
import { previewCustomers } from './admin-preview';
import { CATEGORIES, fmt } from './products';

export type DemoRecord = { key: string; values: string[] };
export type DemoData = Partial<Record<AdminSection, DemoRecord[]>>;
export type DemoField = { label: string; type?: 'number' | 'textarea' | 'select'; optional?: boolean; options?: string[]; min?: number; erpOwned?: boolean };
export const DEMO_STORAGE_KEY = 'virr-admin-demo-v1';
export function fieldsFor(section: AdminSection, data: DemoData): DemoField[] {
  if (section === 'products') return [
    { label: 'Код' }, { label: 'Име' }, { label: 'Категория', type: 'select', options: (data.categories ?? []).map(r => r.values[1] ?? '') },
    { label: 'Наличност', erpOwned: true },
    { label: 'Цена продава', erpOwned: true }, { label: 'Цена купува', erpOwned: true },
    { label: 'Рафинерия' }, { label: 'Грамаж (г)', type: 'number', min: 0.0001 }, { label: 'Проба' }, { label: 'Държава' }, { label: 'Описание', type: 'textarea', optional: true },
  ];
  const columns = section === 'categories' ? ['Код', 'Категория'] : section === 'customers' ? ['Код', 'Име', 'Вид', 'Поръчки', 'Обща стойност'] : adminTables[section]?.columns ?? ['Код', 'Име'];
  return columns.map(label => label === 'Поръчки' ? { label, type: 'number', min: 0 } : label === 'Описание' || label === 'Съдържание' || label === 'Връзки' ? { label, type: 'textarea' } : { label });
}
export function initialDemoData(): DemoData {
  const data: DemoData = {};
  for (const item of adminItems) {
    let rows = adminTables[item.id]?.rows ?? [];
    if (item.id === 'products') rows = adminProducts.map(p => [p.id, p.name, CATEGORIES.find(c => c.id === p.category)?.label ?? '', p.stock ? 'В наличност' : 'Изчерпан', p.price === null ? '' : String(p.price), String(p.buyback), p.mint, String(p.weightG), p.fineness, p.country, p.description]);
    if (item.id === 'categories') rows = CATEGORIES.map(c => [c.id, c.label]);
    if (item.id === 'customers') rows = previewCustomers.map(c => [c.id, c.name, c.type, String(c.orders), fmt(c.total)]);
    data[item.id] = rows.map((values, index) => ({ key: `${item.id}-${index}`, values: [...values] }));
  }
  return data;
}
export function validateRecord(fields: DemoField[], values: string[], rows: DemoRecord[], key?: string): string | null {
  for (const [index, field] of fields.entries()) {
    if (field.erpOwned) continue;
    const value = values[index]?.trim() ?? '';
    if (!value && !field.optional) return `Попълнете „${field.label}“.`;
    if (value.length > 4000) return `„${field.label}“ е твърде дълго.`;
    if (value && field.type === 'number' && (!Number.isFinite(Number(value)) || Number(value) < (field.min ?? 0))) return `Невалидна стойност за „${field.label}“.`;
    if (field.type === 'select' && !field.options?.includes(value)) return `Изберете „${field.label}“.`;
  }
  if (rows.some(row => row.key !== key && row.values[0]?.trim().toLocaleLowerCase('bg') === values[0]?.trim().toLocaleLowerCase('bg'))) return 'Вече съществува запис с този код.';
  return null;
}
export function saveDemoRecord(data: DemoData, section: AdminSection, values: string[], key: string): DemoData {
  const rows = data[section] ?? [];
  const existing = rows.find(r => r.key === key);
  const fields = fieldsFor(section, data);
  const record = { key, values: values.map((v,i) => fields[i]?.erpOwned ? existing?.values[i] ?? '' : v.trim()) };
  return { ...data, [section]: rows.some(r => r.key === key) ? rows.map(r => r.key === key ? record : r) : [...rows, record] };
}
export function deleteDemoRecords(data: DemoData, section: AdminSection, keys: string[]): DemoData {
  return { ...data, [section]: (data[section] ?? []).filter(r => !keys.includes(r.key)) };
}
export function restoreDemoData(raw: string): DemoData | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const source = parsed as Record<string, unknown>;
    const data: DemoData = {};
    for (const item of adminItems) {
      const rows = source[item.id];
      if (!Array.isArray(rows) || rows.length > 2000) return null;
      const width = fieldsFor(item.id, initialDemoData()).length;
      const keys = new Set<string>();
      const codes = new Set<string>();
      for (const row of rows) {
        if (!row || typeof row !== 'object' || typeof row.key !== 'string' || keys.has(row.key) || !Array.isArray(row.values) || row.values.length !== width || row.values.some((v: unknown) => typeof v !== 'string' || v.length > 4000)) return null;
        const code = row.values[0]?.trim().toLocaleLowerCase('bg');
        if (!code || codes.has(code)) return null;
        keys.add(row.key); codes.add(code);
      }
      data[item.id] = rows;
    }
    return data;
  } catch { return null; }
}