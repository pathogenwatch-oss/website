import { createSelector } from 'reselect';
import removeMarkdown from 'remove-markdown';

import { POPULATION, COLLECTION } from '~/app/stateKeys/tree';
import Organisms from '~/organisms';

export const getViewer = ({ viewer }) => viewer;
export const getHistory = ({ viewer }) => viewer.history;

export const getCollection = state => getViewer(state).entities.collection;
export const isClusterView = state => getCollection(state).isClusterView;

export const getCollectionTitle = createSelector(
  getCollection,
  ({ title }) => (title ? removeMarkdown(title) : null)
);

export const getCollectionMetadata = createSelector(
  getCollection,
  collection => ({
    title: collection.title,
    description: collection.description,
    dateCreated: new Date(collection.createdAt),
    pmid: collection.pmid,
    owner: collection.owner,
    access: collection.access,
  })
);

export const getSingleTree = createSelector(
  getCollection,
  (collection) => {
    if (!Organisms.uiOptions.hasPopulation) return COLLECTION;
    if (collection.size < 3) return POPULATION;
    return null;
  }
);
