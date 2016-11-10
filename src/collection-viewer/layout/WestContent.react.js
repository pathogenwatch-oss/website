import React from 'react';
import { connect } from 'react-redux';

import Tree from '../tree';
import TreeHeader from '../tree/Header.react';

import * as selectors from '../tree/selectors';

import { setUnfilteredIds } from '../../collection-viewer/filter/actions';

import { getTreeFunctions, speciesTrees } from '../tree/constants';

function mapStateToProps(state) {
  return {
    tree: selectors.getVisibleTree(state),
    singleTree: selectors.getSingleTree(state),
    title: selectors.getTitle(state),
    filenames: selectors.getFilenames(state),
    loading: selectors.isLoading(state),
    wholeState: state,
  };
}

// TODO: Memoisation
function mergeProps(state, { dispatch }, props) {
  const { wholeState, tree, singleTree, title, ...treeProps } = state;

  return {
    ...props,
    ...tree,
    ...treeProps,
    ...getTreeFunctions(tree.name, wholeState, dispatch),
    setUnfilteredIds: ids => dispatch(setUnfilteredIds(ids)),
    header: (
      <TreeHeader
        tree={tree}
        title={title}
        isSpecies={speciesTrees.has(tree.name)}
        dispatch={dispatch}
        singleTree={singleTree}
      />
    ),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Tree);
