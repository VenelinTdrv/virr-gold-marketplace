import { describe, expect, it } from 'vitest';
import { initialDemoData, saveDemoRecord, restoreDemoData } from '@/lib/shop/admin-demo';
import { productDescriptionValues } from '@/lib/shop/product-descriptions';
import { storefrontProducts } from '@/lib/shop/storefront-products';

describe('Product article descriptions', () => {
  it('reads all four saved sections from the matching article after restore', () => {
    const data = initialDemoData();
    const product = storefrontProducts.find(p => p.id === 9);
    const row = data.products?.find(r => r.values[0] === 'valcambi-1g');
    if (!product || !row) throw new Error('Missing product');
    const values = [...row.values];
    values.splice(10, 4, 'Причини за покупка', 'История на продукта', 'Техническо описание', 'Условия за доставка');
    const restored = restoreDemoData(JSON.stringify(saveDemoRecord(data, 'products', values, row.key)));
    expect(productDescriptionValues(product, restored ?? {})).toEqual(values.slice(10));
    expect(product.price).toBe(149);
    expect(product.stock).toBe(30);
  });
  it('reads a new article by unique identity without borrowing another product description', () => {
    const product = storefrontProducts.find(p => p.id === 7);
    if (!product) throw new Error('Missing product');
    const data = saveDemoRecord(initialDemoData(), 'products', ['NEW', product.name, 'Златни кюлчета', '', '', '', product.brand, '100', product.purity, 'Швейцария', 'Причини', 'История', 'Детайли', 'Доставка'], 'new-article');
    expect(productDescriptionValues(product, data)).toEqual(['Причини', 'История', 'Детайли', 'Доставка']);
    expect(productDescriptionValues({ ...product, weight: 50 }, data)).toEqual(['', '', '', '']);
  });
  it('does not choose between ambiguous article identities', () => {
    const product = storefrontProducts.find(p => p.id === 7);
    if (!product) throw new Error('Missing product');
    const values = ['OTHER', product.name, '', '', '', '', product.brand, '100', product.purity, '', 'Wrong', '', '', ''];
    expect(productDescriptionValues(product, { products: [{ key: 'a', values }, { key: 'b', values: ['SECOND', ...values.slice(1)] }] })).toEqual(['', '', '', '']);
  });
});