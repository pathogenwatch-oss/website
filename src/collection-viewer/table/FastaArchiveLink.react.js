import React from 'react';

import DownloadLink from './DownloadLink.react';
import DownloadIcon from '../../downloads/DownloadIcon.react.js';

import { CGPS } from '../../app/constants';
const { COLOURS } = CGPS;

export default ({ url, ids }) => (
  <DownloadLink
    action={url}
    title="Download Genomes"
    ids={ids}
  >
    <DownloadIcon isArchive color={COLOURS.PURPLE} />
  </DownloadLink>
);
