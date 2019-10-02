import { createSelector } from 'reselect';

import { getCollection } from '../selectors';
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

const getGenomeDatatypes = createSelector(
  getGenomeList,
  getCollection,
  (genomes, { isClusterView }) => {
    let hasMetadata = false;
    let hasAMR = !!isClusterView;

    for (const genome of genomes) {
      if (!hasMetadata) {
        const { year, pmid, userDefined } = genome;
        if (year || pmid || (userDefined && Object.keys(userDefined).length)) {
          hasMetadata = true;
        }
      }

      if (!genome.analysis) continue;
      if (!hasAMR && genome.analysis.paarsnp) {
        hasAMR = true;
      }

      if (hasMetadata && hasAMR) break;
    }

    return {
      hasMetadata,
      hasAMR: isClusterView ? false : hasAMR,
    };
  }
);

export const hasMetadata = createSelector(
  getGenomeDatatypes,
  datatypes => datatypes.hasMetadata
);

export const hasAMR = createSelector(
  getGenomeDatatypes,
  datatypes => datatypes.hasAMR
);
