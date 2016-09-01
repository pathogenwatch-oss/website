import { REQUEST_DOWNLOAD } from '../actions/downloads';
import ToastActionCreators from '../actions/ToastActionCreators';

import {
  generateMetadataFile, generateAMRProfile, createCSVLink, createDefaultLink,
} from '../utils/downloads';

import { createDownloadKey } from '../constants/downloads';

import Species from '^/species';

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
    hideFromMenu() {
      const { uiOptions = {} } = Species.current;
      return uiOptions.noAMR;
    },
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
    hideFromMenu: () => true,
  },
  wgsa_gff: {
    description: 'Annotations',
    filename: 'annotations',
    hideFromMenu: () => true,
  },
};

function updateDownloads(state, payload, newStateForKey) {
  const { format, idList } = payload;

  const { linksById = {}, ...downloadState } = state[format];
  const downloadKey = createDownloadKey(idList);

  return {
    ...state,
    [format]: {
      ...downloadState,
      linksById: {
        ...linksById,
        [downloadKey]: newStateForKey,
      },
    },
  };
}

const actions = {
  [REQUEST_DOWNLOAD.ATTEMPT](state, payload) {
    return updateDownloads(state, payload, { loading: true });
  },
  [REQUEST_DOWNLOAD.FAILURE](state, payload) {
    ToastActionCreators.showToast({
      message: 'Failed to generate download, please try again later.',
    });

    return updateDownloads(state, payload, { error: true });
  },
  [REQUEST_DOWNLOAD.SUCCESS](state, payload) {
    const { format, filename, result } = payload;
    const { createLink = createDefaultLink } = state[format];

    const link = createLink(result, filename);
    return updateDownloads(state, payload, { link, filename });
  },
};

export default { initialState, actions };
