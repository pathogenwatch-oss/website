import { tableKeys } from '../constants';

export function hasTyping({ noPopulation, noMLST, ngMast, genotyphi }) {
  if (noPopulation && noMLST && !ngMast && !genotyphi) return false;
  return true;
}

export function getInitialTable({ status }) {
  if (status !== 'READY') return null;
  return tableKeys.metadata;
}
