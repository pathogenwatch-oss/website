import { connect } from 'react-redux';

import Tree from '../tree';
import PopulationStyler from '../tree/PopulationStyler.react';
import StandardStyler from '../tree/StandardStyler.react';

import * as selectors from '../tree/selectors';
import {
  treeLoaded,
  subtreeLoaded,
  treeClicked,
  typeChanged,
  internalNodeSelected,
} from '../tree/thunks';

import { POPULATION } from '../../app/stateKeys/tree';

function mapStateToProps(state) {
  const { name, type, loaded, newick, root } = selectors.getVisibleTree(state);
  return {
    name, type, loaded, newick, root,
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
