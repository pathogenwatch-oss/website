import { REQUEST_DOWNLOAD } from '../actions/downloads';

import * as downloads from '../utils/downloads';

import { createDownloadKey } from '../constants/downloads';

import Species from '^/species';

const initialState = {
  metadata_csv: {
    description: 'Metadata',
    filename: 'metadata.csv',
    getFileContents: downloads.generateMetadataFile,
    createLink: downloads.createCSVLink,
  },
  amr_profile_csv: {
    description: 'AMR Profile',
    filename: 'amr_profile.csv',
    getFileContents: downloads.generateAMRProfile,
    createLink: downloads.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Species.current;
      return uiOptions.noAMR;
    },
  },
  amr_mechanisms_csv: {
    description: 'AMR Mechanisms',
    filename: 'amr_mechansisms.csv',
    getFileContents: downloads.generateAMRMechanisms,
    createLink: downloads.createCSVLink,
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
    return updateDownloads(state, payload, { error: true });
  },
  [REQUEST_DOWNLOAD.SUCCESS](state, payload) {
    const { format, filename, result } = payload;
    const { createLink = downloads.createDefaultLink } = state[format];

    const link = createLink(result, filename);
    return updateDownloads(state, payload, { link, filename });
  },
};

export default { initialState, actions };
