import React from 'react';

import { getGenomeList } from '../selectors';
import { getSelectedGenomes, getSelectionSize } from './selectors';

import { showToast } from '../../toast';

import { isOverSelectionLimit, getSelectionLimit } from './utils';

export const SELECT_GENOMES = 'SELECT_GENOMES';

export function selectGenomes(genomes, focus = false) {
  return {
    type: SELECT_GENOMES,
    payload: { genomes, focus },
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

export const CLEAR_GENOME_SELECTION = 'CLEAR_GENOME_SELECTION';

export function clearSelection() {
  return {
    type: CLEAR_GENOME_SELECTION,
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

export function selectAll(focus) {
  return (dispatch, getState) => {
    const state = getState();
    const selectionSize = getSelectionSize(state);
    const genomes = getGenomeList(state);
    const selection = getSelectedGenomes(state);
    const toBeSelected = genomes.filter(({ id }) => !(id in selection));

    if (isOverSelectionLimit(toBeSelected.length + selectionSize)) {
      dispatch(showToast({
        message: (
          <span>
            Selection limit is <strong>{getSelectionLimit()}</strong>, please refine your selection.
          </span>
        ),
      }));
    } else {
      dispatch(selectGenomes(toBeSelected, focus));
    }
  };
}

export function unselectAll(focus) {
  return (dispatch, getState) => {
    const state = getState();
    const genomes = getGenomeList(state);
    dispatch(unselectGenomes(genomes, focus));
  };
}

export const SELECTION_DROPDOWN_OPENED = 'SELECTION_DROPDOWN_OPENED';

export function toggleDropdown(view = null) {
  return {
    type: SELECTION_DROPDOWN_OPENED,
    payload: view,
  };
}
