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
      collection: null,
    };

    this.checkGetCollection = this.checkGetCollection.bind(this);
  }

  componentWillMount() {
    AntibioticsActionCreators.fetch(Species.id);
  }

  componentDidMount() {
    CollectionStore.addChangeListener(this.handleCollectionStoreChange.bind(this));

    this.checkGetCollection();
  }

  componentDidUpdate() {
    this.checkGetCollection();
  }

  componentWillUnmount() {
    CollectionStore.removeChangeListener(this.handleCollectionStoreChange.bind(this));
  }

  render() {
    if (this.state.collection) {
      return (
        <CollectionExplorer query={this.props.query} />
      );
    }

    return (
      <Loading />
    );
  }

  handleCollectionStoreChange() {
    this.setState({
      collection: 'LOADED',
    });
  }

  checkGetCollection() {
    if (!this.state.isUploading && !this.state.collection) {
      CollectionActionCreators.getCollection(Species.id, this.props.params.id);
    }
  }
}
