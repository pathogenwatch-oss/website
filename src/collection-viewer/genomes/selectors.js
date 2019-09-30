import { createSelector } from 'reselect';

import { getPrivateMetadata } from '../private-metadata/selectors';
import { getTreeStateKey, isTopLevelTree } from '../tree/selectors';

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

export const getUnfilteredGenomeIds = createSelector(
  getGenomes,
  getTreeStateKey,
  isTopLevelTree,
  (genomes, tree, isTopLevel) => {
    const ids = [];
    for (const genome of Object.values(genomes)) {
      if (isTopLevel) {
        if (genome.__isCollection) {
          ids.push(genome.uuid);
        }
      } else if (genome.analysis && genome.analysis.core.fp.reference === tree) {
        ids.push(genome.uuid);
      }
    }
    return ids;
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
