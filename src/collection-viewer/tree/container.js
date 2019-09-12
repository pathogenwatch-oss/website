import React from 'react';
import { connect } from 'react-redux';

import Tree from '@cgps/libmicroreact/tree';
import Fade from '~/components/fade';
import Header from './Header.react';

import * as selectors from './selectors';

import { setHighlight } from '../highlight/actions';

import {
  treeLoaded,
  subtreeLoaded,
  treeClicked,
  typeChanged,
  internalNodeSelected,
  resetTreeRoot,
} from './thunks';

function mapStateToProps(state) {
  const { name, loaded } = selectors.getVisibleTree(state);
  return {
    name, loaded,
    phylocanvasState: selectors.getPhylocanvasState(state),
    filenames: selectors.getFilenames(state),
    loading: selectors.isLoading(state),
  };
}

const setPhylocanvasState = (state) =>
  (dispatch, getState) =>
    dispatch({
      stateKey: selectors.getTreeStateKey(getState()),
      type: 'SET PHYLOCANVAS STATE',
      payload: state,
    });

function mapDispatchToProps(dispatch) {
  return {
    onPhylocanvasInitialise: console.log, // (image) => dispatch(addInitialTreeHistory(image)),
    onPhylocanvasStateChange: (state) => dispatch(setPhylocanvasState(state)),
    setHighlightedIds: (ids, merge) => dispatch(setHighlight(ids, merge)),
    onFilterChange: console.log, // (ids, path) => dispatch(setTreeFilter(ids, path)),
    onAddHistoryEntry: console.log, // (image) => dispatch(addTreeHistory(image)),

    onLoaded: phylocanvas => dispatch(treeLoaded(phylocanvas)),
    onSubtree: phylocanvas => dispatch(subtreeLoaded(phylocanvas)),
    onUpdated: (event, phylocanvas) =>
      dispatch(treeClicked(event, phylocanvas)),
    onTypeChanged: phylocanvas => dispatch(typeChanged(phylocanvas)),
    onInternalNodeSelected: node => dispatch(internalNodeSelected(node)),
    resetTreeRoot: () => dispatch(resetTreeRoot()),
  };
}

const Component = (props) => {
  const [ controls, toggleControls ] = React.useState(false);
  const [ lasso, toggleLasso ] = React.useState(false);

  if (props.width === 0 || props.height === 0) {
    return null;
  }

  return (
    <Tree
      {...props}
      controlsVisible={controls}
      onControlsVisibleChange={toggleControls}
      lasso={lasso}
      onLassoChange={toggleLasso}
    >
      {!controls &&
        <Fade in>
          <Header />
        </Fade>}
    </Tree>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
