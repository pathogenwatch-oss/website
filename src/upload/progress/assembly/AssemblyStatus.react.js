import React from 'react';
import { connect } from 'react-redux';
import 'eventsource/lib/eventsource-polyfill';

import { useAuthToken } from '~/auth/hooks';

import { isAssemblyInProgress, isAssemblyPending } from './selectors';

import { assemblyProgressTick, assemblyPipelineStatus, assemblyPipelineError } from './actions';

import { subscribe, unsubscribe } from '~/utils/Notification';

import config from '~/app/config';
import { fetchProgress } from './api';

const Status = ({
  assemblyInProgress,
  handleStatusUpdate,
  pending,
  progressTick,
  token,
  uploadedAt,
}) => {
  useAuthToken();
  React.useEffect(() => {
    if (pending && token) {
      fetchProgress(uploadedAt, token)
        .then(payload => {
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
  }, [ pending, token ]);

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
    pending: isAssemblyPending(state),
    assemblyInProgress: isAssemblyInProgress(state),
    token: state.auth.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleStatusUpdate: ({ type, payload }) => {
      switch (type) {
        case 'ERROR':
          dispatch(assemblyPipelineError(payload));
          break;
        case 'STATUS':
          dispatch(assemblyPipelineStatus(payload));
          break;
        default:
          console.log('[Assembly] Unknown message type:', type, payload);
      }
    },
    progressTick: () => dispatch(assemblyProgressTick()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Status);
