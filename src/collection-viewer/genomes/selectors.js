import { createSelector } from 'reselect';

import { getHighlightedIds } from '../highlight/selectors';
import { getUnfilteredGenomeIds, getFilteredGenomeIds } from '../filter/selectors';
import { getPrivateMetadata } from '../private-metadata/selectors';

export const getGenomes = createSelector(
  state => state.viewer.entities.genomes,
  getPrivateMetadata,
  (genomes, privateData) => {
    const merged = { ...genomes };
    const used = new Set();
    for (const [ key, shared ] of Object.entries(genomes)) {
      if (!(shared.name in privateData) || used.has(shared.name)) continue;
      const { userDefined, ...topLevel } = privateData[shared.name];
      merged[key] = {
        ...shared,
        ...topLevel,
        userDefined: {
          ...shared.userDefined,
          ...userDefined,
        },
      };
    }
    return merged;
  }
);

export const getGenomeList = createSelector(
  getGenomes,
  getUnfilteredGenomeIds,
  (genomes, ids) => Array.from(ids).map(id => genomes[id])
);

export const hasMetadata = createSelector(
  getGenomeList,
  genomes =>
    genomes.some(({ year, pmid, userDefined }) => !!(
      year ||
      pmid ||
      (userDefined && Object.keys(userDefined).length)
    ))
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
