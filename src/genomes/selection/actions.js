import { getGenomeList } from '../selectors';

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

export const TOGGLE_SELECTED_GENOMES = 'TOGGLE_SELECTED_GENOMES';

export function toggleSelectedGenomes(genomes) {
  return {
    type: TOGGLE_SELECTED_GENOMES,
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

export function selectAll() {
  return (dispatch, getState) => {
    const state = getState();
    const genomes = getGenomeList(state);
    dispatch(selectGenomes(genomes));
  };
}
