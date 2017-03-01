export const SELECT_GENOMES = 'SELECT_GENOMES';

export function selectGenomes(genomes) {
  return {
    type: SELECT_GENOMES,
    payload: { genomes },
  };
}

export const UNSELECT_GENOMES = 'UNSELECT_GENOMES';

export function unselectGenomes(genomes) {
  return {
    type: UNSELECT_GENOMES,
    payload: { genomes },
  };
}
