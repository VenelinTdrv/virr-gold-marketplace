import { describe, expect, it } from 'vitest';
import { adminGroups, isAdminSection } from '@/lib/shop/admin-sections';

describe('Admin nomenclatures-only navigation', () => {
  it('keeps only the nomenclatures group', () => {
    expect(adminGroups.map(group => group.title)).toEqual(['Номенклатури']);
    expect(isAdminSection('products')).toBe(true);
  });
  it('rejects sections outside nomenclatures', () => {
    expect(isAdminSection('orders')).toBe(false);
    expect(isAdminSection('profit')).toBe(false);
    expect(isAdminSection('settings')).toBe(false);
  });
  it('excludes bundles from available sections', () => {
    expect(isAdminSection('bundles')).toBe(false);
    expect(adminGroups.flatMap(group => group.items.map(item => item.id))).not.toContain('bundles');
  });
});