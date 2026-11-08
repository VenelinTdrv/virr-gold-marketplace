import { describe, expect, it } from 'vitest';
import { adminItems } from '@/lib/shop/admin-sections';
import { initialDemoData, fieldsFor, saveDemoRecord, deleteDemoRecords, validateRecord, restoreDemoData } from '@/lib/shop/admin-demo';

describe('Isolated demonstration CRUD', () => {
  it.each(adminItems.map(item => item.id))('creates, edits, restores and deletes in %s without changing fixtures', section => {
    const original = initialDemoData();
    const fields = fieldsFor(section, original);
    const values = fields.map((f,i) => i === 0 ? 'NEW-DEMO' : f.type === 'select' ? f.options?.[0] ?? '' : f.type === 'number' ? '1' : 'Демо запис');
    expect(validateRecord(fields, values, original[section] ?? [])).toBeNull();
    const added = saveDemoRecord(original, section, values, 'unique-key');
    expect(added[section]).toHaveLength((original[section]?.length ?? 0) + 1);
    const changed = [...values]; changed[1] = 'Редактиран запис';
    const edited = saveDemoRecord(added, section, changed, 'unique-key');
    expect(edited[section]?.find(r => r.key === 'unique-key')?.values[1]).toBe('Редактиран запис');
    expect(restoreDemoData(JSON.stringify(edited))).toEqual(edited);
    expect(deleteDemoRecords(edited, section, ['unique-key'])).toEqual(original);
    expect(initialDemoData()).toEqual(original);
  });
  it('rejects duplicate codes', () => {
    const data = initialDemoData(); const row = data.products?.[0];
    expect(row).toBeDefined();
    expect(validateRecord(fieldsFor('products',data), row?.values ?? [], data.products ?? [])).toBe('Вече съществува запис с този код.');
  });
  it('rejects invalid amounts and nonpositive weight', () => {
    const data = initialDemoData(); const values = [...(data.products?.[0]?.values ?? [])];
    values[0] = 'NEW'; values[4] = '-1';
    expect(validateRecord(fieldsFor('products',data), values, [])).toContain('Цена продава');
    values[4] = ''; values[7] = '0';
    expect(validateRecord(fieldsFor('products',data), values, [])).toContain('Грамаж');
  });
  it('rejects corrupt browser storage', () => {
    expect(restoreDemoData('{bad')).toBeNull();
    expect(restoreDemoData('{}')).toBeNull();
  });
});