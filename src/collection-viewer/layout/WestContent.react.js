import { connect } from 'react-redux';

import Tree from '../tree';

import * as selectors from '../tree/selectors';

import { treeLoaded } from '../tree/thunks';

import { getTreeFunctions } from '../tree/constants';

function mapStateToProps(state) {
  return {
    tree: selectors.getVisibleTree(state),
    filenames: selectors.getFilenames(state),
    loading: selectors.isLoading(state),
    // leafStyles: selectors.getLeafStyles(state),
  };
}

function mergeProps(state, { dispatch }, props) {
  const { tree, ...treeProps } = state;

  return {
    ...props,
    ...tree,
    ...treeProps,
    styleTree: () => {},
    onLoaded: phylocanvas => dispatch(treeLoaded(tree.name, phylocanvas)),
    // onUpdated: (event, phylocanvas) =>
    //   dispatch(treeClicked(tree.name, event, phylocanvas)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Tree);
