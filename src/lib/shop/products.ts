import bar from "@/assets/bar-luxury.jpg";
import coin from "@/assets/coin-luxury.jpg";
import numis from "@/assets/numis-luxury.jpg";

export type Category = "bars" | "coins" | "numismatic" | "other";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "bars", label: "Златни кюлчета" },
  { id: "coins", label: "Инвестиционни монети" },
  { id: "numismatic", label: "Нумизматични монети" },
  { id: "other", label: "Други" },
];

export type Product = {
  id: string;
  name: string;
  category: Category;
  weightG: number;
  fineness: string;
  mint: string;
  country: string;
  year?: number;
  price: number; // EUR, VAT exempt (investment gold)
  buyback: number;
  stock: number;
  image: string;
  badge?: string;
  description: string;
};

const p = (x: Omit<Product, "buyback"> & { buyback?: number }): Product => ({
  buyback: x.buyback ?? Math.round(x.price * 0.95),
  ...x,
});

export const PRODUCTS: Product[] = [
  p({ id: "bar-1g", name: "Златно кюлче 1 g", category: "bars", weightG: 1, fineness: "999.9", mint: "Valcambi", country: "Швейцария", price: 139, stock: 120, image: bar, description: "Компактно кюлче, идеално за начало на спестяванията в злато. С сертификат LBMA." }),
  p({ id: "bar-5g", name: "Златно кюлче 5 g", category: "bars", weightG: 5, fineness: "999.9", mint: "PAMP", country: "Швейцария", price: 612, stock: 64, image: bar, description: "Кюлче PAMP Fortuna в запечатана карта с сериен номер и сертификат." }),
  p({ id: "bar-10g", name: "Златно кюлче 10 g", category: "bars", weightG: 10, fineness: "999.9", mint: "Heraeus", country: "Германия", price: 1205, stock: 48, image: bar, badge: "Топ продажба", description: "Най-търсеният грамаж за инвеститори – добър баланс между премия и ликвидност." }),
  p({ id: "bar-20g", name: "Златно кюлче 20 g", category: "bars", weightG: 20, fineness: "999.9", mint: "Argor-Heraeus", country: "Швейцария", price: 2390, stock: 22, image: bar, description: "Швейцарско кюлче със сертификат, в защитна опаковка." }),
  p({ id: "bar-1oz", name: "Златно кюлче 1 oz (31.1 g)", category: "bars", weightG: 31.1, fineness: "999.9", mint: "Valcambi", country: "Швейцария", price: 3690, stock: 30, image: bar, description: "Стандартна тройунция – международно разпознаваема и лесна за препродажба." }),
  p({ id: "bar-50g", name: "Златно кюлче 50 g", category: "bars", weightG: 50, fineness: "999.9", mint: "Heraeus", country: "Германия", price: 5890, stock: 9, image: bar, description: "Кюлче с ниска премия за по-големи инвестиции." }),
  p({ id: "bar-100g", name: "Златно кюлче 100 g", category: "bars", weightG: 100, fineness: "999.9", mint: "PAMP", country: "Швейцария", price: 11690, stock: 6, image: bar, badge: "Най-ниска премия", description: "Отличен избор за дългосрочно съхранение на стойност." }),
  p({ id: "bar-1kg", name: "Златно кюлче 1 kg", category: "bars", weightG: 1000, fineness: "999.9", mint: "Argor-Heraeus", country: "Швейцария", price: 115400, stock: 0, image: bar, description: "Леярско кюлче за институционални и големи частни инвеститори." }),
  p({ id: "krugerrand", name: "Krugerrand 1 oz", category: "coins", weightG: 31.1, fineness: "916.7", mint: "South African Mint", country: "ЮАР", year: 2026, price: 3760, stock: 40, image: coin, badge: "Класика", description: "Най-разпространената инвестиционна монета в света, сечена от 1967 г." }),
  p({ id: "philharmonic", name: "Виенска филхармония 1 oz", category: "coins", weightG: 31.1, fineness: "999.9", mint: "Austrian Mint", country: "Австрия", year: 2026, price: 3745, stock: 35, image: coin, description: "Най-продаваната инвестиционна монета в Европа." }),
  p({ id: "maple", name: "Maple Leaf 1 oz", category: "coins", weightG: 31.1, fineness: "999.9", mint: "Royal Canadian Mint", country: "Канада", year: 2026, price: 3752, stock: 18, image: coin, description: "Канадски кленов лист с микро-гравирани защитни елементи." }),
  p({ id: "britannia", name: "Britannia 1 oz", category: "coins", weightG: 31.1, fineness: "999.9", mint: "The Royal Mint", country: "Великобритания", year: 2026, price: 3765, stock: 12, image: coin, description: "Британска монета с модерни защити срещу фалшификати." }),
  p({ id: "philharmonic-110", name: "Виенска филхармония 1/10 oz", category: "coins", weightG: 3.11, fineness: "999.9", mint: "Austrian Mint", country: "Австрия", year: 2026, price: 412, stock: 80, image: coin, description: "Достъпна монета с малък грамаж – подходяща и за подарък." }),
  p({ id: "sovereign", name: "Британски соверен", category: "numismatic", weightG: 7.32, fineness: "916.7", mint: "The Royal Mint", country: "Великобритания", year: 1912, price: 1090, stock: 7, image: numis, badge: "Колекционерска", description: "Исторически соверен с портрет на Джордж V. Състояние: VF+." }),
  p({ id: "napoleon", name: "20 франка Наполеон III", category: "numismatic", weightG: 6.45, fineness: "900", mint: "Monnaie de Paris", country: "Франция", year: 1865, price: 985, stock: 4, image: numis, description: "Френска златна монета от Втората империя. Състояние: XF." }),
  p({ id: "ducat", name: "4 дуката Франц Йосиф", category: "numismatic", weightG: 13.96, fineness: "986", mint: "Austrian Mint", country: "Австрия", year: 1915, price: 1790, stock: 3, image: numis, description: "Официален рестрайк на австрийския 4-дукат. Състояние: UNC." }),
  p({ id: "gift-set", name: "Подаръчен комплект 3 × 1 g", category: "other", weightG: 3, fineness: "999.9", mint: "Valcambi", country: "Швейцария", price: 449, stock: 25, image: bar, description: "Три кюлчета по 1 g в луксозна кутия – идеален подарък." }),
  p({ id: "combibar", name: "CombiBar 50 × 1 g", category: "other", weightG: 50, fineness: "999.9", mint: "Valcambi", country: "Швейцария", price: 6150, stock: 5, image: bar, description: "Кюлче, което се разделя на 50 части от по 1 g – гъвкавост при продажба." }),
];

export const MINTS = Array.from(new Set(PRODUCTS.map((x) => x.mint))).sort();
export const WEIGHT_RANGES = [
  { id: "lt5", label: "до 5 g", test: (g: number) => g <= 5 },
  { id: "5to31", label: "5 – 31.1 g", test: (g: number) => g > 5 && g <= 31.1 },
  { id: "31to100", label: "31.1 – 100 g", test: (g: number) => g > 31.1 && g <= 100 },
  { id: "gt100", label: "над 100 g", test: (g: number) => g > 100 },
];

export const fmt = (n: number) =>
  new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR" }).format(n);
export const pricePerGram = (x: Product) => x.price / x.weightG;
