import { createSelector } from 'reselect';

import { getActiveAssemblies } from '../collection-viewer/selectors';

export const getFastaArchiveFiles = createSelector(
  getActiveAssemblies,
  assemblies => assemblies.map(
    ({ metadata }) => ({
      id: metadata.fileId,
      name: metadata.assemblyName,
    })
  )
);
