import { createAsyncConstants } from '../actions';

import { fetch } from './api';
import { getOfflineList } from '../offline/utils';

export const FETCH_SUMMARY = createAsyncConstants('FETCH_SUMMARY');

export function fetchSummary() {
  return {
    type: FETCH_SUMMARY,
    payload: {
      promise: Promise.all([
        fetch(),
        getOfflineList(),
      ])
      .then(
        ([ summary, collections ]) => ({
          ...summary,
          offlineCollections: collections.length,
        })
      ),
    },
  };
}
