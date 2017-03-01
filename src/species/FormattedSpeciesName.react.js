import React from 'react';

import { taxIdMap } from './index';

export default ({ speciesId, title, fullName = false }) => (
  <span title={title}>
    { taxIdMap.has(speciesId) ?
      taxIdMap.get(speciesId)[fullName ? 'formattedName' : 'formattedShortName'] :
      title }
  </span>
);
