import React from 'react';
import { connect } from 'react-redux';

// import Spinner from '../../components/Spinner.react';
import CircularProgress from '../../components/CircularProgress.react';

import { getVisibleTree } from './selectors';

const Progress = React.createClass({

  render() {
    const { status, progress } = this.props;

    if (status === 'PENDING') {
      return (
        <div className="wgsa-loading-overlay wgsa-tree-progress">
          <p className="wgsa-blink">Tree pending</p>
          <p>Queue position: 1</p>
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

    return null;
  },

});

function mapStateToProps(state) {
  const { status, progress } = getVisibleTree(state);
  return { status, progress };
}

export default connect(mapStateToProps)(Progress);
