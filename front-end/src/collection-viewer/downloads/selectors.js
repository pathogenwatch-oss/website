import { createSelector } from 'reselect';

import { getServerPath } from '~/utils/Api';
import { getViewer, getCollection } from '../selectors';
import { getGenomes } from '../genomes/selectors';
import { getActiveGenomeIds } from '../selectors/active';

export const isMenuOpen = state =>
  getViewer(state).downloads.menuOpen;

export const getFiles = state =>
  getViewer(state).downloads.files;

export const getCounts = createSelector(
  getGenomes,
  getActiveGenomeIds,
  (genomes, ids) =>
    ids.reduce((memo, id) => {
      const { reference, __isCollection } = genomes[id];
      if (reference) {
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

export const getDownloadPath = createSelector(
  getCollection,
  collection => getServerPath(`/download/collection/${collection.uuid}`)
);
