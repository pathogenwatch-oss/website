import React from 'react';

import { statuses } from '../constants';

export default ({ genome }) => {
  const { name, status } = genome;
  return (
    <header className="wgsa-card-header">
      <h2 className="wgsa-card-title wgsa-overflow-fade" title={name}>{name}</h2>
      { status === statuses.ERROR &&
        <i className="material-icons">warning</i> }
    </header>
  );
};
