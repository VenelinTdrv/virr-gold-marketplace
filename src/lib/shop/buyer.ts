import { z } from "zod";

const text = (max: number) => z.string().trim().min(1, "Попълнете полето.").max(max, `Максимум ${max} знака.`);
const contact = {
  customer: text(100),
  email: z.string().trim().email("Въведете валиден имейл.").max(255),
  phone: z.string().trim().regex(/^[+0-9 ()-]{7,20}$/, "Въведете валиден телефон."),
};
export const buyerSchema = z.discriminatedUnion("buyerType", [
  z.object({ buyerType: z.literal("individual"), ...contact }),
  z.object({
    buyerType: z.literal("company"), ...contact,
    companyName: text(150),
    eik: z.string().trim().regex(/^\d{9}(\d{4})?$/, "ЕИК трябва да съдържа 9 или 13 цифри."),
    vat: z.string().trim().max(20).refine(v => !v || /^BG\d{9,10}$/.test(v), "Въведете ДДС номер във формат BG и 9–10 цифри."),
    billingAddress: text(300),
  }),
]);
export function validateBuyer(input: unknown) {
  const result = buyerSchema.safeParse(input);
  return result.success
    ? { success: true as const, data: result.data }
    : { success: false as const, issues: result.error.issues.map(i => ({ field: String(i.path[0]), message: i.message })) };
}