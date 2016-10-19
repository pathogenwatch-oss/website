// import { createSelector } from 'reselect';

import { selectors as filter } from '../home-filter';

import { referenceCollections } from '../species';

export const getTotalCollections = () => referenceCollections.length;

export const getVisibleCollections =
  filter.getIncludedItems(() => referenceCollections);
