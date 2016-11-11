import { connect } from 'react-redux';

import Tree from '../tree';

import * as selectors from '../tree/selectors';

import { setUnfilteredIds } from '../../collection-viewer/filter/actions';

import { getTreeFunctions } from '../tree/constants';

function mapStateToProps(state) {
  return {
    tree: selectors.getVisibleTree(state),
    filenames: selectors.getFilenames(state),
    loading: selectors.isLoading(state),
    wholeState: state,
  };
}

// TODO: Memoisation
function mergeProps(state, { dispatch }, props) {
  const { wholeState, tree, ...treeProps } = state;

  return {
    ...props,
    ...tree,
    ...treeProps,
    ...getTreeFunctions(tree.name, wholeState, dispatch),
    setUnfilteredIds: ids => dispatch(setUnfilteredIds(ids)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Tree);
