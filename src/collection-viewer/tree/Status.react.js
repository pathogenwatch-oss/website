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
    if (this.props.status === 'READY') {
      return <Tree {...this.props} />;
    }
    const { createdAt, stateKey } = this.props;
    return <Progress date={createdAt} stateKey={stateKey} />;
  },

});

function mapStateToProps(state) {
  const collection = getCollection(state);
  const tree = getVisibleTree(state);
  return {
    createdAt: collection.createdAt,
    status: tree.status,
    stateKey: tree.name,
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
