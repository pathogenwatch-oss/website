import React from 'react';
import { connect } from 'react-redux';
import 'eventsource/lib/eventsource-polyfill';

import Stage from './Stage.react';

import { getAssemblyStatus } from '../selectors';

import { getAuthToken } from '../../../auth/actions';
import { updateAssemblyStatus } from './actions';

import config from '../../../app/config';

const exampleData = {
  1: {
    label: 'Stage 1',
    progress: 0,
    statuses: [],
    // [
    //   { name: 'Running', colour: '#6cc2de', percentage: 100, count: 1 },
    //   { name: 'Complete', colour: '#673c90', percentage: 100, count: 1 },
    // ],
    // [
    //   { name: 'Complete', colour: '#48996F', percentage: 100, count: 5 },
    //   // { name: 'Running', colour: '#673c90', percentage: 20, count: 1 },
    // ],
  },
  2: {
    label: 'Stage 2',
    progress: 0,
    statuses: [],
    // [
    //   { name: 'Error', colour: '#d11b1b', percentage: 20, count: 1 },
    //   { name: 'Complete', colour: '#48996F', percentage: 20, count: 1 },
    //   { name: 'Running', colour: '#673c90', percentage: 20, count: 1 },
    // ],
    // [
    //   { name: 'Running', colour: '#6cc2de', percentage: 20, count: 1 },
    //   { name: 'Complete', colour: '#673c90', percentage: 40, count: 2 },
    // ],
  },
};

const Pipeline = ({ getToken, status, token, updateStatus, uploadedAt }) => {
  const [ stage, setStageDetail ] = React.useState(null);
  React.useEffect(() => {
    if (token) {
      const eventSource = new window.EventSourcePolyfill(
        `${config.assemblerAddress}/api/sessions/${uploadedAt}`,
        { headers: { Authorization: `Bearer ${token}`, 'cache-control': null } }
      );
      eventSource.onmessage = e => {
        updateStatus(e.data);
      };
      return () => {
        eventSource.close();
      };
    }
    getToken();
  }, [ token, uploadedAt ]);
  return (
    <div className="pw-assembly-pipeline" onClick={() => setStageDetail(null)}>
      <Stage
        // statuses={status[1].statuses}
        // progress={status[1].progress}
        showDetails={() => setStageDetail('1')}
        showingDetails={stage === '1'}
      >
        Stage 1
      </Stage>
      <Stage
        // statuses={status[2].statuses}
        // progress={status[2].progress}
        showDetails={() => setStageDetail('2')}
        showingDetails={stage === '2'}
      >
        Stage 2
      </Stage>
      <Stage
        showDetails={() => setStageDetail('3')}
        showingDetails={stage === '3'}
      >
        Stage 3
      </Stage>
      <Stage>Stage 4</Stage>
      <Stage length="long">Stage 5</Stage>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    token: state.auth.token,
    status: getAssemblyStatus(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getToken: () => dispatch(getAuthToken()),
    updateStatus: data => dispatch(updateAssemblyStatus(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pipeline);
