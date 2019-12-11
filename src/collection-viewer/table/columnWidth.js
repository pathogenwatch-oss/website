import { getColumnLabel } from './utils';

export const canvas = document.createElement('canvas').getContext('2d');

const getFontString =
  (weight = 'normal') => `${weight} 13px "Roboto", "Helvetica", "Arial", sans-serif`;

const maxChars = 100;
export function measureText(text, isBold) {
  canvas.font = getFontString(isBold ? 'bold' : 'normal');
  return canvas.measureText(text.slice(0, maxChars)).width;
}

export function defaultWidthGetter(row, column, isBold) {
  const { valueGetter, getTextToMeasure = valueGetter } = column;
  const value = getTextToMeasure(row);
  if (value === null || typeof value === 'undefined') return 0;
  const string = String(value);
  if (!string.length) return 0;
  return measureText(string, isBold);
}

export function addColumnWidth(column, { genomes }) {
  if (column.fixedWidth) {
    return column;
  }

  const { cellPadding = 24 } = column;
  const columnHeaderWidth = measureText(getColumnLabel(column), true) + cellPadding;

  let longestValue = '';
  let isBold = false;
  const { valueGetter, getTextToMeasure = valueGetter } = column;
  for (const genome of genomes) {
    let value = getTextToMeasure(genome);
    if (value === null || typeof value === 'undefined') continue;
    value = String(value);
    if (value.length > longestValue.length) {
      longestValue = value;
      isBold = column.columnKey === '__name' && (genome.__isCollection || genome.__isReference);
    }
  }

  column.width = longestValue.length ?
    Math.max(
      column.getMinWidth ? column.getMinWidth() : column.minWidth || 0,
      columnHeaderWidth,
      measureText(longestValue, isBold) + cellPadding,
    )
    : columnHeaderWidth;

  return column;
}
