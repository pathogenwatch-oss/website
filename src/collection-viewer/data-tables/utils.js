import { tableKeys } from '../constants';

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

export function getInitialTable({ status }) {
  if (status !== 'READY') return null;
  return tableKeys.metadata;
}
