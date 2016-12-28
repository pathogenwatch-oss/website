import React from 'react';

import DownloadIcon from '../collection-viewer/downloads/DownloadIcon.react';

import { FASTA_FILE_EXTENSIONS } from '../hub/utils';
import { API_ROOT } from '../utils/Api';
import { CGPS } from '../app/constants';

function formatFastaFilename(assemblyName) {
  for (const ext in FASTA_FILE_EXTENSIONS) {
    if (assemblyName.indexOf(ext) !== -1) {
      return assemblyName;
    }
  }
  return `${assemblyName}.fasta`;
}

export default ({ id, name }) => (
  <a
    href={`${API_ROOT}/download/fasta/${id}`}
    download={formatFastaFilename(name)}
    target="_blank" rel="noopener"
    title="Download Assembly"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.PURPLE} label=".fa" />
  </a>
);
