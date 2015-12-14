import React from 'react';
import { connect } from 'react-redux';

import Tree from '^/components/tree';
import TreeHeader from '^/components/tree/TreeHeader.react';

import {
  getTreeFunctions,
  getTitle,
  getFilenames,
  speciesTrees,
} from '^/constants/tree';

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

// TODO: Memoisation
function mergeProps({ loading, tree, state }, { dispatch }, props) {
  const { collection, tables } = state;
  const title = getTitle(tree.name, state.entities.assemblies[tree.name]);
  return {
    ...props,
    loading,
    ...tree,
    ...getTreeFunctions(tree.name, state, dispatch),
    filenames: getFilenames(title, collection.id, tables.metadata.activeColumn),
    header: (
      <TreeHeader
        tree={tree}
        title={title}
        isSpecies={speciesTrees.has(tree.name)}
        dispatch={dispatch}
      />
    ),
  };
}

export default connect(mapStateToProps, null, mergeProps)(ConnectedTree);
