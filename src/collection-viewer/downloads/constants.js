import * as clientSide from './client-side';

import { createGenomeArchiveLink } from '../genome-download';

import Species from '../../species';

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
    filenameSegment: 'amr_profile.csv',
    getFileContents: clientSide.generateAMRProfile,
    createLink: clientSide.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Species.current;
      return uiOptions.noAMR;
    },
  },
  amr_snps_csv: {
    description: 'AMR SNPs',
    filenameSegment: 'amr_snps.csv',
    getFileContents: clientSide.generateAMRSNPs,
    createLink: clientSide.createCSVLink,
    hideFromMenu() {
      const { uiOptions = {} } = Species.current;
      return uiOptions.noAMR;
    },
  },
  amr_genes_csv: {
    description: 'AMR Genes',
    filenameSegment: 'amr_genes.csv',
    getFileContents: clientSide.generateAMRGenes,
    createLink: clientSide.createCSVLink,
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
  genome_archive: {
    createLink: createGenomeArchiveLink,
    filenameSegment: 'genomes',
    hideFromMenu: () => true,
  },
  wgsa_gff: {
    description: 'Annotations',
    filenameSegment: 'annotations',
    hideFromMenu: () => true,
  },
};
