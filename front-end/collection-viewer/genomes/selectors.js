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
    let hasKleborateAMRGenotypes = false;
    let hasSarsCov2Variants = false;
    let hasVista = false;

    for (const genome of genomes) {
      if (!hasMetadata) {
        const { year, pmid, userDefined } = genome;
        if (year || pmid || (userDefined && Object.keys(userDefined).length)) {
          hasMetadata = true;
        }
      }

      if (!genome.analysis) continue;

      if (!hasAMR && !hasKleborateAMRGenotypes && !hasKleborateAMR && genome.analysis.kleborate) {
        hasKleborateAMR = true;
        hasKleborateAMRGenotypes = true;
        hasAMR = true;
      }

      if (!hasSarsCov2Variants && genome.analysis.sarsCov2Variants) {
        hasSarsCov2Variants = true;
      }

      if (!hasVista && genome.analysis.vista) {
        hasVista = true;
      }

      if (!isClusterView && !hasAMR && genome.analysis.paarsnp) {
        hasAMR = true;
      }

      if (hasMetadata && hasKleborateAMR && hasKleborateAMRGenotypes && hasVista && hasSarsCov2Variants && (isClusterView || (hasAMR))) {
        break;
      }
    }

    return {
      hasMetadata,
      hasAMR,
      hasKleborateAMR,
      hasKleborateAMRGenotypes,
      hasSarsCov2Variants,
      hasVista,
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

export const hasKleborateAMRGenotypes = createSelector(
  getGenomeDatatypes,
  datatypes => datatypes.hasKleborateAMRGenotypes
);

export const hasSarsCov2Variants = createSelector(
  getGenomeDatatypes,
  datatypes => datatypes.hasSarsCov2Variants
)
export const hasVista = createSelector(
  getGenomeDatatypes,
  datatypes => datatypes.hasVista
);
