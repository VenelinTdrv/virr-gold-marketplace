import { describe, expect, it } from 'vitest';
import { storefrontProducts } from '@/lib/shop/storefront-products';

describe('Sample delivery lead times', () => {
  it('assigns a three-week lead time to three sample products', () => {
    const delayed = storefrontProducts.filter(product => product.deliveryWeeks !== undefined);
    expect(delayed).toHaveLength(3);
    expect(delayed.map(product => product.deliveryWeeks)).toEqual([3, 3, 3]);
  });
});