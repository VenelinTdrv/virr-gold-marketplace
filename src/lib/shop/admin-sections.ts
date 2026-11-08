import { ClipboardList, ShoppingBag, RotateCcw, Truck, ArrowLeftRight, Wallet, Package, Boxes, LayoutGrid, Users, Globe, MapPin, Warehouse, Landmark, UserRoundPen, Layers, PackageSearch, CircleDollarSign, PackageX, UserCog, SlidersHorizontal } from 'lucide-react';

export const adminGroups = [
  { title: 'Операции', items: [
    { id: 'orders', title: 'Поръчки', icon: ClipboardList },
    { id: 'sales', title: 'Продажби', icon: ShoppingBag },
    { id: 'returns', title: 'Връщания', icon: RotateCcw },
    { id: 'deliveries', title: 'Доставки', icon: Truck },
    { id: 'transfers', title: 'Трансфер на стоки', icon: ArrowLeftRight },
    { id: 'payments', title: 'Плащания', icon: Wallet },
  ] },
  { title: 'Номенклатури', items: [
    { id: 'products', title: 'Артикули', icon: Package },
    { id: 'bundles', title: 'Комбота', icon: Boxes },
    { id: 'categories', title: 'Категории', icon: LayoutGrid },
    { id: 'customers', title: 'Клиенти', icon: Users },
    { id: 'suppliers', title: 'Доставчици', icon: Truck },
    { id: 'countries', title: 'Държави', icon: Globe },
    { id: 'cities', title: 'Населени места', icon: MapPin },
    { id: 'warehouses', title: 'Складове', icon: Warehouse },
    { id: 'banks', title: 'Банки', icon: Landmark },
    { id: 'assistants', title: 'Асистенти', icon: UserRoundPen },
  ] },
  { title: 'Справки', items: [
    { id: 'warehouse-stock', title: 'Наличност по складове', icon: Warehouse },
    { id: 'product-stock', title: 'Наличност по артикули', icon: PackageSearch },
    { id: 'batch-stock', title: 'Наличност по партиди', icon: Layers },
    { id: 'consignment', title: 'Стока по поръчител', icon: Layers },
    { id: 'profit', title: 'Печалба по складове', icon: CircleDollarSign },
    { id: 'out-of-stock', title: 'Изчерпани продукти', icon: PackageX },
  ] },
  { title: 'Администрация', items: [
    { id: 'users', title: 'Потребители', icon: UserCog },
    { id: 'settings', title: 'Променливи на платформата', icon: SlidersHorizontal },
  ] },
] as const;
export type AdminSection = typeof adminGroups[number]['items'][number]['id'];
export const adminItems = adminGroups.flatMap(g => [...g.items]);
export function isAdminSection(value: unknown): value is AdminSection { return typeof value === 'string' && adminItems.some(i => i.id === value); }

export type PreviewTable = { columns: string[]; rows: string[][] };
// These records are fictional; they are never read from HyperERP or customer profiles.
export const adminTables: Partial<Record<AdminSection, PreviewTable>> = {
  returns: { columns: ['Номер', 'Клиент', 'Артикул', 'Количество', 'Статус'], rows: [['DEMO-R01','Демо клиент 01','Златно кюлче 5 g','1','В преглед']] },
  deliveries: { columns: ['Номер', 'Доставчик', 'Склад', 'Дата', 'Статус'], rows: [['DEMO-D01','Демо доставчик PAMP','Основен склад (демо)','08.11.2026','Получена'],['DEMO-D02','Демо доставчик Valcambi','Основен склад (демо)','09.11.2026','Очаквана']] },
  transfers: { columns: ['Номер', 'От склад', 'Към склад', 'Артикул', 'Количество', 'Статус'], rows: [['DEMO-T01','Основен склад (демо)','Офис София (демо)','Златно кюлче 10 g','5','Завършен']] },
  bundles: { columns: ['Код', 'Име', 'Съдържание', 'Наличност'], rows: [['DEMO-B01','Стартов комплект','3 × златно кюлче 1 g','5 бр.'],['DEMO-B02','Монетна колекция','Maple Leaf + Britannia','3 бр.']] },
  suppliers: { columns: ['Код', 'Име', 'Държава', 'Статус'], rows: [['DEMO-S01','Демо доставчик PAMP','Швейцария','Активен'],['DEMO-S02','Демо доставчик Valcambi','Швейцария','Активен'],['DEMO-S03','Демо доставчик Heraeus','Германия','Активен']] },
  countries: { columns: ['Код', 'Държава'], rows: [['BG','България'],['CH','Швейцария'],['DE','Германия'],['AT','Австрия'],['CA','Канада'],['GB','Великобритания']] },
  cities: { columns: ['Код', 'Населено място', 'Държава'], rows: [['DEMO-01','София','България'],['DEMO-02','Пловдив','България'],['DEMO-03','Варна','България']] },
  warehouses: { columns: ['Код', 'Име', 'Населено място', 'Статус'], rows: [['DEMO-W01','Основен склад (демо)','София','Активен'],['DEMO-W02','Офис София (демо)','София','Активен']] },
  banks: { columns: ['Код', 'Име', 'Валута', 'Статус'], rows: [['DEMO-BANK01','Демо банкова сметка','EUR','Активна']] },
  assistants: { columns: ['Код', 'Име', 'Склад', 'Статус'], rows: [['DEMO-A01','Демо асистент 01','Основен склад (демо)','Активен'],['DEMO-A02','Демо асистент 02','Офис София (демо)','Активен']] },
  'warehouse-stock': { columns: ['Склад', 'Артикул', 'Наличност', 'Резервирани'], rows: [['Основен склад (демо)','Златно кюлче 10 g','48 бр.','2 бр.'],['Офис София (демо)','Maple Leaf 1 oz','18 бр.','1 бр.']] },
  'batch-stock': { columns: ['Партида', 'Артикул', 'Склад', 'Проба', 'Наличност'], rows: [['DEMO-LOT01','Златно кюлче 10 g','Основен склад (демо)','999.9','48 бр.'],['DEMO-LOT02','Maple Leaf 1 oz','Офис София (демо)','999.9','18 бр.']] },
  consignment: { columns: ['Поръчител', 'Артикул', 'Количество', 'Статус'], rows: [['Демо поръчител 01','Британски соверен','2 бр.','Приета']] },
  profit: { columns: ['Склад', 'Продажби', 'Себестойност', 'Печалба', 'Период'], rows: [['Основен склад (демо)','15 442,00 €','14 600,00 €','842,00 €','Ноември 2026'],['Офис София (демо)','2 907,00 €','2 700,00 €','207,00 €','Ноември 2026']] },
  users: { columns: ['Име', 'Роля', 'Статус'], rows: [['Демо администратор','Администратор (пример)','Активен'],['Демо оператор','Оператор (пример)','Активен']] },
  settings: { columns: ['Променлива', 'Стойност', 'Описание'], rows: [['Валута','EUR','Валута на магазина'],['Език','Български','Основен език'],['ERP система','HyperERP','Предстояща връзка'],['Режим','Preview','Без реални промени']] },
};