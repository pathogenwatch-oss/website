import { SERVER_ADDRESS } from '../../utils/Api';

export FastaFileLink from './FastaFileLink.react';
export FastaArchiveButton from './FastaArchiveButton.react';

export function createFastaArchiveLink({ fileId }, filename) {
  return `${SERVER_ADDRESS}/download/genome-archive/${fileId}?filename=${filename}`;
}
