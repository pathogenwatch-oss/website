import React from 'react';
import { connect } from 'react-redux';

import Tree from '^/components/tree';
import TreeHeader from '^/components/tree/TreeHeader.react';

import { setUnfilteredIds } from '^/actions/filter';

import { COLLECTION, POPULATION } from '^/constants/tree';

import {
  getTreeFunctions,
  getTitle,
  getFilenames,
  speciesTrees,
} from '^/constants/tree';

import Species from '^/species';

const ConnectedTree = (props) => (<Tree {...props} />);

function mapStateToProps(state) {
  const { entities, display } = state;
  const { tree } = display;
  const displayedTree = entities.trees[tree.name];

  return {
    loading: tree.loading,
    tree: displayedTree.newick ? displayedTree : entities.trees[POPULATION],
    state,
  };
}

// TODO: Memoisation
function mergeProps({ loading, tree, state }, { dispatch }, props) {
  const { collection, tables, entities } = state;
  const title = getTitle(tree.name, entities.assemblies[tree.name]);
  const collectionTree = entities.trees[COLLECTION];

  return {
    ...props,
    loading,
    ...tree,
    ...getTreeFunctions(tree.name, state, dispatch),
    filenames: getFilenames(title, collection.id, tables.metadata.activeColumn),
    setUnfilteredIds: (ids) => dispatch(setUnfilteredIds(ids)),
    header: (
      <TreeHeader
        tree={tree}
        title={title}
        isSpecies={speciesTrees.has(tree.name)}
        dispatch={dispatch}
        hideSwitcher={
          Species.uiOptions.noPopulation ||
          !(collectionTree && collectionTree.newick)
        }
      />
    ),
  };
}

export default connect(mapStateToProps, null, mergeProps)(ConnectedTree);
