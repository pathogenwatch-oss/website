import React from 'react';

import DownloadIcon from '../../downloads/DownloadIcon.react';

import { CGPS } from '../../app/constants';

export default ({ url, name }) => (
  <a
    href={url}
    download={`${name}.fa`}
    target="_blank" rel="noopener"
    title="Download Genome"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.PURPLE} label=".fa" />
  </a>
);
