import { createAsyncConstants } from '../actions';

import * as api from './api';

export const FETCH_GENOME_SUMMARY = createAsyncConstants('FETCH_GENOME_SUMMARY');

export function fetchSummary(filter) {
  return {
    type: FETCH_GENOME_SUMMARY,
    payload: {
      promise: api.fetchSummary(filter),
    },
  };
}

export const FETCH_GENOMES = createAsyncConstants('FETCH_GENOMES');

export function fetchGenomes(filter) {
  return {
    type: FETCH_GENOMES,
    payload: {
      promise: api.fetchGenomes(filter),
    },
  };
}

export const MOVE_TO_BIN = 'MOVE_TO_BIN';

export function moveToBin(id) {
  return {
    type: MOVE_TO_BIN,
    payload: { id },
  };
}

export const UNDO_MOVE_TO_BIN = 'UNDO_MOVE_TO_BIN';

export function undoMoveToBin(id) {
  return {
    type: UNDO_MOVE_TO_BIN,
    payload: { id },
  };
}
