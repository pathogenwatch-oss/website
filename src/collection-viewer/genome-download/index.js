import { SERVER_ADDRESS } from '../../utils/Api';

export GenomeArchiveButton from './GenomeArchiveButton.react';

export function createGenomeArchiveLink({ fileId }, filename) {
  return `${SERVER_ADDRESS}/download/genome-archive/${fileId}?filename=${filename}`;
}
