import { tableKeys } from '../constants';

import Organisms from '../../organisms';

export function hasMetadata(genomes) {
  return (
    genomes.some(({ date, pmid, userDefined }) => !!(
      (date && date.year) ||
      pmid ||
      (userDefined && Object.keys(userDefined).length)
    ))
  );
}

export function hasTyping({ noPopulation, noMLST, ngMast, genotyphi }) {
  if (noPopulation && noMLST && !ngMast && !genotyphi) return false;
  return true;
}

export function getInitialTable({ status, genomes }) {
  if (status !== 'READY') return null;
  if (hasMetadata(genomes)) return tableKeys.metadata;
  if (hasTyping(Organisms.uiOptions)) return tableKeys.typing;
  return tableKeys.stats;
}
