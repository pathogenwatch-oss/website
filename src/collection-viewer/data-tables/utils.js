import { tableKeys } from '../constants';

import Species from '../../species';

// TODO: Might be good if `date` and `userDefined` were null
export function hasMetadata(genomes) {
  return (
    genomes.some(({ date = {}, pmid, userDefined = {} }) =>
      !!(date.year || pmid || Object.keys(userDefined).length)
    )
  );
}

export function hasTyping({ noPopulation, noMLST, ngMast, genotyphi }) {
  if (noPopulation && noMLST && !ngMast && !genotyphi) return false;
  return true;
}

export function getInitialTable({ genomes }) {
  if (hasMetadata(genomes)) return tableKeys.metadata;
  if (hasTyping(Species.uiOptions)) return tableKeys.typing;
  return tableKeys.stats;
}
