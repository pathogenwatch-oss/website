import React from 'react';
import { connect } from 'react-redux';

import Tree from '@cgps/libmicroreact/tree';
import Fade from '~/components/fade';
import Header from './Header.react';

import * as selectors from './selectors';
import { getHighlightedIdArray } from '../highlight/selectors';

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
  const { name, loaded, lasso, path } = selectors.getVisibleTree(state);
  return {
    name, loaded, lasso, path,
    highlightedIds: getHighlightedIdArray(state),
    phylocanvasState: selectors.getPhylocanvasState(state),
    filenames: selectors.getFilenames(state),
    loading: selectors.isLoading(state),
  };
}

const withStateKey = action =>
  (dispatch, getState) =>
    dispatch({
      stateKey: selectors.getTreeStateKey(getState()),
      ...action,
    });

const setPhylocanvasState = (state) =>
  withStateKey({
    type: 'SET PHYLOCANVAS STATE',
    payload: state,
  });

const setTreeFilter = (ids, path) =>
  withStateKey({
    type: 'SET TREE FILTER',
    payload: { ids, path },
  });

const onLassoChange = (active) =>
  withStateKey({
    type: 'SET TREE LASSO',
    payload: {
      lasso: active,
    },
  });

function mapDispatchToProps(dispatch) {
  return {
    onPhylocanvasInitialise: console.log, // (image) => dispatch(addInitialTreeHistory(image)),
    onPhylocanvasStateChange: (state) => dispatch(setPhylocanvasState(state)),
    setHighlightedIds: (ids, merge) => dispatch(setHighlight(ids, merge)),
    onFilterChange: (ids, path) => dispatch(setTreeFilter(ids, path)),
    onLassoChange: active => dispatch(onLassoChange(active)),
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

  if (props.width === 0 || props.height === 0) {
    return null;
  }

  return (
    <Tree
      {...props}
      controlsVisible={controls}
      onControlsVisibleChange={toggleControls}
    >
      {!controls &&
        <Fade in>
          <Header />
        </Fade>}
    </Tree>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
