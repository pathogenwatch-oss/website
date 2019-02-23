import React from 'react';

import store from '../../app/store';

export const useTicker = hasReads => {
  React.useEffect(() => {
    let interval;
    if (hasReads) {
      interval = setInterval(
        () =>
          store.dispatch({
            type: 'ASSEMBLY_PROGRESS_TICK',
          }),
        2000
      );
    }
    return () => interval && clearInterval(interval);
  });
};
