import { REQUEST_DOWNLOAD } from '../actions/downloads';
import ToastActionCreators from '../actions/ToastActionCreators';

import {
  generateMetadataFile, generateAMRProfile, createCSVLink, createDefaultLink,
} from '../utils/download';

import { createDownloadKey } from '../constants/downloads';

const initialState = {
  metadata_csv: {
    description: 'Metadata',
    filename: 'metadata.csv',
    getFileContents: generateMetadataFile,
    createLink: createCSVLink,
  },
  amr_profile_collection: {
    description: 'AMR Profile',
    filename: 'amr_profile.csv',
    getFileContents: generateAMRProfile,
    createLink: createCSVLink,
  },
  concatenated_core_genes_collection: {
    description: 'Concatenated Core Genes',
    filename: 'concatenated_core_genes',
  },
  kernel_checksum_distribution: {
    description: 'Core Allele Distribution',
    filename: 'core_allele_distribution',
  },
  differences_matrix: {
    description: 'Difference Matrix',
    filename: 'difference_matrix',
  },
  score_matrix: {
    description: 'Score Matrix',
    filename: 'score_matrix',
  },
  fasta: {
    description: 'Assembly',
    filename: 'fasta',
    notMenu: true,
  },
  wgsa_gff: {
    description: 'Annotations',
    filename: 'annotations',
    notMenu: true,
  },
};

const actions = {
  [REQUEST_DOWNLOAD](state, action) {
    const { format, idList, filename, ready, result, error } = action;

    const downloadState = state[format];

    if (!downloadState) {
      return state;
    }

    const {
      linksById = {},
      createLink = createDefaultLink,
    } = downloadState;

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
        ...downloadState,
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
