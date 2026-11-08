import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { goldMarkup } from "@/lib/shop/goldMarkup";
import { validateBuyer } from "@/lib/shop/buyer";
import { AccountEntry, AccountPanel } from "@/components/shop/AccountPanel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { ViewSwitch } from "@/components/shop/ViewSwitch";
import { storefrontProducts, type StorefrontProduct } from "@/lib/shop/storefront-products";
import { ProductDescriptions } from '@/components/shop/ProductDescriptions';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Злато | Virr" },
      { name: "description", content: "Открийте златни кюлчета, инвестиционни и колекционерски монети във Virr." },
      { property: "og:title", content: "Злато | Virr" },
      { property: "og:description", content: "Златни кюлчета, инвестиционни и колекционерски монети във Virr." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: "/gold/custom.css" }],
  }),
  component: GoldShop,
});

const UploadedStorefront = memo(({ product }: { product?: StorefrontProduct | undefined }) => <div dangerouslySetInnerHTML={{ __html: product ? goldMarkup.replace('<main>', `<main class="gold-product-page"><div class="breadcrumb"><a href="/">Инвестиционно злато</a><span>/</span>${product.name}</div><div id="productpage"></div><div id="productdescriptions"></div><a class="textlink" href="/">← Към каталога</a></main><main hidden>`).replaceAll('href="#catalog"', 'href="/#catalog"').replaceAll('href="#guide"', 'href="/#guide"') : goldMarkup }} />);

export function GoldShop({ product }: { product?: StorefrontProduct | undefined }) {
  const navigate = useNavigate();
  const [accountHost, setAccountHost] = useState<HTMLElement | null>(null);
  const [adminHost, setAdminHost] = useState<HTMLElement | null>(null);
  const [descriptionHost, setDescriptionHost] = useState<HTMLElement | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => {
    setDescriptionHost(document.getElementById('productdescriptions'));
    const footer = document.querySelector('footer');
    if (footer) {
      const host = document.createElement('div');
      footer.appendChild(host);
      setAdminHost(host);
    }
    const actions = document.querySelector('.header-actions');
    if (actions) {
      const host = document.createElement('span');
      host.className = 'account-host';
      actions.prepend(host);
      setAccountHost(host);
    }
    const w = window as unknown as { __goldLoaded?: boolean; goldValidateBuyer?: typeof validateBuyer; goldProducts?: StorefrontProduct[]; goldProductId?: number | undefined; goldNavigateProduct?: (id: string) => void };
    w.goldValidateBuyer = validateBuyer;
    w.goldProducts = storefrontProducts;
    w.goldProductId = product?.id;
    w.goldNavigateProduct = id => { void navigate({ to: '/gold/$id', params: { id } }); };
    const onProductClick = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[data-product-id]');
      // Whole card navigates, except clicks on its interactive controls (cart, favorite, compare).
      const card = !link && !event.target.closest('button, input, select, label, dialog')
        ? event.target.closest<HTMLElement>('article.card[data-product-id]') : null;
      const id = link?.dataset['productId'] ?? card?.dataset['productId'];
      if (!id) return;
      event.preventDefault();
      w.goldNavigateProduct?.(id);
    };
    document.addEventListener('click', onProductClick);
    // The uploaded shop script declares globals, so it can only run once per page load.
    if (w.__goldLoaded) {
      window.location.reload();
      return;
    }
    w.__goldLoaded = true;
    const s = document.createElement("script");
    s.src = "/gold/app.js";
    document.body.appendChild(s);
    return () => { document.removeEventListener('click', onProductClick); };
  }, []);
  return <><UploadedStorefront product={product} />
    {product && descriptionHost && createPortal(<ProductDescriptions product={product} />, descriptionHost)}
    {accountHost && createPortal(<><ViewSwitch view="user" /><AccountEntry onClick={() => setAccountOpen(true)} /></>, accountHost)}
    {adminHost && createPortal(<Button asChild variant="outline" className="admin-store-entry"><Link to="/admin-preview"><LayoutDashboard />Admin preview</Link></Button>, adminHost)}
    <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
      <DialogContent className="account-dialog" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Потребителски профил</DialogTitle>
        <AccountPanel />
      </DialogContent>
    </Dialog>
  </>;
}
