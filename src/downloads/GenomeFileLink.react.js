import React from 'react';

import DownloadIcon from '../downloads/DownloadIcon.react';

import { CGPS, DEFAULT } from '../app/constants';
import { getServerPath } from '../utils/Api';

function formatGenomeFilename(genomeName) {
  for (const ext in DEFAULT.GENOME_FILE_EXTENSIONS) {
    if (genomeName.indexOf(ext) !== -1) {
      return genomeName;
    }
  }
  return `${genomeName}.fasta`;
}

export default ({ id, name }) => (
  <a
    href={getServerPath(`/download/genome/${id}/fasta`)}
    download={formatGenomeFilename(name)}
    target="_blank" rel="noopener"
    title="Download Genome"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.PURPLE} label=".fa" />
  </a>
);
