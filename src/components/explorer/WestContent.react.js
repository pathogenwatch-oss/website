import React from 'react';
import { connect } from 'react-redux';

import Tree from '^/components/tree';

import { getTreeFunctions, getNavButton } from '^/constants/tree';

const ConnectedTree = (props) => (<Tree {...props} />);

function mapStateToProps({ entities, display, collection, filter }) {
  const { trees } = entities;
  const { tree } = display;

  return {
    title: trees[tree].title,
    tree,
    state: {
      ...entities,
      collection,
      filter,
    },
  };
}

function mergeProps({ title, tree, state }, { dispatch }, props) {
  return {
    ...props,
    title,
    navButton: getNavButton(tree),
    ...getTreeFunctions(tree, state, dispatch),
  };
}

export default connect(mapStateToProps, null, mergeProps)(ConnectedTree);
