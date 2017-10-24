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
    return memo + (col.fixedWidth || col.width) + (col.cellPadding || 0);
  }, 0);
}

export function setFixedGroupMinWidth(columns, tableWidth) {
  if (!tableWidth) return;
  const fixedGroup =
    columns[0].group ? columns[0].columns : columns.slice(0, 3);
  const fixedGroupWidth = getTotalWidth(fixedGroup);
  const columnsWidth = getTotalWidth(columns);
  const space = Math.max(tableWidth - columnsWidth, 0);

  if (space / 2 + fixedGroupWidth < 400) {
    fixedGroup[2].width = 348;
  }
}
