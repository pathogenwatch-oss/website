import { getColumnLabel } from '../table';

const canvas = document.createElement('canvas').getContext('2d');

const getFontString =
  (weight = 'normal') => `${weight} 13px "Helvetica","Arial",sans-serif`;

export function measureText(text, cellPadding = 40) {
  return canvas.measureText(text).width + cellPadding;
}

export function defaultWidthGetter({ valueGetter }, row) {
  return measureText(valueGetter(row) || '');
}

export function addColumnWidth(column, { data, activeColumns }) {
  if (column.fixedWidth) {
    return column;
  }

  column.isSelected = activeColumns.has(column);

  const { getWidth = defaultWidthGetter, cellPadding } = column;
  canvas.font = getFontString();
  const columnLabelWidth =
    measureText(getColumnLabel(column), cellPadding);

  column.width = data.length ? data.reduce((maxWidth, row) => {
    const weight = row.__isCollection || row.__isReference ? 'bold' : 'normal';
    canvas.font = getFontString(weight);
    return Math.max(
      maxWidth,
      columnLabelWidth,
      getWidth(column, row),
    );
  }, 0) : columnLabelWidth;

  return column;
}
