import React from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import Tree from './index';
import AutoSizer from '../auto-sizer';

import reducer from './reducer';
import { setPhylocanvasState, setLassoActive, setTreeFilter } from './actions';

const mapStateToProps = (state) => ({
  ...state,
  phylocanvasState: state.phylocanvas,
});

export const mapDispatchToProps = (dispatch) => ({
  onPhylocanvasStateChange: (state) => dispatch(setPhylocanvasState(state)),
  onLassoChange: (active) => dispatch(setLassoActive(active)),
  onFilterChange: (ids, path) => dispatch(setTreeFilter(ids, path)),
});

const ConnectedTree = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tree);

const initialState = reducer(undefined, {});

const Container = (props) => {
  // new store for each story
  const store = createStore(
    reducer,
    {
      ...initialState,
      phylocanvas: {
        ...initialState.phylocanvas,
        ...props.phylocanvasState,
      },
    },
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  );
  return (
    <Provider store={store}>
      <AutoSizer>
        {({ width, height }) => (
          <ConnectedTree
            {...props}
            height={height}
            width={width}
          />
        )}
      </AutoSizer>
    </Provider>
  );
};

Container.displayName = 'Tree';

Container.propTypes = Tree.propTypes;

export default Container;
