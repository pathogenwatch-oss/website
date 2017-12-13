import React from 'react';

import DownloadLink from './DownloadLink.react';
import DownloadIcon from '../../downloads/DownloadIcon.react.js';

import { getServerPath } from '../../utils/Api';

import { CGPS } from '../../app/constants';
const { COLOURS } = CGPS;

export default ({ uuid, ids, filename }) => (
  <DownloadLink
    action={getServerPath(`/download/collection/${uuid}/fastas?filename=${filename}`)}
    title="Download Genomes"
    ids={ids}
  >
    <DownloadIcon isArchive color={COLOURS.PURPLE} />
  </DownloadLink>
);
