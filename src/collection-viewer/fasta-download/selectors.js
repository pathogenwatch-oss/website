import { createSelector } from 'reselect';

import { getActiveAssemblies } from '../selectors';

export const getFastaArchiveFiles = createSelector(
  getActiveAssemblies,
  assemblies => assemblies.map(
    ({ name, fileId }) => ({
      name,
      id: fileId,
    })
  )
);
