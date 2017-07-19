import React from 'react';

import { FormattedName } from '../../organisms';

export default ({ genome }) => {
  const { name, organismId, analysis = {} } = genome;
  const { organismName } = analysis.specieator || {};
  return (
    <header className="wgsa-card-header">
      <h2 className="wgsa-card-title wgsa-overflow-fade" title={name}>{name}</h2>
      <p className="wgsa-card-subtitle wgsa-overflow-fade">
        { organismName ?
            <FormattedName
              organismId={organismId}
              title={organismName}
              fullName
            /> :
            <span>&nbsp;</span> }
      </p>
    </header>
  );
};
