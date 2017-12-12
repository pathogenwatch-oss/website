import { createSelector } from 'reselect';

import { getServerPath } from '../../utils/Api';
import { getViewer, getCollection, getGenomes, getActiveGenomeIds } from '../selectors';

export const isMenuOpen = state =>
  getViewer(state).downloads.menuOpen;

export const getFiles = state =>
  getViewer(state).downloads.files;

export const getCounts = createSelector(
  getGenomes,
  getActiveGenomeIds,
  (genomes, ids) =>
    ids.reduce((memo, id) => {
      const { __isReference, __isCollection } = genomes[id];
      if (__isReference) {
        memo.reference++;
        return memo;
      }
      if (__isCollection) {
        memo.collection++;
        return memo;
      }
      memo.public++;
      return memo;
    }, { reference: 0, collection: 0, public: 0 })
);

export const getDownloadPrefix = createSelector(
  getCollection,
  collection => getServerPath(`/download/collection/${collection.uuid}`)
);
