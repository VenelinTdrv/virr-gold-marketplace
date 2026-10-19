import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { goldMarkup } from "@/lib/shop/goldMarkup";

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

function GoldShop() {
  useEffect(() => {
    const w = window as unknown as { __goldLoaded?: boolean };
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
  return <div dangerouslySetInnerHTML={{ __html: goldMarkup }} />;
}
