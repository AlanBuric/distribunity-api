import { ColumnType, type CurrencyFormat, type InventoryItem, type Item } from '@/types';
import { h, type VNode } from 'vue';
/*
type ColumnFunction = (item: InventoryItem) => string;
const currencyFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' });
new Intl.NumberFormat(undefined, {});

type ItemTableColumns =
  | 'name'
  | 'icon'
  | 'attributes'
  | 'totalPrice'
  | 'quantity'
  | 'unit'
  | 'unitPrice';

type RowDefinition<T extends string> = { [key in T]: VNode };

const itemColumnRegistry: Record<ColumnType, ColumnFunction> = {
  [ColumnType.ICON_URL]: (item) => item.iconUrl,
  [ColumnType.ATTRIBUTES]: (item) =>
    item.attributes
      ?.map((attr) => (typeof attr == 'string' ? attr : attr.name))
      .join(', ')
      .substring(0, 16) ?? '',
  [ColumnType.TOTAL_PRICE]: (item) => currencyFormatter.format(item.unitPrice * item.quantity),
  [ColumnType.NAME]: (item) => item.name,
  [ColumnType.QUANTITY]: (item) => item.quantity + '',
  [ColumnType.UNIT]: (item) => item.unit,
  [ColumnType.UNIT_PRICE]: (item) => item.unitPrice + '',
};

export function getItemColumnValue(item: Item, columnType: ColumnType | string) {
  return itemColumnRegistry[columnType](item);
}*/

export function formatCurrency(value: number, format: CurrencyFormat): string {
  let [integer, fraction = ''] = Math.abs(value).toFixed(format.fractionDigits).split('.');

  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, format.thousandSeparator);

  let formatted = integer;

  if (format.fractionDigits > 0) formatted += format.decimalSeparator + fraction;

  formatted = format.isSymbolBefore
    ? `${format.symbol}${formatted}`
    : `${formatted}${format.symbol}`;

  if (value < 0) formatted = '-' + formatted;

  return formatted;
}
