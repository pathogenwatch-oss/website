import React from 'react';

import Tree from './Tree.react';

import SpeciesTreeStore from '../stores/SpeciesTreeStore';
import SpeciesSubtreeStore from '../stores/SpeciesSubtreeStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import SpeciesSubtreeActionCreators from '../actions/SpeciesSubtreeActionCreators';

import { CGPS } from '../defaults';

const emphasizedNodeLabelStyle = {
  colour: CGPS.COLOURS.PURPLE,
  format: 'bold',
};

const navButtonConfig = {
  title: 'View Collection Tree',
  icon: 'nature',
};

export default React.createClass({

  componentWillMount() {
    this.tree = SpeciesTreeStore.getSpeciesTree();
    this.collectionId = UploadedCollectionStore.getUploadedCollectionId();
  },

  render() {
    return (
      <Tree
        title={'Population'}
        newick={SpeciesTreeStore.getSpeciesTree()}
        navButton={navButtonConfig}
        styleTree={this.styleTree} />
    );
  },

  setNodeLabel(nodeLabel) {
    Object.keys(this.props.isolates).forEach((isolateId) => {
      const isolate = this.props.isolates[isolateId];

      if (this.phylocanvas.branches[isolateId] && this.phylocanvas.branches[isolateId].leaf) {
        this.phylocanvas.branches[isolateId].label = isolate[nodeLabel] || '';
      }
    });
  },

  setActiveSubtree(key) {
    SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(key);
  },

  styleTree(tree) {
    this.setNodeDefaults(tree);
    this.emphasizeNodesWithSubtrees(tree);
  },

  setNodeDefaults(tree) {
    const branchIds = Object.keys(tree.branches);
    tree.setNodeDisplay(branchIds, { colour: 'rgba(0, 0, 0, 0.54)' });
    tree.root.cascadeFlag('interactive', false);
  },

  emphasizeNodesWithSubtrees(tree) {
    const subtrees = SpeciesSubtreeStore.getSpeciesSubtrees();
    const subtreeIds = Object.keys(subtrees);

    tree.setNodeDisplay(subtreeIds, { colour: CGPS.COLOURS.PURPLE_LIGHT });

    subtreeIds.forEach((id) => {
      const branch = tree.branches[id];
      if (branch) {
        branch.interactive = true;
        branch.label = `${branch.label} (${subtrees[id].assemblyIds.length})`;
        branch.labelStyle = emphasizedNodeLabelStyle;
      }
    });
  },

});
