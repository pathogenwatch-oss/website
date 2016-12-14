import * as clientSide from './client-side';

import { createFastaArchiveLink } from '../fasta-download';

import Species from '../../species';

export const fileTypes = {
  metadata_csv: {
    description: 'Metadata',
    filenameSegment: 'metadata.csv',
    getFileContents: clientSide.generateMetadataFile,
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
  amr_mechanisms_csv: {
    description: 'AMR Mechanisms',
    filenameSegment: 'amr_mechansisms.csv',
    getFileContents: clientSide.generateAMRMechanisms,
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
