// Fictional records for the public, read-only admin preview. Never load customer accounts here.
export const previewOrders = [
  { id: 'DEMO-1048', customer: 'Демо клиент 01', product: 'Златно кюлче 10 g', total: 1205, date: '08.11.2026', status: 'Нова', payment: 'Банков превод' },
  { id: 'DEMO-1047', customer: 'Демо клиент 02', product: 'Maple Leaf 1 oz', total: 3752, date: '08.11.2026', status: 'Потвърдена', payment: 'Банков превод' },
  { id: 'DEMO-1046', customer: 'Демо дружество 01', product: 'Златно кюлче 100 g', total: 11690, date: '07.11.2026', status: 'Изпратена', payment: 'Банков превод' },
  { id: 'DEMO-1045', customer: 'Демо клиент 03', product: 'Британски соверен', total: 1090, date: '07.11.2026', status: 'Завършена', payment: 'Плащане в офис' },
  { id: 'DEMO-1044', customer: 'Демо клиент 04', product: 'Златно кюлче 5 g', total: 612, date: '06.11.2026', status: 'Завършена', payment: 'Банков превод' },
];
export const previewCustomers = [
  { id: 'DEMO-C01', name: 'Демо клиент 01', type: 'Физическо лице', orders: 3, total: 4935 },
  { id: 'DEMO-C02', name: 'Демо клиент 02', type: 'Физическо лице', orders: 1, total: 3752 },
  { id: 'DEMO-C03', name: 'Демо дружество 01', type: 'Юридическо лице', orders: 2, total: 23380 },
  { id: 'DEMO-C04', name: 'Демо клиент 03', type: 'Физическо лице', orders: 1, total: 1090 },
  { id: 'DEMO-C05', name: 'Демо клиент 04', type: 'Физическо лице', orders: 1, total: 612 },
];