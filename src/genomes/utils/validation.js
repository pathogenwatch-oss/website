import CONFIG from '../../app/config';

export const genomeValidationErrors = {
  INVALID_GENOME_SIZE: 'INVALID_GENOME_SIZE',
  INVALID_GENOME_CONTENT: 'INVALID_GENOME_CONTENT',
  EMPTY_FILE: 'EMPTY_FILE',
};

export const genomeValidationErrorSet =
  new Set(Object.keys(genomeValidationErrors));

const MAX_GENOME_FILE_SIZE = CONFIG.maxGenomeFileSize * 1048576;

export function validateGenomeSize(file) {
  return new Promise((resolve, reject) => {
    if (file.size === 0) {
      reject(genomeValidationErrors.EMPTY_FILE);
    } else if (file.size > MAX_GENOME_FILE_SIZE) {
      reject(genomeValidationErrors.INVALID_GENOME_SIZE);
    } else {
      resolve(file);
    }
  });
}

const regexp = /^([^\n]+\n)(?:[ACGTURYKMSWBDHVN]+\n?)*$/i;

export function validateGenomeContent(genomeContent) {
  const cleanContent = genomeContent.replace(/\r/g, '');
  if (cleanContent.split(/\n>/).every((contig) => regexp.test(contig))) {
    return cleanContent;
  }
  throw genomeValidationErrors.INVALID_GENOME_CONTENT;
}

export function isFailedUpload({ error }) {
  return error && !genomeValidationErrorSet.has(error);
}
