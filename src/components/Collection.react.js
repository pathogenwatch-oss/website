import '../css/spinner.css';

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Loading from './Loading.react';
import CollectionExplorer from './CollectionExplorer.react';

import CollectionStore from '../stores/CollectionStore';

import CollectionActionCreators from '../actions/CollectionActionCreators';
import AntibioticsActionCreators from '../actions/AntibioticsActionCreators';

import Species from '../species';

const store = createStore(function (state = { message: 'Hello World!' }, action) {
  return state;
});

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
    AntibioticsActionCreators.fetch(Species.id);
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
