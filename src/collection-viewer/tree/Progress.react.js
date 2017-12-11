import React from 'react';
import { connect } from 'react-redux';

// import Spinner from '../../components/Spinner.react';
import CircularProgress from '../../components/CircularProgress.react';

import { getVisibleTree } from './selectors';

const Progress = React.createClass({

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
    progress: getVisibleTree(state).progress,
  };
}

export default connect(mapStateToProps)(Progress);
