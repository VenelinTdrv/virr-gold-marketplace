import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DEMO_STORAGE_KEY, initialDemoData, restoreDemoData } from '@/lib/shop/admin-demo';
import { descriptionLabels, productDescriptionValues } from '@/lib/shop/product-descriptions';
import type { StorefrontProduct } from '@/lib/shop/storefront-products';

export function ProductDescriptions({ product }: { product: StorefrontProduct }) {
  const [active, setActive] = useState(0);
  const [values, setValues] = useState<string[]>([]);
  useEffect(() => {
    const read = () => {
      let data = initialDemoData();
      try {
        const raw = localStorage.getItem(DEMO_STORAGE_KEY);
        if (raw) data = restoreDemoData(raw) ?? data;
      } catch { /* Browser storage may be unavailable. */ }
      setValues(productDescriptionValues(product, data));
    };
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, [product]);
  return <section className="gold-description" aria-label="Описание на продукта">
    <h2>Описание</h2>
    <div className="gold-description-tabs" role="tablist" aria-label="Раздели на описанието">
      {descriptionLabels.map((label, index) => <Button key={label} variant="ghost" role="tab" id={`description-tab-${index}`} aria-selected={active === index} aria-controls={`description-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % 4;
        else if (event.key === 'ArrowLeft') next = (index + 3) % 4;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = 3;
        else return;
        event.preventDefault(); setActive(next);
        document.getElementById(`description-tab-${next}`)?.focus();
      }}>{label}</Button>)}
    </div>
    {descriptionLabels.map((label, index) => <div key={label} role="tabpanel" id={`description-panel-${index}`} aria-labelledby={`description-tab-${index}`} hidden={active !== index} tabIndex={0} className="gold-description-panel">
      <h3>{label}</h3>
      {index === 2 && <table><tbody>
        <tr><td>Рафинерия / производител</td><td>{product.brand}</td></tr>
        <tr><td>Тегло</td><td>{product.weight ? `${product.weight} г` : 'Не се прилага'}</td></tr>
        <tr><td>Проба</td><td>{product.purity}</td></tr>
        <tr><td>Година</td><td>{product.year || 'Не се прилага'}</td></tr>
      </tbody></table>}
      <p className="gold-description-copy">{values[index]?.trim() || 'Все още няма добавено описание.'}</p>
    </div>)}
  </section>;
}