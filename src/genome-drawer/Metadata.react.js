import React from 'react';

import { Metadata } from './components';

export default ({ genome }) => {
  const { userDefined = {} } = genome;
  return (
    <div>
      <div className="wgsa-analysis-section">
        <dl className="wgsa-hub-stats-view">
          { Object.keys(userDefined).map(key =>
            <Metadata key={key} label={key}>{userDefined[key]}</Metadata>
          )}
        </dl>
      </div>
    </div>
  );
};
