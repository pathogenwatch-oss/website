import { createAsyncConstants } from '../actions';
import { showToast } from '../toast';
import { fetchJson } from '../utils/Api';

export const REQUEST_DOWNLOAD = createAsyncConstants('REQUEST_DOWNLOAD');

export function requestDownload(format, stateKey, promise) {
  return dispatch =>
    dispatch({
      type: REQUEST_DOWNLOAD,
      payload: {
        format,
        stateKey,
        promise,
      },
    })
    .catch(() => dispatch(showToast({
      message: 'Failed to generate download, please try again later.',
    })));
}

export function downloadGenomeArchive({ ids, type = 'genome' }) {
  return requestDownload(
    'genome_archive',
    JSON.stringify(ids),
    fetchJson('PUT', '/download/genome-archive', { ids, type }),
  );
}
