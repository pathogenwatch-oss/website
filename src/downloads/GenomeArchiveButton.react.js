import React from 'react';

import DownloadIcon from './DownloadIcon.react.js';

import { CGPS } from '../app/constants';
const { COLOURS } = CGPS;

export default ({ ids, filename }) => (
  <a
    href={`/download/archive/collection?filename=${filename}&ids=${ids.join(',')}`}
    target="_blank" rel="noopener"
    download={filename}
    title="Download Genomes"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon
      isArchive
      color={COLOURS.PURPLE}
    />
  </a>
);
