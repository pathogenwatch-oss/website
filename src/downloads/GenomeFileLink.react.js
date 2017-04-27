import React from 'react';

import DownloadIcon from './DownloadIcon.react';

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

function createLink(type, id) {
  const link = getServerPath(`/download/genome/${id}`);
  if (type) return `${link}?type=${type}`;
  return link;
}

export default ({ type, id, name }) => (
  <a
    href={createLink(type, id)}
    download={formatGenomeFilename(name)}
    target="_blank" rel="noopener"
    title="Download Genome"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.PURPLE} label=".fa" />
  </a>
);
