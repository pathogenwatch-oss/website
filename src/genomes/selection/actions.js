import React from 'react';

import { createAsyncConstants } from '../../actions';
import { fetchGenomeList } from '../actions';

import { getGenomeList, getGenomes, getListIndices } from '../selectors';
import { getVisible } from '../summary/selectors';
import { getSelectedGenomes, getSelectedGenomeIds } from './selectors';

import { showToast } from '../../toast';

import * as api from './api';

import { isOverSelectionLimit, getSelectionLimit } from './utils';

export const SELECT_GENOMES = 'SELECT_GENOMES';

export function selectGenomes(genomes, index) {
  return {
    type: SELECT_GENOMES,
    payload: { genomes, index },
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

export function toggleGenome(genome, index) {
  return (dispatch, getState) => {
    const state = getState();
    const selection = getSelectedGenomes(state);
    if (genome.id in selection) {
      dispatch(unselectGenomes([ genome ]));
    } else {
      dispatch(selectGenomes([ genome ], index));
    }
  };
}

export function toggleSelection(genomes) {
  return (dispatch, getState) => {
    const state = getState();
    const selection = getSelectedGenomes(state);
    if (genomes.every(genome => genome.id in selection)) {
      dispatch(unselectGenomes(genomes));
    } else {
      dispatch(selectGenomes(genomes));
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

export const SELECTION_FETCH_DOWNLOADS = createAsyncConstants('SELECTION_FETCH_DOWNLOADS');

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

export function selectRange(fromIndex, toIndex) {
  return (dispatch, getState) => {
    const state = getState();
    const genomes = getGenomes(state);
    const indices = getListIndices(state);

    const start = Math.min(fromIndex, toIndex);
    const stop = Math.max(fromIndex, toIndex);
    const size = stop - start + 1;

    const selection = [];
    for (let i = start; i <= stop; i++) {
      const id = indices[i];
      if (id in genomes) {
        selection.push(genomes[id]);
      }
    }

    if (selection.length === size) {
      dispatch(selectGenomes(selection));
    } else {
      if (isOverSelectionLimit(size)) {
        dispatch(showToast({
          message: (
            <span>
              You have selected the first {getSelectionLimit()} genomes in this range.
            </span>
          ),
        }));
      }
      dispatch(fetchGenomeList(start, Math.min(stop, start + getSelectionLimit() - 1)))
        .then(fetchedGenomes =>
          dispatch(selectGenomes(fetchedGenomes))
        );
    }
  };
}

export function selectAll() {
  return (dispatch, getState) => {
    const state = getState();
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

    dispatch(selectRange(start, total - 1));
  };
}
