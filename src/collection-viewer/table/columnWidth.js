import { getColumnLabel } from './utils';

export const canvas = document.createElement('canvas').getContext('2d');

const getFontString =
  (weight = 'normal') => `${weight} 13px "Helvetica","Arial",sans-serif`;

canvas.font = getFontString();
const emWidth = canvas.measureText('m').width * 0.7;
canvas.font = getFontString('bold');
const emBoldWidth = canvas.measureText('m').width * 0.7;

const maxChars = 100;
export function measureText(text, isBold) {
  return Math.min(text.length, maxChars) * (isBold ? emBoldWidth : emWidth);
}

export function defaultWidthGetter(row, { valueGetter, columnKey }, isBold) {
  const value = valueGetter(row);
  if (value === null || typeof value === 'undefined') return 0;
  const string = String(value);
  if (!string.length) return 0;
  return measureText(string, isBold);
}

export function addColumnWidth(column, { data }) {
  if (column.fixedWidth) {
    return column;
  }

  const { getWidth = defaultWidthGetter, cellPadding = 12 } = column;
  const columnHeaderWidth = measureText(getColumnLabel(column)) + cellPadding;

  column.width = data.length ? data.reduce((maxWidth, row) =>
    Math.max(
      maxWidth,
      column.getMinWidth ? column.getMinWidth() : column.minWidth || 0,
      columnHeaderWidth,
      getWidth(row, column, row.__isCollection || row.__isReference) + cellPadding,
    ), 0
  ) : columnHeaderWidth;

  return column;
}
