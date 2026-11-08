import { describe, expect, it } from "vitest";
import { validateBuyer } from "@/lib/shop/buyer";

const person = { buyerType: "individual", customer: "Иван Петров Иванов", email: "test@example.com", phone: "+359888123456" };
const company = { ...person, buyerType: "company", companyName: "Пример ООД", eik: "123456789", vat: "", billingAddress: "София, ул. Пример 1" };
describe("Checkout buyer validation", () => {
  it("allows an individual without company data", () => {
    expect(validateBuyer(person).success).toBe(true);
  });
  it("allows a legal entity with company details", () => {
    const result = validateBuyer(company);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.buyerType).toBe("company");
  });
  it("rejects a legal entity without company details", () => {
    expect(validateBuyer({ ...person, buyerType: "company" }).success).toBe(false);
  });
  it("does not require company data after switching back to an individual", () => {
    const result = validateBuyer({ ...company, buyerType: "individual", eik: "bad" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).not.toHaveProperty("eik");
  });
  it("rejects malformed EIK and accepts 9 or 13 digits", () => {
    expect(validateBuyer({ ...company, eik: "abc" }).success).toBe(false);
    expect(validateBuyer({ ...company, eik: "1234567891234" }).success).toBe(true);
  });
});