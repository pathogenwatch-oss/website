import React from 'react';
import { connect } from 'react-redux';

import Tree from '^/components/tree';
import TreeHeader from '^/components/tree/TreeHeader.react';

import { getTreeFunctions } from '^/constants/tree';

const ConnectedTree = (props) => (<Tree {...props} />);

function mapStateToProps({ entities, display, collection, filter }) {
  const { tree } = display;

  return {
    newick: entities.trees[tree].newick,
    tree,
    state: {
      entities,
      collection,
      filter,
      display,
    },
  };
}

function mergeProps({ newick, tree, state }, { dispatch }, props) {
  return {
    ...props,
    newick,
    ...getTreeFunctions(tree, state, dispatch),
    header: (<TreeHeader tree={tree} dispatch={dispatch} />),
  };
}

export default connect(mapStateToProps, null, mergeProps)(ConnectedTree);
