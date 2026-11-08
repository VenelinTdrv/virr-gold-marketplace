import { describe, expect, it } from 'vitest';
import { adminItems } from '@/lib/shop/admin-sections';
import { initialDemoData, fieldsFor, saveDemoRecord, deleteDemoRecords, validateRecord, restoreDemoData, isDemoFieldVisible } from '@/lib/shop/admin-demo';

describe('Isolated demonstration CRUD', () => {
  it.each(['Физическо лице', 'Юридическо лице'])('saves and restores a customer of type %s', type => {
    const data = initialDemoData(); const fields = fieldsFor('customers', data);
    const values = ['NEW-C', 'Тест клиент', type, '', '', '0888000000', 'demo@example.com', 'Тест адрес', 'Тест фирма', '123456789', 'Представител'];
    expect(fields[2]?.options).toEqual(['Физическо лице', 'Юридическо лице']);
    expect(validateRecord(fields, values, [])).toBeNull();
    const restored = restoreDemoData(JSON.stringify(saveDemoRecord(data, 'customers', values, 'new-c')));
    expect(restored?.customers?.find(r => r.key === 'new-c')?.values).toEqual([...values.slice(0,8), ...(type === 'Юридическо лице' ? values.slice(8) : ['', '', ''])]);
    const companyField = fields[8];
    if (!companyField) throw new Error('Missing company field');
    expect(isDemoFieldVisible(companyField, values)).toBe(type === 'Юридическо лице');
  });
  it('requires company name and EIK only for legal entities', () => {
    const fields = fieldsFor('customers', initialDemoData());
    const values = ['NEW', 'Клиент', 'Физическо лице', '', '', '', '', '', '', '', ''];
    expect(validateRecord(fields, values, [])).toBeNull();
    values[2] = 'Юридическо лице';
    expect(validateRecord(fields, values, [])).toContain('Име на фирма');
    values[8] = 'Фирма';
    expect(validateRecord(fields, values, [])).toContain('ЕИК');
    values[9] = '123456789';
    expect(validateRecord(fields, values, [])).toBeNull();
  });
  it('upgrades old customers without losing their type and existing values', () => {
    const data = initialDemoData(); data.customers = (data.customers ?? []).map(r => ({...r, values:r.values.slice(0,5)}));
    const restored = restoreDemoData(JSON.stringify(data));
    expect(restored?.customers?.map(r => r.values.slice(0,5))).toEqual(data.customers?.map(r => r.values));
    expect(restored?.customers?.every(r => r.values.length === 11)).toBe(true);
  });
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
  it('rejects nonpositive weight', () => {
    const data = initialDemoData(); const values = [...(data.products?.[0]?.values ?? [])];
    values[0] = 'NEW'; values[7] = '0';
    expect(validateRecord(fieldsFor('products',data), values, [])).toContain('Грамаж');
  });
  it.each([3,4,5])('preserves ERP-owned product field %i on edit and leaves it unknown on creation', index => {
    const data = initialDemoData(); const row = data.products?.[0];
    if (!row) throw new Error('Missing fixture');
    const values = [...row.values]; values[index] = 'manually changed';
    expect(saveDemoRecord(data,'products',values,row.key).products?.[0]?.values[index]).toBe(row.values[index]);
    expect(saveDemoRecord(data,'products',values,'new-key').products?.find(r => r.key === 'new-key')?.values[index]).toBe('');
  });
  it('rejects corrupt browser storage', () => {
    expect(restoreDemoData('{bad')).toBeNull();
    expect(restoreDemoData('{}')).toBeNull();
  });
  it('keeps all four description values separate after saving and restoring', () => {
    const data = initialDemoData(); const row = data.products?.[0];
    if (!row) throw new Error('Missing fixture');
    const values = [...row.values]; values.splice(10,4,'Причини','Исторически текст','Технически текст','Условия за доставка');
    const restored = restoreDemoData(JSON.stringify(saveDemoRecord(data,'products',values,row.key)));
    expect(restored?.products?.[0]?.values.slice(10)).toEqual(['Причини','Исторически текст','Технически текст','Условия за доставка']);
  });
  it('preserves old descriptions when upgrading existing browser records', () => {
    const data = initialDemoData(); data.products = data.products?.map(row => ({...row, values:row.values.slice(0,11)})) ?? [];
    const restored = restoreDemoData(JSON.stringify(data));
    expect(restored?.products?.[0]?.values.slice(10)).toEqual([data.products[0]?.values[10],'','','']);
  });
});