export const nameColumnData = {
  columnKey: '__name',
  valueGetter({ metadata }) {
    return metadata.assemblyName;
  },
};
