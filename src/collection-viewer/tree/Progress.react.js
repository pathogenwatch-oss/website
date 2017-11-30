import React from 'react';
import { connect } from 'react-redux';

import Spinner from '../../components/Spinner.react';

import { subscribe, unsubscribe } from '../../utils/Notification';
import { getCollection } from '../selectors';

import { updateProgress } from '../actions';

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

  componentDidUpdate() {
    // do progress
  },

  componentWillUnmount() {
    unsubscribe(this.props.uuid, 'progress');
  },

  render() {
    return (
      <div className="wgsa-loading-overlay wgsa-tree-progress">
        <Spinner />
        <p>Awaiting Tree</p>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    uuid: getCollection(state).uuid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProgress: results => dispatch(updateProgress(results)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Progress);
