import React from 'react';
import { connect } from 'react-redux';

import Tree from './container';
import Progress from './Progress.react';

import { getVisibleTree } from './selectors';

function mapStateToProps(state) {
  return {
    status: getVisibleTree(state).status,
  };
}

const StatusSwitcher = ({ status }) => {
  if (status === 'PENDING') {
    return <Progress />;
  }
  return <Tree />;
};

export default connect(mapStateToProps)(StatusSwitcher);
