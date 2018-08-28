import React from 'react';
import { connect } from 'react-redux';

import { subscribe, unsubscribe } from '../utils/Notification';

import { getCollection } from './selectors';
import { areTreesComplete } from './tree/selectors';

import { handleTreeProgress } from './tree/thunks';

const StatusSwitcher = React.createClass({

  componentDidMount() {
    const { uuid, treesComplete } = this.props;
    if (!treesComplete && uuid && !this.notificationChannel) {
      this.notificationChannel = subscribe(
        uuid,
        'progress',
        this.props.updateProgress
      );
    }
  },

  componentDidUpdate(previous) {
    const { treesComplete } = this.props;
    if (!previous.treesComplete && treesComplete && this.notificationChannel) {
      unsubscribe(this.props.uuid, 'progress');
    }
  },

  componentWillUnmount() {
    if (this.notificationChannel) {
      unsubscribe(this.props.uuid, 'progress');
    }
  },

  render() {
    return null;
  },

});

function mapStateToProps(state) {
  const collection = getCollection(state);
  return {
    treesComplete: areTreesComplete(state),
    uuid: collection.uuid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProgress: results => dispatch(handleTreeProgress(results)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusSwitcher);
