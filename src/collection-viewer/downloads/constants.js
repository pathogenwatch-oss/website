import * as clientSide from './client-side';

import Organisms from '../../organisms';

export const fileTypes = {
  metadata_csv: {
    description: 'Metadata',
    filenameSegment: 'metadata.csv',
    getFileContents: clientSide.generateMetadataFile,
    createLink: clientSide.createCSVLink,
    hideFromMenu({ hasMetadata }) {
      return !hasMetadata;
    },
  },
  typing_csv: {
    description: 'Typing',
    filenameSegment: 'typing.csv',
    getFileContents: clientSide.generateTypingFile,
    createLink: clientSide.createCSVLink,
    hideFromMenu({ hasTyping }) {
      return !hasTyping;
    },
  },
  stats_csv: {
    description: 'Stats',
    filenameSegment: 'stats.csv',
    getFileContents: clientSide.generateStatsFile,
    createLink: clientSide.createCSVLink,
  },
  amr_profile_csv: {
    description: 'AMR Profile',
    filenameSegment: 'amr-profile.csv',
    getFileContents: clientSide.generateAMRProfile,
    createLink: clientSide.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Organisms.current;
      return uiOptions.noAMR;
    },
  },
  amr_snps_csv: {
    description: 'AMR SNPs',
    filenameSegment: 'amr-snps.csv',
    getFileContents: clientSide.generateAMRSNPs,
    createLink: clientSide.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Organisms.current;
      return uiOptions.noAMR;
    },
  },
  amr_genes_csv: {
    description: 'AMR Genes',
    filenameSegment: 'amr-genes.csv',
    getFileContents: clientSide.generateAMRGenes,
    createLink: clientSide.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Organisms.current;
      return uiOptions.noAMR;
    },
  },
  concatenated_core_genes_collection: {
    description: 'Concatenated Core Genes',
    filenameSegment: 'concatenated-core-genes',
  },
  kernel_checksum_distribution: {
    description: 'Core Allele Distribution',
    filenameSegment: 'core-allele-distribution',
  },
  differences_matrix: {
    description: 'Difference Matrix',
    filenameSegment: 'difference-matrix',
  },
  score_matrix: {
    description: 'Score Matrix',
    filenameSegment: 'score-matrix',
  },
  variance_summary: {
    description: 'Variance Summary',
    filenameSegment: 'variance-summary',
    idType: 'collection',
  },
  wgsa_gff: {
    description: 'Annotations',
    filenameSegment: 'annotations',
    hideFromMenu: () => true,
  },
};
