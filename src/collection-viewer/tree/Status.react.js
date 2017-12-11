import React from 'react';
import { connect } from 'react-redux';

import Tree from './container';
import Progress from './Progress.react';
import { subscribe, unsubscribe } from '../../utils/Notification';

import { getCollection } from '../selectors';
import { getVisibleTree, areTreesComplete } from './selectors';

import { handleTreeProgress } from './thunks';

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
    if (this.props.status === 'PENDING') {
      return <Progress />;
    }
    return <Tree />;
  },

});

function mapStateToProps(state) {
  return {
    treesComplete: areTreesComplete(state),
    uuid: getCollection(state).uuid,
    status: getVisibleTree(state).status,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProgress: results => dispatch(handleTreeProgress(results)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusSwitcher);
