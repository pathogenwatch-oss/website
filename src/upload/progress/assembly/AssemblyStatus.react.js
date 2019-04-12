import React from 'react';
import { connect } from 'react-redux';
import 'eventsource/lib/eventsource-polyfill';

import { getAssemblySummary, isAssemblyInProgress } from './selectors';
import * as files from '../files/selectors';

import { assemblyProgressTick, assemblyPipelineStatus } from './actions';

import config from '~/app/config';

const Status = ({
  assemblySummary,
  assemblyInProgress,
  hasReads,
  token,
  uploadedAt,
  dispatch,
}) => {
  const pending = assemblySummary.pending > 0;
  React.useEffect(() => {
    if (uploadedAt && hasReads && token && pending) {
      // Uses polyfill for Authorisation header
      const eventSource = new window.EventSourcePolyfill(
        `${config.assemblerAddress}/api/sessions/${uploadedAt}`,
        { headers: { Authorization: `Bearer ${token}`, 'cache-control': null } }
      );
      eventSource.onmessage = e => {
        try {
          const data = JSON.parse(e.data);
          if (data.error) throw new Error(data.error);
          dispatch(assemblyPipelineStatus(JSON.parse(e.data)));
        } catch (err) {
          console.error(err);
        }
      };
      return () => {
        eventSource.close();
      };
    }
  }, [ uploadedAt, hasReads, token, pending ]);

  React.useEffect(() => {
    if (uploadedAt && assemblyInProgress) {
      const interval = setInterval(
        () => dispatch(assemblyProgressTick()),
        2000
      );
      return () => clearInterval(interval);
    }
  }, [ uploadedAt, assemblyInProgress ]);
  return null;
};

function mapStateToProps(state) {
  return {
    assemblySummary: getAssemblySummary(state),
    assemblyInProgress: isAssemblyInProgress(state),
    hasReads: files.hasReads(state),
    token: state.auth.token,
  };
}

export default connect(mapStateToProps)(Status);
