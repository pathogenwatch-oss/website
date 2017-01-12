export const getCellValue = ({ valueGetter }, data) => valueGetter(data);

export const formatColumnKeyAsLabel =
  columnkey =>
    columnkey.
      replace(/_?_autocolou?r$/, '').
      replace(/^__/, '').
      replace(/_/g, ' ').
      toUpperCase();

export function getColumnLabel(props) {
  return (
    props.getLabel ?
      props.getLabel() :
      formatColumnKeyAsLabel(props.columnKey)
  );
}
