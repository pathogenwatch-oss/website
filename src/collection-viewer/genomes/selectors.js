import { createSelector } from 'reselect';

import { getCollection } from '../selectors';
import { getPrivateMetadata } from '../private-metadata/selectors';
import { isTopLevelTree, getTreeStateKey } from '../tree/selectors';

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
      if (isTopLevel || tree === null) {
        if (genome.__isCollection) {
          ids.push(genome.uuid);
        }
      } else if (genome.analysis && !!genome.analysis.core && genome.analysis.core.fp.reference === tree) {
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
    let hasAMR = false;
    let hasKleborateAMR = false;
    let hasVista = false;

    for (const genome of genomes) {
      if (!hasMetadata) {
        const { year, pmid, userDefined } = genome;
        if (year || pmid || (userDefined && Object.keys(userDefined).length)) {
          hasMetadata = true;
        }
      }

      if (!genome.analysis || isClusterView) continue;
      if (!hasAMR && genome.analysis.paarsnp) {
        hasAMR = true;
      }
      if (!hasKleborateAMR && genome.analysis.kleborate) {
        hasKleborateAMR = true;
      }
      if (!hasVista && genome.analysis.vista) {
        hasVista = true;
      }

      if (hasMetadata && (isClusterView || (hasAMR && hasKleborateAMR && hasVista))) {
        break;
      }
    }

    return {
      hasMetadata,
      hasAMR: isClusterView ? false : hasAMR,
      hasKleborateAMR: isClusterView ? false : hasKleborateAMR,
      hasVista: isClusterView ? false : hasVista,
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

export const hasKleborateAMR = createSelector(
  getGenomeDatatypes,
  datatypes => datatypes.hasKleborateAMR
);

export const hasVista = createSelector(
  getGenomeDatatypes,
  datatypes => datatypes.hasVista
);
