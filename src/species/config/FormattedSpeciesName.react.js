import React from 'react';

import { taxIdMap } from './index';

export default ({ speciesId, title }) => (
  <span title={title}>
    { taxIdMap.has(speciesId) ?
      taxIdMap.get(speciesId).formattedShortName :
      title }
  </span>
);
