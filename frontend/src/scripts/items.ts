import { ColumnType, type Item } from '@/types';

type ColumnFunction = (item: Item) => string;
const currencyFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' });

const itemColumnRegistry: Record<ColumnType, ColumnFunction> = {
  [ColumnType.ICON_URL]: item => item.iconURL,
  [ColumnType.ATTRIBUTES]: item => item.attributes?.map(attr => typeof attr == 'string' ? attr : attr.name).join(', ').substring(0, 16) ?? '',
  [ColumnType.TOTAL_PRICE]: item => currencyFormatter.format(item.unitPrice * item.quantity),
  [ColumnType.NAME]: item => item.name,
  [ColumnType.QUANTITY]: item => item.quantity + '',
  [ColumnType.UNIT]: item => item.unit,
  [ColumnType.UNIT_PRICE]: item => item.unitPrice + '',
};

export function getItemColumnValue(item: Item, columnType: ColumnType | string) {
  return itemColumnRegistry[columnType](item);
}
