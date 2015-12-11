import { REQUEST_DOWNLOAD } from '../actions/downloads';
import ToastActionCreators from '../actions/ToastActionCreators';

import { createDownloadKey } from '../constants/downloads';
import { API_ROOT } from '../utils/Api';

const initialState = {
  extended_kernel_fasta: {
    description: 'Core Matches (.fa)',
  },
  concatenated_core_genes_collection: {
    description: 'Concatenated Core Genes (.fa)',
  },
  kernel_checksum_distribution: {
    description: 'Core Checksum Distribution (.csv)',
  },
  amr_profile_collection: {
    description: 'AMR profile (.csv)',
  },
  score_matrix: {
    description: 'Score Matrix (.csv)',
    collection: true,
  },
  differences_matrix: {
    description: 'Differences Matrix (.csv)',
    collection: true,
  },
};

function parseResult(keyToFilenameMap) {
  const key = Object.keys(keyToFilenameMap)[0];
  const filename = keyToFilenameMap[key];

  if (!key) {
    return {};
  }

  return {
    link: `${API_ROOT}/download/file/${encodeURIComponent(key)}?` +
      `prettyFileName=${encodeURIComponent(filename)}`,
    filename,
  };
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

    const { link, filename } = ready && !error ? parseResult(result) : {};

    return {
      ...state,
      [format]: {
        ...download,
        linksById: {
          ...linksById,
          [downloadKey]: {
            loading: !ready,
            error: ready && typeof error !== undefined,
            link,
            filename,
          },
        },
      },
    };
  },
};

export default { initialState, actions };
