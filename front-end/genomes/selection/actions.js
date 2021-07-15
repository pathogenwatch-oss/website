import { createAsyncConstants } from '../../actions';
import { fetchGenomeList, fetchGenomeSelection } from '../actions';

import { getGenomeList, getGenomes, getListIndices } from '../selectors';
import { getVisible } from '../summary/selectors';
import {
  getSelectedGenomes,
  getSelectedGenomeIds,
  getSelectionStatus,
} from './selectors';
import {
  setStoredSelection,
  addToStoredSelection,
  removeFromStoredSelection,
} from './utils';

import * as api from './api';

export const SELECTION_DROPDOWN_OPENED = 'SELECTION_DROPDOWN_OPENED';

export function toggleDropdown(view = null) {
  return {
    type: SELECTION_DROPDOWN_OPENED,
    payload: view,
  };
}

export const SELECTION_FETCH_DOWNLOADS = createAsyncConstants(
  'SELECTION_FETCH_DOWNLOADS'
);

export function fetchDownloads() {
  return (dispatch, getState) => {
    const ids = getSelectedGenomeIds(getState());
    dispatch({
      type: SELECTION_FETCH_DOWNLOADS,
      payload: {
        promise: api.fetchDownloads(ids),
      },
    });
  };
}

export const SET_GENOME_SELECTION = 'SET_GENOME_SELECTION';

export function setSelection(genomes) {
  setStoredSelection(genomes);
  return {
    type: SET_GENOME_SELECTION,
    payload: { genomes },
  };
}

export const CLEAR_GENOME_SELECTION = 'CLEAR_GENOME_SELECTION';

export function clearSelection() {
  setStoredSelection();
  return {
    type: CLEAR_GENOME_SELECTION,
  };
}

export const APPEND_GENOME_SELECTION = 'APPEND_GENOME_SELECTION';

export function appendToSelection(genomes, index) {
  addToStoredSelection(genomes);
  return {
    type: APPEND_GENOME_SELECTION,
    payload: { genomes, index },
  };
}

export const REMOVE_GENOME_SELECTION = 'REMOVE_GENOME_SELECTION';

export function removeFromSelection(genomes) {
  removeFromStoredSelection(genomes);
  return {
    type: REMOVE_GENOME_SELECTION,
    payload: { genomes },
  };
}

export function toggleSelection(genomes, index) {
  return (dispatch, getState) => {
    const state = getState();
    const selection = getSelectedGenomes(state);
    if (genomes.every(genome => genome.id in selection)) {
      dispatch(removeFromSelection(genomes));
    } else {
      dispatch(appendToSelection(genomes, index));
    }
  };
}

function localUpdate(state, start, stop) {

  const genomes = getGenomes(state);
  const indices = getListIndices(state);

  const selection = [];
  for (let i = start; i <= stop; i++) {
    const id = indices[i];
    if (id in genomes) {
      selection.push(genomes[id]);
    }
  }
  return selection;
}


export function selectRange(fromIndex, toIndex) {
  return (dispatch, getState) => {

    const state = getState();
    const start = Math.min(fromIndex, toIndex);
    const stop = Math.max(fromIndex, toIndex);
    const size = stop - start + 1;

    const selection = localUpdate(state, start, stop);

    if (selection.length === size) {
      dispatch(appendToSelection(selection));
      return Promise.resolve();
    }
    return dispatch(fetchGenomeList(start, stop)).then((fetchedGenomes) =>
      dispatch(appendToSelection(fetchedGenomes))
    );
  };
}

export function selectAll() {
  return (dispatch, getState) => {
    const state = getState();
    const selectionStatus = getSelectionStatus(state);

    if (selectionStatus === 'CHECKED') {
      const genomes = getGenomeList(state);
      dispatch(removeFromSelection(genomes));
      return Promise.resolve();
    }
    const total = getVisible(state);
    const selection = getSelectedGenomes(state);
    const indices = getListIndices(state);

    let start = 0;
    for (let i = 0; i < total; i++) {
      const id = indices[i];
      if (!(id in selection)) {
        start = i;
        break;
      }
    }

    const stop = total - 1;
    const size = stop - start + 1;
    const newSelection = localUpdate(state, start, stop);

    if (newSelection.length === size) {
      dispatch(appendToSelection(newSelection));
      return Promise.resolve();
    }
    return dispatch(fetchGenomeSelection(start, 0)).then((fetchedGenomes) =>
      dispatch(appendToSelection(fetchedGenomes))
    );


  };
}
