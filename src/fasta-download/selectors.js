import { createSelector } from 'reselect';

export const getFastaArchiveFiles = createSelector(
  ({ filter }) => filter,
  ({ entities }) => entities.assemblies,
  (filter, assemblies) => {
    const ids = Array.from(filter.active ? filter.ids : filter.unfilteredIds);

    return ids.map(id => {
      const { metadata } = assemblies[id];
      return {
        id: metadata.fileId,
        name: metadata.assemblyName,
      };
    });
  }
);
