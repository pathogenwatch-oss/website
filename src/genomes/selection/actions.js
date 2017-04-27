import { getGenomeList } from '../selectors';
import { getSelectedGenomes } from './selectors';

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

export const SET_GENOME_SELECTION = 'SET_GENOME_SELECTION';

export function setSelection(genomes) {
  return {
    type: SET_GENOME_SELECTION,
    payload: { genomes },
  };
}

export function toggleSelection(genome) {
  return (dispatch, getState) => {
    const state = getState();
    const selection = getSelectedGenomes(state);

    if (genome.id in selection) {
      dispatch(unselectGenomes([ genome ]));
    } else {
      dispatch(selectGenomes([ genome ]));
    }
  };
}

export function selectAll() {
  return (dispatch, getState) => {
    const state = getState();
    const genomes = getGenomeList(state);
    dispatch(selectGenomes(genomes));
  };
}
