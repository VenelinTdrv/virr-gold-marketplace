import { createFileRoute, notFound } from '@tanstack/react-router';
import { findStorefrontProduct } from '@/lib/shop/storefront-products';
import { GoldShop } from './index';

export const Route = createFileRoute('/gold/$id')({
  loader: ({ params }) => {
    const product = findStorefrontProduct(params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData: product }) => {
    const title = product ? `${product.name}${product.weight ? ` · ${product.weight} г` : ''} | Virr Gold` : 'Продуктът не е намерен | Virr Gold';
    const description = product ? `${product.name} от ${product.brand}. ${product.weight ? `Тегло ${product.weight} г, проба ${product.purity}.` : 'Аксесоар за съхранение на монети.'} Цена продава, цена купува и наличност във Virr Gold.` : 'Продуктът не е намерен в каталога на Virr Gold.';
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }], links: [{ rel: 'stylesheet', href: '/gold/custom.css' }] };
  },
  component: StorefrontProductPage,
});

function StorefrontProductPage() {
  const product = Route.useLoaderData();
  return <GoldShop product={product} />;
}