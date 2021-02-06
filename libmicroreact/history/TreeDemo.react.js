import './TreeDemo.css';

import React from 'react';
import PropTypes from 'prop-types';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';

import AutoSizer from '../auto-sizer';
import SidePane from '../side-pane';
import Tree from '../tree';
import { mapDispatchToProps } from '../tree/TreeStoryContainer.react';
import History from './index';

import history, { addHistory } from './reducer';
import tree from '../tree/reducer';

import { snapshot, travel } from './actions';

const newick = '(Bovine:0.69395,(Gibbon:0.36079,(Orangutan:0.33636,(Gorilla:0.17147,(Chimp:0.19268,Human:0.11927):0.08386):0.06124):0.15057):0.54939,Mouse:1.21460);';

const initialState = tree(undefined, {});
const reducer = combineReducers({
  tree: addHistory(tree, {
    ...initialState,
    phylocanvas: {
      ...initialState.phylocanvas,
      source: newick,
    },
  }),
  history,
});

const ConnectedTree = connect(
  state => {
    const { current } = state.tree;
    return {
      ...current,
      phylocanvasState: current.phylocanvas,
    };
  },
  dispatch => ({
    ...mapDispatchToProps(dispatch, {}),
    onAddHistoryEntry: image => dispatch(snapshot(image)),
    onPhylocanvasInitialise: image => dispatch(snapshot(image)),
  })
)(Tree);

const ConnectedHistory = connect(
  state => state.history,
  dispatch => ({ onTravel: index => dispatch(travel(index)) }),
)(History);

const panes = [
  {
    title: 'History',
    icon: <i className="material-icons">history</i>,
    component: ConnectedHistory,
  },
];

const Layout = (dimensions) => (
  <SidePane style={dimensions} panes={panes} className="tree-demo">
    <AutoSizer component={ConnectedTree} />
  </SidePane>
);

Layout.propTypes = SidePane.propTypes;

const Container = () => {
  // new store for each story
  const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  );
  return (
    <Provider store={store}>
      <AutoSizer component={Layout} />
    </Provider>
  );
};

Container.displayName = 'Tree';

Container.propTypes = {
  children: PropTypes.element,
};

export default Container;
