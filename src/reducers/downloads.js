import { REQUEST_DOWNLOAD } from '../actions/downloads';
import ToastActionCreators from '../actions/ToastActionCreators';

import { createDownloadKey } from '../constants/downloads';

const initialState = {
  kernel_checksum_distribution: {
    description: 'Kernel Checksum Distribution',
    collection: true,
  },
  extended_kernel_fasta: {
    description: 'Kernel Matches',
  },
  kernel_fasta: {
    description: 'Kernel Sequence (.fa)',
  },
  kernel_sequences: {
    description: 'Kernel Sequence (.csv)',
  },
  score_matrix: {
    description: 'Score Matrix',
    collection: true,
  },
  differences_matrix: {
    description: 'Differences Matrix',
    collection: true,
  },
};

function createLink(keyToFilenameMap) {
  const key = Object.keys(keyToFilenameMap)[0];
  if (!key) {
    return '';
  }
  return `/api/download/file/${encodeURIComponent(key)}?` +
    `prettyFileName=${encodeURIComponent(keyToFilenameMap[key])}`;
}

const actions = {
  [REQUEST_DOWNLOAD]: function (state, action) {
    const { format, idList, ready, result, error } = action;

    if (!state[format]) {
      return state;
    }

    const { linksById = {}, ...download } = state[format];
    const downloadKey = createDownloadKey(idList);

    if (error) {
      ToastActionCreators.showToast({
        message: 'Failed to generate download, please try again later.',
      });
    }

    return {
      ...state,
      [format]: {
        ...download,
        linksById: {
          ...linksById,
          [downloadKey]: {
            loading: !ready,
            error: ready && typeof error !== undefined,
            link: ready && !error ? createLink(result) : null,
          },
        },
      },
    };
  },
};

export default { initialState, actions };
