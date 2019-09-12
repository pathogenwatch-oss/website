import { createSelector } from 'reselect';

import { getUnfilteredGenomeIds } from '../filter/selectors';
import { getColourGetter, getLabelGetter } from '../table/selectors';
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

function getShape(genome) {
  if (genome.reference) return 'triangle';
  if (genome.public) return 'square';
  return 'circle';
}

export const getGenomeStyles = createSelector(
  getGenomeList,
  getLabelGetter,
  getColourGetter,
  (genomes, getLabel, getColour) => {
    const styles = {};
    for (const genome of genomes) {
      styles[genome.id] = {
        colour: getColour(genome),
        label: getLabel(genome),
        shape: getShape(genome),
      };
    }
    return styles;
  }
);
