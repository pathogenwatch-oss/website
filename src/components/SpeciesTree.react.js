import React from 'react';

import Tree from './tree/Tree.react';
import TreeSwitcher from './tree/TreeSwitcher.react';

import SpeciesTreeStore from '../stores/SpeciesTreeStore';
import SpeciesSubtreeStore from '../stores/SpeciesSubtreeStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import SpeciesSubtreeActionCreators from '../actions/SpeciesSubtreeActionCreators';

import { CGPS } from '../defaults';

const POPULATION = Symbol('population');
const COLLECTION = Symbol('collection');

const emphasizedNodeLabelStyle = {
  colour: CGPS.COLOURS.PURPLE,
  format: 'bold',
};

const collectionNodeLabelStyle = {
  colour: 'rgba(0, 0, 0, 0.87)',
};

const trees = {
  [POPULATION]: {
    title: 'Population',
    newick: '',
    styleTree(tree) {
      const branchIds = Object.keys(tree.branches);

      tree.setNodeDisplay(branchIds, { colour: 'rgba(0, 0, 0, 0.54)' });
      tree.root.cascadeFlag('interactive', false);

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
  },
  [COLLECTION]: {
    title: 'Collection',
    newick: '',
    styleTree(tree) {
      const branchIds = Object.keys(tree.branches);
      tree.setNodeDisplay(branchIds, { colour: CGPS.COLOURS.PURPLE_LIGHT });
      branchIds.forEach((id) => {
        const branch = tree.branches[id];
        if (branch) {
          branch.labelStyle = collectionNodeLabelStyle;
        }
      });
    },
  },
};

export default React.createClass({

  getInitialState() {
    return {
      tree: trees[POPULATION],
    };
  },

  componentWillMount() {
    trees[POPULATION].newick = SpeciesTreeStore.getSpeciesTree();
    const collectionId = UploadedCollectionStore.getUploadedCollectionId();
    trees[COLLECTION].newick = SpeciesSubtreeStore.getSpeciesSubtree(collectionId).newick;
  },

  componentDidMount() {
    componentHandler.upgradeDom();
  },

  render() {
    return (
      <Tree
        { ...this.state.tree }
        NavButton={TreeSwitcher}
        navOnChange={this.handleTreeSwitch} />
    );
  },

  handleTreeSwitch(checked) {
    this.setState({
      tree: checked ? trees[COLLECTION] : trees[POPULATION],
    });
  },

  setActiveSubtree(key) {
    SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(key);
  },

});
