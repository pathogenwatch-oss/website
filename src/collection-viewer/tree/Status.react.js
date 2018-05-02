import React from 'react';
import { connect } from 'react-redux';

import Tree from './container';
import Progress from './Progress.react';
import { subscribe, unsubscribe } from '../../utils/Notification';

import { getCollection } from '../selectors';
import { areTreesComplete, getVisibleTree } from './selectors';

import { handleTreeProgress } from './thunks';
import { COLLECTION } from '../../app/stateKeys/tree';

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
    if (this.props.hasVisibleTree) {
      return <Tree {...this.props} />;
    }
    const { createdAt } = this.props;
    return <Progress date={createdAt} stateKey={COLLECTION} />;
  },

});

function mapStateToProps(state) {
  const collection = getCollection(state);
  return {
    createdAt: collection.createdAt,
    treesComplete: areTreesComplete(state),
    uuid: collection.uuid,
    hasVisibleTree: getVisibleTree(state) !== null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProgress: results => dispatch(handleTreeProgress(results)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusSwitcher);
