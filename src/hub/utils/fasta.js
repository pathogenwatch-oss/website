const regexp = /^(?:[>;].+\n(?:[ACGTURYKMSWBDHVN]+\*?\n)+\n*)+$/i;

import CONFIG from '../../app/config';

export const fastaValidationErrors = {
  INVALID_FASTA_SIZE: 'INVALID_FASTA_SIZE',
  INVALID_FASTA_CONTENT: 'INVALID_FASTA_CONTENT',
  EMPTY_FILE: 'EMPTY_FILE',
};

const MAX_FASTA_FILE_SIZE = CONFIG.maxFastaFileSize * 1048576;

export function validateFastaSize(file) {
  return new Promise((resolve, reject) => {
    if (file.size === 0) {
      reject(fastaValidationErrors.EMPTY_FILE);
    } else if (file.size > MAX_FASTA_FILE_SIZE) {
      reject(fastaValidationErrors.INVALID_FASTA_SIZE);
    } else {
      resolve(file);
    }
  });
}

export function validateFastaContent(fastaContent) {
  if (regexp.test(fastaContent)) {
    return fastaContent;
  }
  throw fastaValidationErrors.INVALID_FASTA_CONTENT;
}
