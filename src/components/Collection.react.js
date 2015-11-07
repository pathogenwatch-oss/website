import '../css/spinner.css';

import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import Loading from './Loading.react';
import CollectionExplorer from './CollectionExplorer.react';

import CollectionStore from '../stores/CollectionStore';

import CollectionActionCreators from '../actions/CollectionActionCreators';
import { fetchAntibiotics } from '../actions/AntibioticsActionCreators';

import Species from '../species';


const readyStatePromise = () => next => action => {
  if (!action.promise) {
    return next(action);
  }

  function makeAction(ready, data) {
    const newAction = Object.assign({}, action, { ready }, data);
    delete newAction.promise;
    return newAction;
  }

  next(makeAction(false));

  return action.promise.then(
    result => next(makeAction(true, { result })),
    error => next(makeAction(true, { error }))
  );
};

const store = applyMiddleware(readyStatePromise)(createStore)(
  (state = {}, { result = {} }) => {
    if (!result) return state;

    return {
      antibiotics: Object.keys(result),
    };
  }
);

export default React.createClass({

  propTypes: {
    params: React.PropTypes.shape({
      id: React.PropTypes.string,
    }),
    query: React.PropTypes.string,
  },

  getInitialState() {
    return {
      collectionStatus: null,
    };
  },

  componentWillMount() {
    store.dispatch(fetchAntibiotics(Species.id));
  },

  componentDidMount() {
    CollectionStore.addChangeListener(this.handleCollectionStoreChange);
    CollectionActionCreators.getCollection(Species.id, this.props.params.id);
  },

  componentWillUnmount() {
    CollectionStore.removeChangeListener(this.handleCollectionStoreChange);
  },

  render() {
    if (this.state.collectionStatus === CollectionStore.states.LOADED) {
      return (
        <Provider store={store}>
          <CollectionExplorer query={this.props.query} />
        </Provider>
      );
    }

    return (
      <Loading error={this.state.collectionStatus} />
    );
  },

  handleCollectionStoreChange() {
    this.setState({
      collectionStatus: CollectionStore.status(),
    });
  },

});
