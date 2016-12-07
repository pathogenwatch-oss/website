export const getCellValue = ({ valueGetter }, data) => valueGetter(data);

export const formatColumnKeyAsLabel =
  columnkey =>
    columnkey.
      replace(/_?_autocolou?r$/, '').
      replace(/^__/, '').
      replace(/_/g, ' ');

export function getColumnLabel(props) {
  return (
    props.getLabel ?
      props.getLabel() :
      formatColumnKeyAsLabel(props.columnKey)
  ).toUpperCase();
}

export function sortAssemblies(assemblies) {
  return assemblies.sort((assembly1, assembly2) => {
    if (assembly1.name < assembly2.name) {
      return -1;
    }

    if (assembly1.name > assembly2.name) {
      return 1;
    }

    return 0;
  });
}
