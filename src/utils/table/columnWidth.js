import { formatColumnLabel } from '../table';

const canvas = document.createElement('canvas').getContext('2d');

const cellPadding = 40;

const getFontString =
  (weight = 'normal') => `${weight} 13px "Helvetica","Arial",sans-serif`;

function measureText(text) {
  return canvas.measureText(text).width + cellPadding;
}

export function defaultWidthGetter({ valueGetter }, row) {
  return measureText(valueGetter(row) || '');
}

export function addColumnWidth(column, data) {
  if (column.fixedWidth) {
    return column;
  }

  const { columnKey, getWidth = defaultWidthGetter } = column;
  canvas.font = getFontString();
  const columnLabelWidth = measureText(formatColumnLabel(columnKey));

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
