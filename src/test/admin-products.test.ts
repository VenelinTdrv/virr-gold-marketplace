import { describe, expect, it } from 'vitest';
import { adminProducts } from '@/lib/shop/admin-products';

describe('Requested admin bar catalog', () => {
  it('contains exactly 14 gold bars', () => {
    expect(adminProducts).toHaveLength(14);
    expect(adminProducts.every(p => p.category === 'bars')).toBe(true);
  });
  it('contains seven PAMP and seven Valcambi products', () => {
    expect(adminProducts.filter(p => p.mint === 'PAMP')).toHaveLength(7);
    expect(adminProducts.filter(p => p.mint === 'Valcambi')).toHaveLength(7);
  });
  it.each([
    ['valcambi-1g',148,124,true], ['pamp-1g',149,124,true],
    ['valcambi-2-5g',353,316,true], ['pamp-2-5g',356,316,true],
    ['valcambi-5g',665,614,true], ['pamp-5g',674,614,true],
    ['valcambi-10g',1255,1221,true], ['pamp-10g',1264,1221,true],
    ['valcambi-20g',2463,2429,true], ['pamp-20g',null,2429,false],
    ['pamp-1oz',null,3753,false], ['valcambi-1oz',3803,3753,true],
    ['pamp-50g',null,5995,false], ['valcambi-50g',6051,5995,true],
  ])('preserves reference values for %s', (id,price,buyback,stock) => {
    expect(adminProducts.find(p => p.id === id)).toMatchObject({price,buyback,stock});
  });
});