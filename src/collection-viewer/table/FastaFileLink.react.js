import React from 'react';

import DownloadIcon from '../../downloads/DownloadIcon.react';

import { CGPS } from '../../app/constants';
import { getServerPath } from '../../utils/Api';

export default ({ uuid, id, name }) => (
  <a
    href={getServerPath(`/download/collection/${uuid}/fastas?ids=${id}`)}
    download={`${name}.fa`}
    target="_blank" rel="noopener"
    title="Download Genome"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.PURPLE} label=".fa" />
  </a>
);
