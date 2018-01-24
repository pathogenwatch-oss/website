import React from 'react';

import { Metadata } from './components';

export default ({ genome }) => {
  const { userDefined = {} } = genome;
  return (
    <dl>
      { Object.keys(userDefined).map(key =>
        <Metadata key={key} label={key}>{userDefined[key]}</Metadata>
      )}
    </dl>
  );
};
