import React from 'react';

import SpeciesTree from './SpeciesTree.react';
import Subtree from './Subtree.react';

import SubtreeStore from '../stores/SubtreeStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';

export default React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  getInitialState() {
    return {
      subtree: null,
    };
  },

  componentDidMount() {
    SubtreeStore.addChangeListener(this.handleSubtreeStoreChange);
    this.collectionId = UploadedCollectionStore.getCollectionId();
  },

  componentWillUnmount() {
    SubtreeStore.removeChangeListener(this.handleSubtreeStoreChange);
  },

  render: function () {
    if (this.state.subtree) {
      return (
        <Subtree treeName={this.state.subtree} />
      );
    }

    return (
      <SpeciesTree />
    );
  },

  handleSubtreeStoreChange() {
    this.setState({
      subtree: SubtreeStore.getActiveSubtreeId(),
    });
  },

});
