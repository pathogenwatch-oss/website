import { REQUEST_DOWNLOAD } from '../actions/downloads';
import ToastActionCreators from '../actions/ToastActionCreators';

import {
  createDownloadKey,
  collectionPath,
  encode,
} from '../constants/downloads';

const initialState = {
  amr_profile_collection: {
    description: 'AMR Profile (CSV)',
    filename: 'amr_profile',
  },
  concatenated_core_genes_collection: {
    description: 'Concatenated Core Genes (FASTA)',
    filename: 'concatenated_core_genes',
  },
  kernel_checksum_distribution: {
    description: 'Core Allele Distribution (CSV)',
    filename: 'core_allele_distribution',
  },
  differences_matrix: {
    description: 'Difference Matrix (CSV)',
    filename: 'difference_matrix',
  },
  score_matrix: {
    description: 'Score Matrix (CSV)',
    filename: 'score_matrix',
  },
  fasta: {
    description: 'Assembly (FASTA)',
    filename: 'fasta',
    notMenu: true,
  },
  wgsa_gff: {
    description: 'Annotations (GFF)',
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
    `${collectionPath()}/${encode(key)}?prettyFileName=${encode(filename)}`
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
