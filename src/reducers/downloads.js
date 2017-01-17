import { REQUEST_DOWNLOAD } from '../actions/downloads';

import * as downloads from '../utils/downloads';
import { createFastaArchiveLink } from '../fasta-download';

import { createDownloadKey } from '../constants/downloads';

import Species from '../species';

const initialState = {
  metadata_csv: {
    description: 'Metadata',
    filenameSegment: 'metadata.csv',
    getFileContents: downloads.generateMetadataFile,
    createLink: downloads.createCSVLink,
  },
  typing_csv: {
    description: 'Typing',
    filenameSegment: 'typing.csv',
    getFileContents: downloads.generateTypingFile,
    createLink: downloads.createCSVLink,
  },
  stats_csv: {
    description: 'Stats',
    filenameSegment: 'stats.csv',
    getFileContents: downloads.generateStatsFile,
    createLink: downloads.createCSVLink,
  },
  amr_profile_csv: {
    description: 'AMR Profile',
    filenameSegment: 'amr_profile.csv',
    getFileContents: downloads.generateAMRProfile,
    createLink: downloads.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Species.current;
      return uiOptions.noAMR;
    },
  },
  amr_snps_csv: {
    description: 'AMR SNPs',
    filenameSegment: 'amr_snps.csv',
    getFileContents: downloads.generateAMRSNPs,
    createLink: downloads.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Species.current;
      return uiOptions.noAMR;
    },
  },
  amr_genes_csv: {
    description: 'AMR Genes',
    filenameSegment: 'amr_genes.csv',
    getFileContents: downloads.generateAMRGenes,
    createLink: downloads.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Species.current;
      return uiOptions.noAMR;
    },
  },
  concatenated_core_genes_collection: {
    description: 'Concatenated Core Genes',
    filenameSegment: 'concatenated_core_genes',
  },
  kernel_checksum_distribution: {
    description: 'Core Allele Distribution',
    filenameSegment: 'core_allele_distribution',
  },
  differences_matrix: {
    description: 'Difference Matrix',
    filenameSegment: 'difference_matrix',
  },
  score_matrix: {
    description: 'Score Matrix',
    filenameSegment: 'score_matrix',
  },
  fasta_archive: {
    createLink: createFastaArchiveLink,
    filenameSegment: 'fastas',
    hideFromMenu: () => true,
  },
  wgsa_gff: {
    description: 'Annotations',
    filenameSegment: 'annotations',
    hideFromMenu: () => true,
  },
};

function updateDownloads(state, payload, newStateForKey) {
  const { format, id } = payload;

  const { linksById = {}, ...downloadState } = state[format];
  const downloadKey = createDownloadKey(id);

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
