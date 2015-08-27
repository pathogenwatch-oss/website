import React from 'react';

import SpeciesTree from './SpeciesTree.react';
import SpeciesSubtree from './SpeciesSubtree.react';

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

  handleSubtreeStoreChange() {
    const id = SpeciesSubtreeStore.getActiveSpeciesSubtreeId();
    this.setState({
      subtree: (id === this.collectionId) ? 'Collection' : id,
    });
  },

  componentDidMount() {
    SpeciesSubtreeStore.addChangeListener(this.handleSubtreeStoreChange);
    this.collectionId = UploadedCollectionStore.getUploadedCollectionId();
  },

  componentWillUnmount() {
    SpeciesSubtreeStore.removeChangeListener(this.handleSubtreeStoreChange);
  },

  render: function () {
    const TreeComponent = this.state.subtree ? SpeciesSubtree : SpeciesTree;

    return (
      <TreeComponent
        treeId={this.state.subtree}
        width={this.props.width}
        height={this.props.height} />
    );
  },

});
