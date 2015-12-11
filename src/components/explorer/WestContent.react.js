import React from 'react';
import { connect } from 'react-redux';

import Tree from '^/components/tree';
import TreeHeader from '^/components/tree/TreeHeader.react';

import { getTreeFunctions, getTitle, speciesTrees } from '^/constants/tree';

const ConnectedTree = (props) => (<Tree {...props} />);

function mapStateToProps(state) {
  const { entities, display, loading } = state;
  const { tree } = display;

  return {
    loading: loading.tree,
    tree: entities.trees[tree],
    state,
  };
}

function mergeProps({ loading, tree, state }, { dispatch }, props) {
  return {
    ...props,
    loading,
    ...tree,
    ...getTreeFunctions(tree.name, state, dispatch), // TODO: Memoise this
    header: (
      <TreeHeader
        tree={tree}
        title={getTitle(tree.name, state.entities.assemblies[tree.name])}
        isSpecies={speciesTrees.has(tree.name)}
        dispatch={dispatch}
      />
    ),
  };
}

export default connect(mapStateToProps, null, mergeProps)(ConnectedTree);
