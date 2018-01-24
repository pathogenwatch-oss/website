import { connect } from 'react-redux';

import Tree from './Tree.react';
import PopulationStyler from './PopulationStyler.react';
import StandardStyler from './StandardStyler.react';

import * as selectors from './selectors';
import {
  treeLoaded,
  subtreeLoaded,
  treeClicked,
  typeChanged,
  internalNodeSelected,
} from './thunks';

import { POPULATION } from '../../app/stateKeys/tree';

function mapStateToProps(state) {
  const { name, type, loaded, newick, root } = selectors.getVisibleTree(state);
  return {
    name, type, loaded, newick, root, status,
    filenames: selectors.getFilenames(state),
    loading: selectors.isLoading(state),
    Styler: name === POPULATION ? PopulationStyler : StandardStyler,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoaded: phylocanvas => dispatch(treeLoaded(phylocanvas)),
    onSubtree: phylocanvas => dispatch(subtreeLoaded(phylocanvas)),
    onUpdated: (event, phylocanvas) =>
      dispatch(treeClicked(event, phylocanvas)),
    onTypeChanged: phylocanvas => dispatch(typeChanged(phylocanvas)),
    onInternalNodeSelected: node => dispatch(internalNodeSelected(node)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
