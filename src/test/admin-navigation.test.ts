import { describe, expect, it } from 'vitest';
import { adminGroups, isAdminSection } from '@/lib/shop/admin-sections';

describe('Admin navigation', () => {
  it('keeps nomenclatures and settings groups', () => {
    expect(adminGroups.map(group => group.title)).toEqual(['Номенклатури', 'Настройки']);
    expect(isAdminSection('products')).toBe(true);
  });
  it('moves the six CMS sections into settings without duplicates', () => {
    const sections = ['pages', 'homepage', 'media', 'menus', 'seo', 'shop-settings'];
    expect(adminGroups.find(group => group.title === 'Настройки')?.items.map(item => item.id)).toEqual(sections);
    const nomenclatures = adminGroups.find(group => group.title === 'Номенклатури')?.items.map(item => item.id) ?? [];
    for (const section of sections) expect(nomenclatures).not.toContain(section);
    expect(nomenclatures).toContain('customers');
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
  it('excludes assistants from available sections', () => {
    expect(isAdminSection('assistants')).toBe(false);
    expect(adminGroups.flatMap(group => group.items.map(item => item.id))).not.toContain('assistants');
  });
  it.each(['pages', 'homepage', 'media', 'menus', 'seo', 'shop-settings'])('includes CMS section %s', section => {
    expect(isAdminSection(section)).toBe(true);
  });
});