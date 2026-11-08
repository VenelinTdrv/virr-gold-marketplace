import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export const listStockAlerts = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from('stock_alerts').select('product_id').eq('user_id', context.userId);
    if (error) throw new Error('Известията не могат да бъдат заредени.');
    return data.map(r => r.product_id);
  });

export const toggleStockAlert = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ productId: z.number().int().positive(), enabled: z.boolean() }).parse(input))
  .handler(async ({ context, data }) => {
    const q = data.enabled
      ? context.supabase.from('stock_alerts').upsert({ user_id: context.userId, product_id: data.productId }, { onConflict: 'user_id,product_id', ignoreDuplicates: true })
      : context.supabase.from('stock_alerts').delete().eq('user_id', context.userId).eq('product_id', data.productId);
    const { error } = await q;
    if (error) throw new Error('Известието не може да бъде запазено.');
    return { productId: data.productId, enabled: data.enabled };
  });
