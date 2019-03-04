import React from 'react';

import store from '../../app/store';

import config from '../../app/config';

export const useAssemblyStatus = (
  uploadedAt,
  hasReads,
  assemblyInProgress,
  token
) => {
  React.useEffect(() => {
    if (uploadedAt && hasReads && token) {
      // Uses polyfill for Authorisation header
      const eventSource = new window.EventSourcePolyfill(
        `${config.assemblerAddress}/api/sessions/${uploadedAt}`,
        { headers: { Authorization: `Bearer ${token}`, 'cache-control': null } }
      );
      eventSource.onmessage = e => {
        store.dispatch({
          type: 'ASSEMBLY_PIPELINE_STATUS',
          payload: e.data,
        });
      };
      return () => {
        eventSource.close();
      };
    }
  }, [ uploadedAt, hasReads, token ]);

  React.useEffect(() => {
    if (uploadedAt && assemblyInProgress) {
      const interval = setInterval(
        () =>
          store.dispatch({
            type: 'ASSEMBLY_PROGRESS_TICK',
          }),
        2000
      );
      return () => clearInterval(interval);
    }
  }, [ uploadedAt, assemblyInProgress ]);
};
