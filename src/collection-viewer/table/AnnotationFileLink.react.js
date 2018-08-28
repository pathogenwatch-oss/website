import React from 'react';

import DownloadIcon from '../../downloads/DownloadIcon.react';

import { CGPS } from '../../app/constants';
import { getServerPath } from '../../utils/Api';

export default ({ uuid, id, name }) => (
  <a
    href={getServerPath(`/download/collection/${uuid}/annotations?ids=${id}`)}
    download={`${name}.gff`}
    target="_blank" rel="noopener"
    title="Download Annotations"
    className="wgsa-download-button mdl-button mdl-button--icon"
  >
    <DownloadIcon color={CGPS.COLOURS.GREEN} label=".gff" />
  </a>
);
