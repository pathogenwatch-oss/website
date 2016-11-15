import { connect } from 'react-redux';

import Tree from '../tree';
import PopulationStyler from '../tree/PopulationStyler.react';
import StandardStyler from '../tree/StandardStyler.react';

import * as selectors from '../tree/selectors';
import {
  treeLoaded,
  subtreeLoaded,
  treeClicked,
  addSnapshot,
} from '../tree/thunks';

import { POPULATION } from '../../app/stateKeys/tree';

function mapStateToProps(state) {
  return {
    tree: selectors.getVisibleTree(state),
    filenames: selectors.getFilenames(state),
    loading: selectors.isLoading(state),
  };
}

function mergeProps(state, { dispatch }, props) {
  const { tree, ...treeProps } = state;

  return {
    ...props,
    ...tree,
    ...treeProps,
    Styler: tree.name === POPULATION ? PopulationStyler : StandardStyler,
    onLoaded: phylocanvas => dispatch(treeLoaded(phylocanvas)),
    onSubtree: phylocanvas => dispatch(subtreeLoaded(phylocanvas)),
    onUpdated: (event, phylocanvas) =>
      dispatch(treeClicked(event, phylocanvas)),
    onStyled: phylocanvas => dispatch(addSnapshot(phylocanvas)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Tree);
