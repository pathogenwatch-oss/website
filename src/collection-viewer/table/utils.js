export { getFormattedDateString } from '../../utils/Date';

export const getUserDefinedValue =
  (column, { userDefined }) => (userDefined ? userDefined[column] : undefined);

export const formatColumnKeyAsLabel =
  columnkey =>
    columnkey.
      replace(/_?_autocolou?r$/, '').
      replace(/^__/, '').
      replace(/_/g, ' ').
      toUpperCase();

export function getColumnLabel(props) {
  if (props.label) return props.label;
  if (props.getLabel) return props.getLabel();
  return formatColumnKeyAsLabel(props.columnKey);
}

function getTotalWidth(columns) {
  return columns.reduce((memo, col) => {
    if (col.group) {
      return memo + getTotalWidth(col.columns);
    }
    if (col.hidden) {
      return memo;
    }
    if (col.width) {
      return memo + col.width;
    }
    if (col.fixedWidth) {
      return memo + col.fixedWidth + (col.cellPadding || 0);
    }
    return memo;
  }, 0);
}

// TODO: stop hacking
export function setFixedGroupMinWidth(columns, tableWidth, magicWidth) {
  if (!tableWidth) return;

  if (!columns[0].group) {
    columns[0].flexGrow = 1;
    columns[0].width = null;
    return;
  }

  const [ spacer, downloads, name ] = columns[0].columns;
  const fixedGroupWidth = downloads.width + name.width;
  const columnsWidth = getTotalWidth(columns.slice(1)) + fixedGroupWidth;
  const space = Math.max(tableWidth - columnsWidth, 0);

  if (space / 2 + fixedGroupWidth < magicWidth + 8) {
    spacer.flexGrow = 0;
    spacer.width = magicWidth - fixedGroupWidth + 8;
  } else {
    spacer.flexGrow = 1;
    spacer.width = null;
  }
}
