import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'Въведете име.').max(100),
  phone: z.string().trim().max(30).refine(v => !v || /^[+\d\s()-]{5,30}$/.test(v), 'Проверете телефона.'),
  address: z.string().trim().max(300),
  city: z.string().trim().max(100),
});
export const credentialsSchema = z.object({ email: z.string().trim().email('Въведете валиден имейл.').max(255), password: z.string().min(8, 'Паролата трябва да съдържа поне 8 символа.').max(128) });
export type CustomerProfile = z.infer<typeof profileSchema>;