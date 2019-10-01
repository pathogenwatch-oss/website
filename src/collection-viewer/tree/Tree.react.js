import React from 'react';
import { connect } from 'react-redux';

import Tree from '@cgps/libmicroreact/tree';
import Fade from '~/components/fade';
import Spinner from '~/components/Spinner.react';
import Header from './Header.react';

import { getTreeStateKey, isLoading } from './selectors';
import {
  getVisibleTree,
  getPhylocanvasState,
  getHighlightedNodeIds,
} from './selectors/entities';

import { setHighlight } from '../highlight/actions';
import { displayTree } from './thunks';

import { POPULATION } from '~/app/stateKeys/tree';

function mapStateToProps(state) {
  const { name, loaded, lasso, path } = getVisibleTree(state);
  return {
    name, loaded, lasso, path,
    highlightedIds: getHighlightedNodeIds(state),
    phylocanvasState: getPhylocanvasState(state),
    loading: isLoading(state),
  };
}

const withStateKey = action =>
  (dispatch, getState) =>
    dispatch({
      stateKey: getTreeStateKey(getState()),
      ...action,
    });

const setPhylocanvasState = (state) =>
  withStateKey({
    type: 'SET PHYLOCANVAS STATE',
    payload: state,
  });

const onLassoChange = (active) =>
  withStateKey({
    type: 'SET TREE LASSO',
    payload: {
      lasso: active,
    },
  });

const setTreeFilter = (ids, path) =>
  (dispatch, getState) => {
    const stateKey = getTreeStateKey(getState());
    if (stateKey !== POPULATION) {
      dispatch({
        stateKey,
        type: 'SET TREE FILTER',
        payload: { ids, path },
      });
    }
  };

const setTreeHighlight = (ids, merge) =>
  (dispatch, getState) => {
    const stateKey = getTreeStateKey(getState());
    if (stateKey === POPULATION) {
      if (ids.length === 1) {
        dispatch(displayTree(ids[0]));
      }
    } else {
      dispatch(setHighlight(ids, merge));
    }
  };

function mapDispatchToProps(dispatch) {
  return {
    onPhylocanvasInitialise: console.log, // (image) => dispatch(addInitialTreeHistory(image)),
    onPhylocanvasStateChange: (state) => dispatch(setPhylocanvasState(state)),
    setHighlightedIds: (ids, merge) => dispatch(setTreeHighlight(ids, merge)),
    onFilterChange: (ids, path) => dispatch(setTreeFilter(ids, path)),
    onLassoChange: active => dispatch(onLassoChange(active)),
    onAddHistoryEntry: console.log, // (image) => dispatch(addTreeHistory(image)),
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
      <Fade in>
        {!controls && <Header key="header" />}
        { props.loading ?
          <div className="wgsa-loading-overlay" key="loading">
            <Spinner />
          </div> : null }
      </Fade>
    </Tree>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
