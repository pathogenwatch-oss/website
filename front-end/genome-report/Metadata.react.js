import React from 'react';

import { Metadata } from './components';

export default ({ genome }) => {
  const { userDefined = {} } = genome;
  return (
    <React.Fragment>
      <h2>Metadata</h2>
      <dl className="grid">
        { Object.keys(userDefined).map(key =>
          <Metadata key={key} label={key}>{userDefined[key]}</Metadata>
        )}
      </dl>
    </React.Fragment>
  );
};
