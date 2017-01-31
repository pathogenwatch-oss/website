import { createAsyncConstants } from '../actions';

import * as api from './api';

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

function updateGenomeProgress(name, progress) {
  return {
    type: UPDATE_GENOME_PROGRESS,
    payload: {
      name,
      progress,
    },
  };
}

export const REMOVE_GENOME = 'REMOVE_GENOME';

function removeGenome(name) {
  return {
    type: REMOVE_GENOME,
    payload: { name },
  };
}

export const UNDO_REMOVE_GENOME = 'UNDO_REMOVE_GENOME';

function undoRemoveGenome(genome) {
  return {
    type: UNDO_REMOVE_GENOME,
    payload: { genome },
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
