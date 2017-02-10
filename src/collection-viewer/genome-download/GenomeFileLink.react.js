import React from 'react';

import DownloadIcon from '../downloads/DownloadIcon.react';

import { GENOME_FILE_EXTENSIONS } from '../../genomes/utils';
import { CGPS } from '../../app/constants';
import { SERVER_ADDRESS } from '../../utils/Api';

function formatGenomeFilename(genomeName) {
  for (const ext in GENOME_FILE_EXTENSIONS) {
    if (genomeName.indexOf(ext) !== -1) {
      return genomeName;
    }
  }
  return `${genomeName}.genome`;
}

export default ({ id, name }) => (
  <a
    href={`${SERVER_ADDRESS}/download/genome/${id}`}
    download={formatGenomeFilename(name)}
    target="_blank" rel="noopener"
    title="Download Genome"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.PURPLE} label=".fa" />
  </a>
);
