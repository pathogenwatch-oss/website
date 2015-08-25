import React from 'react';

import Loading from './Loading.react';
import CollectionExplorer from './CollectionExplorer.react';
import UploadingFilesDetailed from './collection/UploadingFilesDetailed.react';

import FileUploadingStore from '../stores/FileUploadingStore';
import CollectionStore from '../stores/CollectionStore';

import CollectionActionCreators from '../actions/CollectionActionCreators';

import Species from '../species';

export default class Collection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isUploading: FileUploadingStore.getFileUploadingState(),
      collection: null,
    };
    this.checkGetCollection = this.checkGetCollection.bind(this);
  }

  componentDidMount() {
    CollectionStore.addChangeListener(this.handleCollectionStoreChange.bind(this));
    FileUploadingStore.addChangeListener(this.handleFileUploadingStoreChange.bind(this));

    this.checkGetCollection();
  }

  componentDidUpdate() {
    this.checkGetCollection();
  }

  componentWillUnmount() {
    CollectionStore.removeChangeListener(this.handleCollectionStoreChange.bind(this));
    FileUploadingStore.removeChangeListener(this.handleFileUploadingStoreChange.bind(this));
  }

  render() {
    console.dir(this.state);
    if (this.state.isUploading) {
      return (
        <UploadingFilesDetailed />
      );
    }

    if (this.state.collection) {
      return (
        <CollectionExplorer query={this.props.query} />
      );
    }

    return (
      <Loading>
        Loading collection...
      </Loading>
    );
  }

  handleCollectionStoreChange() {
    this.setState({
      collection: 'LOADED',
    });
  }

  handleFileUploadingStoreChange() {
    if (FileUploadingStore.getFileUploadingResult() === FileUploadingStore.getFileUploadingResults().SUCCESS) {
      this.setState({
        isUploading: false,
      });
    }
  }

  checkGetCollection() {
    if (!this.state.isUploading && !this.state.collection) {
      CollectionActionCreators.getCollection(Species.id, this.props.params.id);
    }
  }
}
