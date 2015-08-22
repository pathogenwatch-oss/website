import React from 'react';

import Loading from './Loading.react';
import CollectionExplorer from './CollectionExplorer.react';
import NotFound from './NotFound.react';
import CollectionActionCreators from '../actions/CollectionActionCreators';
import CollectionStore from '../stores/CollectionStore';

export default class Collection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      collection: null,
    };
  }

  handleCollectionStoreChange() {
    this.setState({
      collection: 'LOADED',
    });
  }

  componentDidMount() {
    CollectionStore.addChangeListener(this.handleCollectionStoreChange.bind(this));
    // TODO: Make species id dynamic
    CollectionActionCreators.getCollection('1280', this.props.params.id);
  }

  componentWillUnmount() {
    CollectionStore.removeChangeListener(this.handleCollectionStoreChange.bind(this));
  }

  render() {
    let component;

    if (this.state.error) {
      component = (
        <NotFound>
          Collection not found.
        </NotFound>
      );
    } else if (this.state.collection) {
      component = (
        <CollectionExplorer query={this.props.query} />
      );
    } else {
      component = (
        <Loading>
          Loading collection...
        </Loading>
      );
    }

    return component;
  }

}
