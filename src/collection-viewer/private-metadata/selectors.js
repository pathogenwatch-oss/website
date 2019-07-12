import { createSelector } from 'reselect';

export const getPrivateMetadata = state => state.viewer.metadata;

export const numberOfMetadataRows = createSelector(
  getPrivateMetadata,
  metadata => Object.keys(metadata).length
);
