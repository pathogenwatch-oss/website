import { createSelector } from 'reselect';
import removeMarkdown from 'remove-markdown';

import { getGenomes } from './genomes/selectors';
import { getHighlightedIds } from './highlight/selectors';
import { getFilteredGenomeIds } from './filter/selectors';

export const getViewer = ({ viewer }) => viewer;

export const getCollection = state => getViewer(state).entities.collection;
export const isClusterView = state => getCollection(state).isClusterView;

export const getCollectionTitle = createSelector(
  getCollection,
  ({ title }) => (title ? removeMarkdown(title) : null)
);

export const getActiveGenomeIds = createSelector(
  getHighlightedIds,
  getFilteredGenomeIds,
  (highlighted, visible) => Array.from(highlighted.size ? highlighted : visible)
);

export const getActiveGenomes = createSelector(
  getGenomes,
  getActiveGenomeIds,
  (genomes, ids) => ids.map(id => genomes[id])
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

export const getCollectionGenomeIds = createSelector(
  getGenomes,
  genomes => {
    const collectionGenomes = [];
    for (const id of Object.keys(genomes)) {
      if (genomes[id].__isCollection) {
        collectionGenomes.push(id);
      }
    }
    return collectionGenomes;
  }
);

export const getOwnGenomes = createSelector(
  getActiveGenomes,
  genomes => genomes.filter(_ => _.owner === 'me')
);
