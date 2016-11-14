import { connect } from 'react-redux';

import Tree from '../tree';

import * as selectors from '../tree/selectors';
import {
  treeLoaded,
  subtreeLoaded,
  treeClicked,
  addSnapshot,
} from '../tree/thunks';

function mapStateToProps(state) {
  return {
    tree: selectors.getVisibleTree(state),
    filenames: selectors.getFilenames(state),
    loading: selectors.isLoading(state),
    leafProps: selectors.getLeafProps(state),
  };
}

function mergeProps(state, { dispatch }, props) {
  const { tree, ...treeProps } = state;

  return {
    ...props,
    ...tree,
    ...treeProps,
    onLoaded: phylocanvas => dispatch(treeLoaded(phylocanvas)),
    onSubtree: phylocanvas => dispatch(subtreeLoaded(phylocanvas)),
    onUpdated: (event, phylocanvas) =>
      dispatch(treeClicked(event, phylocanvas)),
    onStyled: phylocanvas => dispatch(addSnapshot(phylocanvas.getPngUrl())),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Tree);
