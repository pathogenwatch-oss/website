import { REQUEST_DOWNLOAD } from '../actions/downloads';
import ToastActionCreators from '../actions/ToastActionCreators';

import { createDownloadKey } from '../constants/downloads';
import { API_ROOT } from '../utils/Api';

import Species from '../species';

const initialState = {
  amr_profile_collection: {
    description: 'AMR Profile (.csv)',
    filename: 'amr_profile',
  },
  concatenated_core_genes_collection: {
    description: 'Concatenated Core Genes (.fa)',
    filename: 'concatenated_core_genes',
  },
  kernel_checksum_distribution: {
    description: 'Core Allele Distribution (.csv)',
    filename: 'core_allele_distribution',
  },
  differences_matrix: {
    description: 'Difference Matrix (.csv)',
    filename: 'difference_matrix',
  },
  score_matrix: {
    description: 'Score Matrix (.csv)',
    filename: 'score_matrix',
  },
  fasta: {
    description: 'Assembly (.fa)',
    filename: 'fasta',
    notMenu: true,
  },
  wgsa_gff: {
    description: 'Annotations (.gff)',
    filename: 'annotations',
    notMenu: true,
  },
};

function createLink(keyMap, filename) {
  const key = Object.keys(keyMap)[0];

  if (!key) {
    return null;
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
