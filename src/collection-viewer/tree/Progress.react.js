import React from 'react';
import { connect } from 'react-redux';

// import Spinner from '../../components/Spinner.react';
import CircularProgress from '../../components/CircularProgress.react';

import { subscribe, unsubscribe } from '../../utils/Notification';
import { getCollection } from '../selectors';
import { getVisibleTree } from './selectors';

import { handleTreeProgress } from './thunks';

const Progress = React.createClass({

  componentDidMount() {
    const { uuid } = this.props;
    if (uuid && !this.notificationChannel) {
      this.notificationChannel = subscribe(
        uuid,
        'progress',
        this.props.updateProgress
      );
    }
  },

  componentWillUnmount() {
    unsubscribe(this.props.uuid, 'progress');
  },

  render() {
    return (
      <div className="wgsa-loading-overlay wgsa-tree-progress">
        <CircularProgress
          radius="80"
          strokeWidth="8"
          percentage={this.props.progress || 1}
        />
        <p>Tree in progress</p>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    uuid: getCollection(state).uuid,
    progress: getVisibleTree(state).progress,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProgress: results => dispatch(handleTreeProgress(results)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Progress);
