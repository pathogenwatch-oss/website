import React from 'react';

import { FormattedName } from '../../organisms';
// import ProgressBar from '../../progress-bar';

import { statuses } from '../constants';

function getSubtitle(status) {
  if (status === statuses.SUCCESS) {
    return <small>Estimating Organism...</small>;
    // return <ProgressBar indeterminate />;
  }
  return <span>&nbsp;</span>;
}

export default ({ genome, analysis = {} }) => {
  const { name, organismId, status } = genome;
  const { organismName } = analysis.specieator || {};
  return (
    <header className="wgsa-card-header">
      <h2 className="wgsa-card-title wgsa-overflow-fade" title={name}>{name}</h2>
        { organismName ?
            <p className="wgsa-card-subtitle wgsa-overflow-fade">
              <FormattedName
                organismId={organismId}
                title={organismName}
                fullName
              />
            </p> : getSubtitle(status) }
    </header>
  );
};
