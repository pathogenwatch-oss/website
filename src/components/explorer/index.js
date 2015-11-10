import '../../css/spinner.css';

import React from 'react';
import { Provider } from 'react-redux';

import Loading from './Loading.react';
import CollectionExplorer from './CollectionExplorer.react';

import store from '^/store';
import CollectionStore from '^/stores/CollectionStore';

import { fetchAntibiotics } from '^/actions/antibiotics';
import { fetchCollection } from '^/actions/collection';

import Species from '^/species';

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
    store.dispatch(fetchCollection(Species.id, this.props.params.id));
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
