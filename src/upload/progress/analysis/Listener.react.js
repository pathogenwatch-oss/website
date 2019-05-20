import React from 'react';

import { receiveUploadAnalysis, fetchQueuePosition } from './actions';

import { subscribe, unsubscribe } from '~/utils/Notification';

import store from '~/app/store';
import config from '~/app/config';

export default React.memo(({ uploadedAt }) => {
  React.useEffect(() => {
    const channelId = `${config.clientId}-analysis`;
    subscribe(channelId, uploadedAt, msg =>
      store.dispatch(receiveUploadAnalysis(msg))
    );
    return () => unsubscribe(channelId);
  }, [ uploadedAt ]);

  React.useEffect(() => {
    const interval = setInterval(
      () => store.dispatch(fetchQueuePosition(uploadedAt)),
      1000 * 60
    );
    return () => clearInterval(interval);
  }, [ uploadedAt ]);
});
