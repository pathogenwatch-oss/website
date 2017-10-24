import { createAsyncConstants } from '../actions';

import { fetchGenome } from './api';

export const SHOW_GENOME_DETAILS = createAsyncConstants('SHOW_GENOME_DETAILS');

export function showGenomeDrawer(id, name) {
  return {
    type: SHOW_GENOME_DETAILS,
    payload: {
      name,
      promise: fetchGenome(id),
    },
  };
}

export const CLOSE_DRAWER = 'CLOSE_DRAWER';

export function closeDrawer() {
  return {
    type: CLOSE_DRAWER,
  };
}
