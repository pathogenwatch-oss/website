import React from 'react';

import { taxIdMap } from './index';

export default ({ organismId, title, fullName = false }) => (
  <span title={title}>
    { taxIdMap.has(organismId) ?
      taxIdMap.get(organismId)[fullName ? 'formattedName' : 'formattedShortName'] :
      title }
  </span>
);
