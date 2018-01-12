import React from 'react';
import { connect } from 'react-redux';

import Poll from '../../components/Poller.react';
import CircularProgress from '../../components/CircularProgress.react';

import { getVisibleTree } from './selectors';
import { getCollection } from '../selectors';

import { fetchTreePosition } from './actions';

const Progress = React.createClass({

  render() {
    const { status, progress, position } = this.props;

    if (status === 'PENDING') {
      return (
        <div className="wgsa-loading-overlay wgsa-tree-progress">
          <p className="wgsa-blink">Tree pending</p>
          {!!position && <p>Queue position: {position}</p>}
          <Poll interval={10} fn={this.props.fetchPosition} />
        </div>
      );
    }

    if (status === 'IN PROGRESS') {
      return (
        <div className="wgsa-loading-overlay wgsa-tree-progress">
          <CircularProgress
            radius="80"
            strokeWidth="8"
            percentage={progress || 0}
          />
          <p>Tree in progress</p>
        </div>
      );
    }

    if (status === 'ERROR') {
      return (
        <div className="wgsa-loading-overlay wgsa-tree-progress">
          <p className="danger">Error processing tree</p>
          <p className="wgsa-blink">Awaiting retry</p>
        </div>
      );
    }

    if (status === 'FAILED') {
      return (
        <div className="wgsa-loading-overlay wgsa-tree-progress">
          <p className="danger">Failed to process tree 😞</p>
        </div>
      );
    }

    return null;
  },

});

function mapStateToProps(state) {
  const { status, progress, position } = getVisibleTree(state);
  return {
    status,
    progress,
    position,
    createdAt: getCollection(state).createdAt,
  };
}

function mapDispatchToProps(dispatch, { date, stateKey }) {
  return {
    fetchPosition: () => dispatch(fetchTreePosition(stateKey, date)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Progress);
