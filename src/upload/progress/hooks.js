import React from 'react';
import 'eventsource/lib/eventsource-polyfill';

import store from '../../app/store';
import config from '../../app/config';

import { fetchSession } from '../utils/assembler';

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
          payload: JSON.parse(e.data),
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

export const useAssemblerSession = (uploadedAt, token) => {
  const [ session, setSession ] = React.useState(null);
  const [ error, setError ] = React.useState(null);

  React.useEffect(() => {
    if (token) {
      fetchSession(uploadedAt, token)
        .then(response => setSession(response.progress))
        .catch(e => {
          if (e.type === 'NOT_FOUND') {
            setError({
              message: (
                <React.Fragment>
                  <p>We couldn't find the details of this upload session.</p>
                  <p>
                    If the problem persists, you may need to start a new upload.
                  </p>
                </React.Fragment>
              ),
            });
          } else {
            setError(e);
          }
        });
    }
  }, [ uploadedAt, token ]);

  return [ session, error ];
};
