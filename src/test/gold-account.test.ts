import { describe, expect, it } from 'vitest';
import { profileSchema } from '@/lib/shop/account';
describe('Personal customer profile', () => {
  it('stores name, phone and address independently', () => {
    const result = profileSchema.parse({ full_name: 'Иван Петров', phone: '+359888123456', address: 'ул. Пример 1', city: 'София' });
    expect(result.full_name).toBe('Иван Петров');
    expect(result.phone).toBe('+359888123456');
    expect(result.address).toBe('ул. Пример 1');
  });
});