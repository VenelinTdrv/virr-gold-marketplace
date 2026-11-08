import { PRODUCTS, type Product } from './products';

export type AdminProduct = Omit<Product, 'price' | 'stock'> & { price: number | null; stock: boolean };
const barImage = PRODUCTS.find(product => product.category === 'bars')?.image ?? '';
// Values transcribed from the supplied reference. Missing selling prices stay unknown.
const rows: [string, string, number, string, number | null, number, boolean][] = [
  ['valcambi-1g', 'Valcambi', 1, '1 грам', 148, 124, true],
  ['pamp-1g', 'PAMP', 1, '1 грам', 149, 124, true],
  ['valcambi-2-5g', 'Valcambi', 2.5, '2,5 грама', 353, 316, true],
  ['pamp-2-5g', 'PAMP', 2.5, '2,5 грама', 356, 316, true],
  ['valcambi-5g', 'Valcambi', 5, '5 грама', 665, 614, true],
  ['pamp-5g', 'PAMP', 5, '5 грама', 674, 614, true],
  ['valcambi-10g', 'Valcambi', 10, '10 грама', 1255, 1221, true],
  ['pamp-10g', 'PAMP', 10, '10 грама', 1264, 1221, true],
  ['valcambi-20g', 'Valcambi', 20, '20 грама', 2463, 2429, true],
  ['pamp-20g', 'PAMP', 20, '20 грама', null, 2429, false],
  ['pamp-1oz', 'PAMP', 31.1035, '1 унция', null, 3753, false],
  ['valcambi-1oz', 'Valcambi', 31.1035, '1 унция', 3803, 3753, true],
  ['pamp-50g', 'PAMP', 50, '50 грама', null, 5995, false],
  ['valcambi-50g', 'Valcambi', 50, '50 грама', 6051, 5995, true],
];
export const adminProducts: AdminProduct[] = rows.map(([id, mint, weightG, weight, price, buyback, stock]) => ({
  id, mint, weightG, price, buyback, stock,
  name: `${weight} златно кюлче ${mint}${mint === 'PAMP' ? (weightG === 31.1035 ? ' Suisse' : ' Фортуна') : ''}`,
  category: 'bars', fineness: '999.9', country: 'Швейцария', image: barImage,
  description: 'Артикул от предоставения списък за административния преглед.',
}));