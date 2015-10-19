import '../css/spinner.css';

import React from 'react';

import Loading from './Loading.react';
import CollectionExplorer from './CollectionExplorer.react';

import CollectionStore from '../stores/CollectionStore';

import CollectionActionCreators from '../actions/CollectionActionCreators';
import AntibioticsActionCreators from '../actions/AntibioticsActionCreators';

import Species from '../species';

export default class Collection extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collectionStatus: null,
    };
  }

  componentWillMount() {
    AntibioticsActionCreators.fetch(Species.id);
  }

  componentDidMount() {
    CollectionStore.addChangeListener(this.handleCollectionStoreChange.bind(this));
    CollectionActionCreators.getCollection(Species.id, this.props.params.id);
  }

  componentWillUnmount() {
    CollectionStore.removeChangeListener(this.handleCollectionStoreChange.bind(this));
  }

  render() {
    if (this.state.collectionStatus === CollectionStore.states.LOADED) {
      return (
        <CollectionExplorer query={this.props.query} />
      );
    }

    return (
      <Loading error={this.state.collectionStatus} />
    );
  }

  handleCollectionStoreChange() {
    this.setState({
      collectionStatus: CollectionStore.status(),
    });
  }

}
