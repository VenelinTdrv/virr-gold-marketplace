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
- The uploaded storefront's comparison uses its existing selection state and native dialog to avoid a separate, inconsistent product selection.
- Uploaded storefront buyer validation uses a shared Zod schema exposed before its script loads; buyer details stay in the demo form and are rendered with textContent, not interpolated HTML.
- Customer account UI is React-owned and portaled into the uploaded storefront header; a single AccountProvider manages identity transitions, and profile reads/writes use authenticated server functions with owner-only RLS to keep personal data private.
- The public Admin preview is read-only and uses fictional order/customer fixtures and sample products only; it must never query private accounts or mutate ERP data.
- Admin product fixtures are separate from the shop catalog; supplied reference prices and availability remain explicit, and unknown selling prices display as unavailable rather than invented values.
- Admin preview navigation is defined in a shared section registry and persisted in validated URL search state so preview sections survive refresh; its light theme is scoped to the workspace to preserve the storefront theme.
- Disable the uploaded storefront's global stylesheet while the admin preview is mounted and restore it on exit, so client navigation cannot contaminate admin layout or colors.
- The shared User/Admin view switch only navigates between the storefront and read-only admin preview; it never changes account roles or grants privileges.
