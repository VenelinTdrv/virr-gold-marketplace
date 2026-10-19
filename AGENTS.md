<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Shop catalog, stock and orders go through `src/lib/shop/erp.functions.ts` (ERP_API_URL / ERP_API_KEY); sample data is the fallback — the client's own ERP is the source of truth, no Shopify.
- Cart lines store a product snapshot in localStorage; stock is re-validated server-side on order submit.

- Shop presentation uses shared semantic CSS tokens and the shared Button component; catalog asset imports are centralized in products.ts so demo imagery stays consistent across views.
