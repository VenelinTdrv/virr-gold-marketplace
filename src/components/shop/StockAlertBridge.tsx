import { useEffect, useRef } from 'react';
import { useAccount } from './AccountProvider';
import { listStockAlerts, toggleStockAlert } from '@/lib/shop/stock-alerts.functions';

type GoldWindow = { goldStockAlerts?: number[]; goldToggleStockAlert?: (id: number) => void; goldRefreshAlerts?: () => void; toast?: (s: string) => void };

/** Connects the storefront's bell buttons to signed-in stock alert subscriptions. */
export function StockAlertBridge({ onSignInRequired }: { onSignInRequired: () => void }) {
  const { user, ready } = useAccount();
  const userRef = useRef(user);
  userRef.current = user;
  useEffect(() => {
    const w = window as unknown as GoldWindow;
    const publish = (ids: number[]) => { w.goldStockAlerts = ids; w.goldRefreshAlerts?.(); };
    if (!ready) return;
    if (user) void listStockAlerts().then(publish).catch(() => publish([]));
    else publish([]);
    w.goldToggleStockAlert = id => {
      if (!userRef.current) {
        w.toast?.('Влезте в профила си, за да получавате известия за наличност.');
        onSignInRequired();
        return;
      }
      const enabled = !(w.goldStockAlerts ?? []).includes(id);
      void toggleStockAlert({ data: { productId: id, enabled } }).then(() => {
        const cur = w.goldStockAlerts ?? [];
        publish(enabled ? [...cur, id] : cur.filter(i => i !== id));
        w.toast?.(enabled ? 'Ще ви известим по имейл, когато продуктът е наличен.' : 'Известието за наличност е премахнато.');
      }).catch(() => w.toast?.('Известието не може да бъде запазено. Опитайте отново.'));
    };
  }, [user, ready, onSignInRequired]);
  return null;
}
