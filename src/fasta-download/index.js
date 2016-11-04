import { API_ROOT } from '../utils/Api';

export FastaFileLink from './FastaFileLink.react';
export FastaArchiveButton from './FastaArchiveButton.react';

export function createFastaArchiveLink({ fileId }, filename) {
  return `${API_ROOT}/download/fasta-archive/${fileId}?filename=${filename}`;
}
