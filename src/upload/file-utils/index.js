import config from '~/app/config';

import { ASSEMBLY_FILE_EXTENSIONS } from '~/app/constants';

const READS_FILE_EXTENSION = '.fastq.gz';

export function isReadsEligible() {
  return 'assemblerAddress' in config;
}

export function getGenomeAccepts(reads = isReadsEligible()) {
  let accepts = ASSEMBLY_FILE_EXTENSIONS;

  if (reads) {
    accepts = ASSEMBLY_FILE_EXTENSIONS.concat(READS_FILE_EXTENSION);
  }

  return accepts.join(',');
}

export function getUploadAccepts(reads = isReadsEligible()) {
  return `${getGenomeAccepts(reads)},.csv`;
}

export {
  default as mapCSVsToGenomes,
} from './mapCSVsToGenomes';
