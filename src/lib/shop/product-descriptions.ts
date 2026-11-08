import type { DemoData, DemoRecord } from './admin-demo';
import type { StorefrontProduct } from './storefront-products';

export const descriptionLabels = ['Защо да купите?', 'История', 'Технически детайли', 'Доставка'] as const;

export function descriptionArticle(product: StorefrontProduct, data: DemoData): DemoRecord | undefined {
  const rows = data.products ?? [];
  const code = product.type === 'bars' ? `${product.brand.toLowerCase()}-${String(product.weight).replace('.', '-')}g` : String(product.id);
  const exact = rows.find(row => row.values[0] === code);
  if (exact) return exact;
  const matches = rows.filter(row => row.values[6]?.trim().toLowerCase() === product.brand.toLowerCase()
    && Number(row.values[7]) === product.weight && row.values[8] === product.purity
    && (product.type === 'bars' || row.values[1] === product.name));
  return matches.length === 1 ? matches[0] : undefined;
}

export function productDescriptionValues(product: StorefrontProduct, data: DemoData): string[] {
  const article = descriptionArticle(product, data);
  return descriptionLabels.map((_, index) => article?.values[index + 10] ?? '');
}