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
    console.log('in a state', FileUploadingStore.getFileUploadingState());
  }

  handleCollectionStoreChange() {
    this.setState({
      collection: 'LOADED',
    });
  }

  componentWillMount() {

  }

  componentDidMount() {
    CollectionStore.addChangeListener(this.handleCollectionStoreChange.bind(this));
    CollectionActionCreators.getCollection(Species.id, this.props.params.id);
  }

  componentWillUnmount() {
    CollectionStore.removeChangeListener(this.handleCollectionStoreChange.bind(this));
  }

  render() {
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

}
