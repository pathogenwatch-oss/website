
export const systemColumnProps = [
  { columnKey: '__assembly',
    fixed: true,
    getCellContents(_, { metadata }) {
      return metadata.assemblyName;
    },
  },
];
