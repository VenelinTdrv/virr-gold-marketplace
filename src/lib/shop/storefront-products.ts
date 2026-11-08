export type StorefrontProduct = { id: number; name: string; brand: string; type: string; weight: number; purity: string; price: number; stock: number; year: string; tag: string };
export const storefrontProducts: StorefrontProduct[]=[
{id:1,name:'Златно кюлче PAMP Fortuna',brand:'PAMP',type:'bars',weight:10,purity:'999.9',price:1320,stock:15,year:'2026',tag:'Избор за начало'},
{id:2,name:'Виенска филхармония',brand:'Austrian Mint',type:'coins',weight:31.1035,purity:'999.9',price:3895,stock:8,year:'2026',tag:'1 тройунция'},
{id:3,name:'Златно кюлче Valcambi',brand:'Valcambi',type:'bars',weight:20,purity:'999.9',price:2520,stock:12,year:'2026',tag:''},
{id:4,name:'Канадски кленов лист',brand:'Royal Canadian Mint',type:'coins',weight:31.1035,purity:'999.9',price:3910,stock:5,year:'2026',tag:'1 тройунция'},
{id:5,name:'Златно кюлче PAMP Fortuna',brand:'PAMP',type:'bars',weight:5,purity:'999.9',price:690,stock:20,year:'2026',tag:'Компактен избор'},
{id:6,name:'20 франка Мариана',brand:'Monnaie de Paris',type:'numis',weight:5.8064,purity:'900',price:890,stock:1,year:'1907',tag:'Историческа монета'},
{id:7,name:'Златно кюлче Argor-Heraeus',brand:'Argor-Heraeus',type:'bars',weight:100,purity:'999.9',price:12290,stock:3,year:'2026',tag:''},
{id:8,name:'Златна Британия',brand:'The Royal Mint',type:'coins',weight:31.1035,purity:'999.9',price:3880,stock:0,year:'2025',tag:'1 тройунция'},
{id:9,name:'Златно кюлче Valcambi',brand:'Valcambi',type:'bars',weight:1,purity:'999.9',price:149,stock:30,year:'2026',tag:'За подарък'},
{id:10,name:'Златно кюлче Valcambi',brand:'Valcambi',type:'bars',weight:50,purity:'999.9',price:6200,stock:4,year:'2026',tag:''},
{id:11,name:'Британски суверен',brand:'The Royal Mint',type:'numis',weight:7.3224,purity:'916.7',price:1150,stock:2,year:'1915',tag:'Колекционерски избор'},
{id:12,name:'Капсула за монета 1 oz',brand:'Аксесоари',type:'accessories',weight:0,purity:'—',price:4.9,stock:40,year:'',tag:'Аксесоар'}];
export function findStorefrontProduct(id: string) { return storefrontProducts.find(product => String(product.id) === id); }
