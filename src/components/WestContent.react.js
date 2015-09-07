import React from 'react';

import SpeciesTree from './SpeciesTree.react';
// import Subtree from './Subtree.react';

import SpeciesSubtreeStore from '../stores/SpeciesSubtreeStore';
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
    SpeciesSubtreeStore.addChangeListener(this.handleSubtreeStoreChange);
    this.collectionId = UploadedCollectionStore.getUploadedCollectionId();
  },

  componentWillUnmount() {
    SpeciesSubtreeStore.removeChangeListener(this.handleSubtreeStoreChange);
  },

  render: function () {
    // if (this.state.subtree) {
    //   return (
    //     <Subtree tree={this.state.subtree} />
    //   );
    // }

    return (
      <SpeciesTree />
    );
  },

  handleSubtreeStoreChange() {
    const id = SpeciesSubtreeStore.getActiveSpeciesSubtreeId();
    this.setState({
      subtree: id,
    });
  },

});
