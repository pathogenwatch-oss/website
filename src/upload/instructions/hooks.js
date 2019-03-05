import React from 'react';

import * as api from '../api';

export function useAssemblerUsage(token) {
  const [ usage, setUsage ] = React.useState(null);
  React.useEffect(() => {
    if (token) {
      api
        .fetchUsage(token)
        .then(result => setUsage(result))
        .catch(e => {
          console.error(e);
        });
    }
  }, [ token ]);

  return usage;
}
