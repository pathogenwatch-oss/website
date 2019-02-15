import React from 'react';
import { connect } from 'react-redux';
import 'eventsource/lib/eventsource-polyfill';

import Stage from './Stage.react';

import { getAssemblyStatus, getAssemblyProgress } from '../selectors';

import { updateAssemblyStatus } from './actions';

import config from '../../../app/config';

const Pipeline = ({ status, token, updateStatus, uploadedAt, complete }) => {
  const [ stage, setStageDetail ] = React.useState(null);
  React.useEffect(() => {
    if (token && !complete) {
      console.log('connecting to event source');
      const eventSource = new window.EventSourcePolyfill(
        `${config.assemblerAddress}/api/sessions/${uploadedAt}`,
        { headers: { Authorization: `Bearer ${token}`, 'cache-control': null } }
      );
      eventSource.onmessage = e => {
        updateStatus(JSON.parse(e.data));
      };
      return () => {
        console.log('closing event source');
        eventSource.close();
      };
    }
  }, [ token, uploadedAt, complete ]);
  return (
    <div className="pw-assembly-pipeline" onClick={() => setStageDetail(null)}>
      {status.map(({ label, ...props }) => (
        <Stage
          key={label}
          {...props}
          showDetails={() => setStageDetail(label)}
          showingDetails={stage === label}
        >
          {label}
        </Stage>
      ))}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    token: state.auth.token,
    status: getAssemblyStatus(state),
    complete: getAssemblyProgress(state) === 100,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStatus: data => dispatch(updateAssemblyStatus(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pipeline);
