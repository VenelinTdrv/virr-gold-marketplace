import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { goldMarkup } from "@/lib/shop/goldMarkup";
import { validateBuyer } from "@/lib/shop/buyer";
import { AccountEntry, AccountPanel } from "@/components/shop/AccountPanel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { ViewSwitch } from "@/components/shop/ViewSwitch";

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

const UploadedStorefront = memo(() => <div dangerouslySetInnerHTML={{ __html: goldMarkup }} />);

function GoldShop() {
  const [accountHost, setAccountHost] = useState<HTMLElement | null>(null);
  const [adminHost, setAdminHost] = useState<HTMLElement | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => {
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
    const w = window as unknown as { __goldLoaded?: boolean; goldValidateBuyer?: typeof validateBuyer };
    w.goldValidateBuyer = validateBuyer;
    // The uploaded shop script declares globals, so it can only run once per page load.
    if (w.__goldLoaded) {
      window.location.reload();
      return;
    }
    w.__goldLoaded = true;
    const s = document.createElement("script");
    s.src = "/gold/app.js";
    document.body.appendChild(s);
  }, []);
  return <><UploadedStorefront />
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
