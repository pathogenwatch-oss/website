import { createAsyncConstants } from '../actions';

import * as api from './api';

export const FETCH_SUMMARY = createAsyncConstants('FETCH_SUMMARY');

export function fetchSummary() {
  return {
    type: FETCH_SUMMARY,
    payload: {
      promise: api.fetchSummary(),
    },
  };
}

export const FETCH_GENOMES = createAsyncConstants('FETCH_GENOMES');

export function fetchGenomes() {
  return {
    type: FETCH_GENOMES,
    payload: {
      promise: api.fetchGenomes(),
    },
  };
}

export const ADD_GENOMES = 'ADD_GENOMES';

function addGenomes(genomes) {
  return {
    type: ADD_GENOMES,
    payload: { genomes },
  };
}

export const UPLOAD_GENOME = createAsyncConstants('UPLOAD_GENOME');

export const UPDATE_GENOME_PROGRESS = 'UPDATE_GENOME_PROGRESS';

function updateGenomeProgress(id, progress) {
  return {
    type: UPDATE_GENOME_PROGRESS,
    payload: {
      id,
      progress,
    },
  };
}

export const REMOVE_GENOME = 'REMOVE_GENOME';

function removeGenome(id) {
  return {
    type: REMOVE_GENOME,
    payload: { id },
  };
}

export const UNDO_REMOVE_GENOME = 'UNDO_REMOVE_GENOME';

function undoRemoveGenome(id) {
  return {
    type: UNDO_REMOVE_GENOME,
    payload: { id },
  };
}

export const SHOW_METRIC = 'SHOW_METRIC';

function showMetric(metric) {
  return {
    type: SHOW_METRIC,
    payload: { metric },
  };
}

export default {
  addGenomes,
  updateGenomeProgress,
  removeGenome,
  undoRemoveGenome,
  showMetric,
};
