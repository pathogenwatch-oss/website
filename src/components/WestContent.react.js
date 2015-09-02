import React from 'react';

// import SpeciesTree from './SpeciesTree.react';
import Tree from './Tree.react';

import SpeciesSubtreeStore from '../stores/SpeciesSubtreeStore';
import SpeciesTreeStore from '../stores/SpeciesTreeStore';
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
    const subtrees = SpeciesSubtreeStore.getSpeciesSubtrees();
    const treeId = Object.keys(subtrees)[0];
    return (
      <Tree
        title={this.state.subtree || 'Population'}
        newick={subtrees[treeId].newick} />
    );
  },

  handleSubtreeStoreChange() {
    const id = SpeciesSubtreeStore.getActiveSpeciesSubtreeId();
    this.setState({
      subtree: (id === this.collectionId) ? 'Collection' : id,
    });
  },

});
