import React from 'react';
import { connect } from 'react-redux';

import Tree from '@cgps/libmicroreact/tree';
import Fade from '~/components/fade';
import Spinner from '~/components/Spinner.react';
import Header from './Header.react';

import { isLoading, getVisibleLibMRTree } from './selectors';
import {
  getPhylocanvasState,
  getHighlightedNodeIds,
  getFilenames,
} from './selectors/phylocanvas';

import { snapshot /* , revert */ } from '@cgps/libmicroreact/history/actions';
import {
  setLassoActive,
  setPhylocanvasState,
  setTreeFilter,
} from '@cgps/libmicroreact/tree/actions';
import { setHighlight } from '../highlight/actions';
import { displayTree } from './thunks';

import {
  addExportCallback,
  removeExportCallback,
} from '@cgps/libmicroreact/utils/downloads';
import { POPULATION } from '~/app/stateKeys/tree';

function mapStateToProps(state) {
  const { lasso, path } = getVisibleLibMRTree(state);
  return {
    lasso, path,
    filenames: getFilenames(state),
    highlightedIds: getHighlightedNodeIds(state),
    loading: isLoading(state),
    phylocanvasState: getPhylocanvasState(state),
  };
}

const setTreeHighlight = (stateKey, ids, merge) =>
  (dispatch) => {
    if (stateKey === POPULATION) {
      if (ids.length === 1) {
        dispatch(displayTree(ids[0]));
      }
    } else {
      dispatch(setHighlight(ids, merge));
    }
  };

function mapDispatchToProps(dispatch, { stateKey }) {
  return {
    onAddHistoryEntry: image => dispatch({ stateKey, ...snapshot(image) }),
    onFilterChange: (ids, path) => stateKey !== POPULATION && dispatch({ stateKey, ...setTreeFilter(ids, path, stateKey) }),
    onLassoChange: active => dispatch({ stateKey, ...setLassoActive(active) }),
    onPhylocanvasInitialise: image => dispatch({ stateKey, ...snapshot(image) }),
    onPhylocanvasStateChange: state => dispatch({ stateKey, ...setPhylocanvasState(state) }),
    // onRedrawOriginalTree: () => dispatch({ stateKey, ...revert() }),
    setHighlightedIds: (ids, merge) => dispatch(setTreeHighlight(stateKey, ids, merge)),
  };
}

const TreeExtras = ({ controlsVisible = false, loading }) => (
  <Fade in>
    {!controlsVisible && <Header key="header" />}
    { loading ?
      <div className="wgsa-loading-overlay" key="loading">
        <Spinner />
      </div> : null }
  </Fade>
);

const Component = (props) => {
  if (props.width === 0 || props.height === 0) {
    return null;
  }

  return (
    <Tree
      {...props}
      addExportCallback={addExportCallback}
      removeExportCallback={removeExportCallback}
    >
      <TreeExtras loading={props.loading} />
    </Tree>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
