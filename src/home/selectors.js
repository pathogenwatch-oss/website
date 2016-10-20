import { selectors as filter } from '../home-filter';

import { referenceCollections } from '../species';

export const getReferenceCollections = () => referenceCollections;

export const getTotalCollections = () => referenceCollections.length;

export const getVisibleCollections =
  filter.getIncludedItems(getReferenceCollections);
