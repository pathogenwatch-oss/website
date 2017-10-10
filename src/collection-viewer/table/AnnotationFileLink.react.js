import React from 'react';

import DownloadIcon from '../../downloads/DownloadIcon.react';

import { CGPS } from '../../app/constants';
import { getServerPath } from '../../utils/Api';

export default ({ id, name }) => (
  <a
    href={getServerPath(`/download/annotations?ids=${id}`)}
    download={`${name}.gff`}
    target="_blank" rel="noopener"
    title="Download Genome"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.GREEN} label=".gff" />
  </a>
);
