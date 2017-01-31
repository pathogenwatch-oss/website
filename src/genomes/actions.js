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

export const ADD_FASTAS = 'ADD_FASTAS';

function addFastas(fastas) {
  return {
    type: ADD_FASTAS,
    payload: { fastas },
  };
}

export const UPLOAD_FASTA = createAsyncConstants('UPLOAD_FASTA');

export const UPDATE_FASTA_PROGRESS = 'UPDATE_FASTA_PROGRESS';

function updateFastaProgress(name, progress) {
  return {
    type: UPDATE_FASTA_PROGRESS,
    payload: {
      name,
      progress,
    },
  };
}

export const REMOVE_FASTA = 'REMOVE_FASTA';

function removeFasta(name) {
  return {
    type: REMOVE_FASTA,
    payload: { name },
  };
}

export const UNDO_REMOVE_FASTA = 'UNDO_REMOVE_FASTA';

function undoRemoveFasta(fasta) {
  return {
    type: UNDO_REMOVE_FASTA,
    payload: { fasta },
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
  addFastas,
  updateFastaProgress,
  removeFasta,
  undoRemoveFasta,
  showMetric,
};
