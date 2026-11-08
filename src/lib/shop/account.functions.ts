import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { profileSchema } from './account';

export const getCustomerProfile = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from('profiles').select('full_name, phone, address, city').eq('id', context.userId).single();
    if (error) throw new Error('Профилът не може да бъде зареден.');
    return data;
  });
export const saveCustomerProfile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => profileSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: saved, error } = await context.supabase.from('profiles').update(data).eq('id', context.userId).select('full_name, phone, address, city').single();
    if (error) throw new Error('Данните не могат да бъдат запазени.');
    return saved;
  });