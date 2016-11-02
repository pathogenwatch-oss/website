import React from 'react';

import DownloadIcon from '../components/explorer/DownloadIcon.react';

import { API_ROOT } from '../utils/Api';
import { CGPS } from '../app/constants';

// target="_blank" rel="noopener"

export default ({ id }) => (
  <a
    href={`${API_ROOT}/download/fasta/${id}`}
    title="Download Assembly"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.PURPLE} label=".fa" />
  </a>
);
