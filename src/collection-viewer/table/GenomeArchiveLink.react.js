import React from 'react';

import DownloadIcon from '../../downloads/DownloadIcon.react.js';

import { getServerPath } from '../../utils/Api';

import { CGPS } from '../../app/constants';
const { COLOURS } = CGPS;

export default ({ ids, filename }) => (
  <a
    href={getServerPath(`/download/archive/collection?filename=${filename}&ids=${ids.join(',')}`)}
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
