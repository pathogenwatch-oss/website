import React from 'react';

import { fetchSession } from './api';

export const useAssemblerSession = (uploadedAt) => {
  const [ session, setSession ] = React.useState(null);
  const [ error, setError ] = React.useState(null);

  React.useEffect(() => {
    fetchSession(uploadedAt)
      .then((response) => setSession(response.progress))
      .catch((e) => {
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
  }, [ uploadedAt ]);

  return [ session, error ];
};
