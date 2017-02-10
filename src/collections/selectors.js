import { createSelector } from 'reselect';

import { selectors as prefilter } from '../prefilter';

import { stateKey, prefilters } from './filter';

export const getPrefilter = state => prefilter.getPrefilter(state, { stateKey });

export const getCollections = createSelector(
  ({ collections }) => collections.entities,
  getPrefilter,
  (collections, prefilterKey) =>
    Object.keys(collections).reduce((memo, key) => {
      const collection = collections[key];
      if (prefilters[prefilterKey](collection)) memo.push(collection);
      return memo;
    }, [])
);

export const getTotalCollections =
  state => getCollections(state).length;
