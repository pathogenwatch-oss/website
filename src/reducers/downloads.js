import { REQUEST_DOWNLOAD } from '../actions/downloads';
import ToastActionCreators from '../actions/ToastActionCreators';

import { createDownloadKey } from '../constants/downloads';
import { API_ROOT } from '../utils/Api';

import Species from '../species';

const initialState = {
  concatenated_core_genes_collection: {
    description: 'Concatenated Core Genes (.fa)',
    filename: 'concatenated_core_genes',
  },
  kernel_checksum_distribution: {
    description: 'Core Checksum Distribution (.csv)',
    filename: 'core_checksum_distribution',
  },
  amr_profile_collection: {
    description: 'AMR Profile (.csv)',
    filename: 'amr_profile',
  },
  score_matrix: {
    description: 'Score Matrix (.csv)',
    filename: 'score_matrix',
    ignoresFilter: true,
  },
  differences_matrix: {
    description: 'Difference Matrix (.csv)',
    filename: 'differences_matrix',
    ignoresFilter: true,
  },
  fasta: {
    description: 'Assembly (.fa)',
    filename: 'fasta',
    notMenu: true,
  },
  wgsa_gff: {
    description: 'WGSA Results (.gff)',
    filename: 'annotations',
    notMenu: true,
  },
};

function createLink(keyMap, filename) {
  const key = Object.keys(keyMap)[0];

  if (!key) {
    return {};
  }

  return (
    `${API_ROOT}/species/${Species.id}/download/file/${encodeURIComponent(key)}?` +
        `prettyFileName=${encodeURIComponent(filename)}`
  );
}

const actions = {
  [REQUEST_DOWNLOAD]: function (state, action) {
    const { format, idList, filename, ready, result, error } = action;

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

    const link = ready && !error ? createLink(result, filename) : null;

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
