
export const metadata = 'metadata';

export const resistanceProfile = 'resistanceProfile';

export const formatColumnLabel =
  (columnkey) => columnkey.replace(/^__/, '').replace(/_/g, ' ').toUpperCase();


export function sortAssemblies(assemblies, id1, id2) {
  const assembly1 = assemblies[id1];
  const assembly2 = assemblies[id2];

  if (assembly1.metadata.assemblyName < assembly2.metadata.assemblyName) {
    return -1;
  }

  if (assembly1.metadata.assemblyName > assembly2.metadata.assemblyName) {
    return 1;
  }

  return 0;
}


const canvas = document.createElement('canvas').getContext('2d');
canvas.font = '13px "Helvetica","Arial",sans-serif';

const cellPadding = 36;

function measureText(text) {
  return canvas.measureText(text).width + cellPadding;
}

export function addColumnWidth(column, data) {
  if (column.fixedWidth) {
    return column;
  }

  const { columnKey, getCellContents } = column;
  const columnLabelWidth = measureText(formatColumnLabel(columnKey));

  column.width = data.length ? data.reduce((maxWidth, row) => {
    return Math.max(
      maxWidth,
      columnLabelWidth,
      measureText(getCellContents(column, row) || ''),
    );
  }, 0) : columnLabelWidth;

  return column;
}
