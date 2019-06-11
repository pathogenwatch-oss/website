import React from 'react';
import { connect } from 'react-redux';

import Poll from '../../components/Poller.react';
import CircularProgress from '../../components/CircularProgress.react';
import Fade from '../../components/fade';

import { getTrees } from './selectors';

import { fetchTreePosition, setTree } from './actions';
import { COLLECTION } from '../../app/stateKeys/tree';

const Progress = React.createClass({
  renderQueuePosition() {
    const { position } = this.props;
    if (position === 0) {
      return 'Awaiting progress';
    }
    if (!!position) {
      return `Queue position: ${position}`;
    }
    return 'Awaiting position';
  },

  renderStatus() {
    const { status, progress } = this.props;

    if (status === 'PENDING') {
      return (
        <div className="wgsa-tree-progress mdl-shadow--2dp">
          <p>Tree pending</p>
          <p className="wgsa-muted wgsa-blink">{this.renderQueuePosition()}</p>
          <Poll interval={10} fn={this.props.fetchPosition} />
        </div>
      );
    }

    if (status === 'IN PROGRESS') {
      return (
        <div className="wgsa-tree-progress mdl-shadow--2dp">
          <CircularProgress
            radius="40"
            strokeWidth="8"
            percentage={progress || 0}
          />
          <p className="wgsa-blink">Tree in progress</p>
        </div>
      );
    }

    if (status === 'ERROR') {
      return (
        <div className="wgsa-tree-progress mdl-shadow--2dp">
          <p className="danger">Error building tree</p>
          <p className="wgsa-blink">Awaiting retry</p>
        </div>
      );
    }

    if (status === 'FAILED') {
      return (
        <div className="wgsa-tree-progress mdl-shadow--2dp">
          <p>😞</p>
          <p className="danger">Failed to build tree</p>
        </div>
      );
    }

    if (status === 'READY') {
      return (
        <div className="wgsa-tree-progress mdl-shadow--2dp">
          <button
            className="mdl-button mdl-button--raised mdl-button--colored"
            onClick={this.props.showTree}
          >
            View Tree
          </button>
        </div>
      );
    }

    return null;
  },

  render() {
    return (
      <Fade out>
        {React.cloneElement(this.renderStatus(), { key: this.props.status })}
      </Fade>
    );
  },
});

function mapStateToProps(state) {
  const { status, progress, position } = getTrees(state)[COLLECTION];
  return {
    status,
    progress,
    position,
  };
}

function mapDispatchToProps(dispatch, { date }) {
  return {
    fetchPosition: () => dispatch(fetchTreePosition(COLLECTION, date)),
    showTree: () => dispatch(setTree(COLLECTION)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Progress);
