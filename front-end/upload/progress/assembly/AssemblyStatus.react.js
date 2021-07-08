import React from 'react';
import { connect } from 'react-redux';
import 'eventsource/lib/eventsource-polyfill';

import { isAssemblyInProgress, shouldListenForUpdates } from './selectors';

import { assemblyProgressTick, assemblyPipelineStatus, assemblyPipelineError } from './actions';

import { subscribe, unsubscribe } from '~/utils/Notification';

import config from '~/app/config';
import { fetchProgress } from './api';

const Status = ({
  assemblyInProgress,
  handleStatusUpdate,
  listening,
  progressTick,
  uploadedAt,
}) => {
  React.useEffect(() => {
    if (listening) {
      fetchProgress(uploadedAt)
        .then((payload) => {
          handleStatusUpdate({
            type: 'STATUS',
            payload,
          });
        })
        .catch(console.error);
      const channelId = `${config.clientId}-assembly`;
      subscribe(
        channelId, uploadedAt, handleStatusUpdate
      );
      return () => unsubscribe(channelId);
    }
  }, [ listening ]);

  React.useEffect(() => {
    if (assemblyInProgress) {
      const interval = setInterval(
        progressTick,
        2000
      );
      return () => clearInterval(interval);
    }
  }, [ assemblyInProgress ]);
  return null;
};

function mapStateToProps(state) {
  return {
    listening: shouldListenForUpdates(state),
    assemblyInProgress: isAssemblyInProgress(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleStatusUpdate: (message) => {
      switch (message.type) {
        case 'ERROR':
          dispatch(assemblyPipelineError(message.payload));
          break;
        case 'STATUS':
          dispatch(assemblyPipelineStatus(message.payload));
          break;
        default:
          console.log('[Assembly] Unknown message type:', message);
      }
    },
    progressTick: () => dispatch(assemblyProgressTick()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Status);
