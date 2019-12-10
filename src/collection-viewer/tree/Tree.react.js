import React from 'react';
import { connect } from 'react-redux';

import Tree from '@cgps/libmicroreact/tree';
import Fade from '~/components/fade';
import Spinner from '~/components/Spinner.react';
import Header from './Header.react';

import { getTreeStateKey, isLoading } from './selectors';
import { getVisibleTree } from './selectors/entities';
import {
  getPhylocanvasState,
  getHighlightedNodeIds,
} from './selectors/phylocanvas';

import { snapshot } from '@cgps/libmicroreact/history/actions';
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

const setPhylocanvasState = (state, stateKey) => ({
  stateKey,
  type: 'SET PHYLOCANVAS STATE',
  payload: state,
});

const onLassoChange = (active, stateKey) => ({
  stateKey,
  type: 'SET TREE LASSO',
  payload: {
    lasso: active,
  },
});

const setTreeFilter = (ids, path, stateKey) =>
  (dispatch) => {
    if (stateKey !== POPULATION) {
      dispatch({
        stateKey,
        type: 'SET TREE FILTER',
        payload: { ids, path },
      });
    }
  };

const setTreeHighlight = (ids, merge, stateKey) =>
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
    onPhylocanvasInitialise: (image) => dispatch(snapshot(image, stateKey)),
    onPhylocanvasStateChange: (state) => dispatch(setPhylocanvasState(state, stateKey)),
    setHighlightedIds: (ids, merge) => dispatch(setTreeHighlight(ids, merge, stateKey)),
    onFilterChange: (ids, path) => dispatch(setTreeFilter(ids, path, stateKey)),
    onLassoChange: active => dispatch(onLassoChange(active, stateKey)),
    onAddHistoryEntry: (image) => dispatch(snapshot(image, stateKey)),
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
