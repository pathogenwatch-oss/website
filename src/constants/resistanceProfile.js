
export const systemColumnProps = [
  { columnKey: '__assembly',
    fixed: true,
    cellClasses: 'wgsa-table-cell--bordered',
    getCellContents(_, { metadata }) {
      return metadata.assemblyName;
    },
  },
];
