import React from 'react';

import Tree from './tree/Tree.react';
import TreeSwitcher from './tree/TreeSwitcher.react';

import ReferenceCollectionStore from '../stores/ReferenceCollectionStore';
import SubtreeStore from '../stores/SubtreeStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import SubtreeActionCreators from '../actions/SubtreeActionCreators';

import FilteredDataUtils from '../utils/FilteredData';
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

const treeProps = {
  [POPULATION]: {
    title: 'Population',
    newick: '',
    styleTree(tree) {
      const branchIds = Object.keys(tree.branches);

      tree.setNodeDisplay(branchIds, { colour: 'rgba(0, 0, 0, 0.54)' });
      tree.root.cascadeFlag('interactive', false);

      const subtrees = SubtreeStore.getSubtrees();
      const subtreeIds = Object.keys(subtrees);

      tree.setNodeDisplay(subtreeIds, { colour: CGPS.COLOURS.PURPLE_LIGHT });

      for (const subtreeId of subtreeIds) {
        const leaf = tree.branches[subtreeId];
        leaf.interactive = true;
        leaf.label = `${leaf.label} (${subtrees[leaf.id].assemblyIds.length})`;
        leaf.labelStyle = emphasizedNodeLabelStyle;
      }
    },
    leafSelected(event) {
      if (event.property !== 'selected') {
        return;
      }

      const { nodeIds } = event;
      if (nodeIds.length === 1) {
        SubtreeActionCreators.setActiveSubtreeId(nodeIds[0]);
      }
    },
  },
  [COLLECTION]: {
    title: 'Collection',
    newick: '',
    styleTree(tree) {
      tree.leaves.forEach((leaf) => {
        const assembly = UploadedCollectionStore.getAssemblies()[leaf.id];
        tree.setNodeDisplay([ leaf.id ], { colour: FilteredDataUtils.getColour(assembly) });
        leaf.labelStyle = collectionNodeLabelStyle;
      });
    },
  },
};

export default React.createClass({

  getInitialState() {
    return {
      treeProps: treeProps[POPULATION],
    };
  },

  componentWillMount() {
    treeProps[POPULATION].newick = ReferenceCollectionStore.getTree();
    treeProps[COLLECTION].newick = UploadedCollectionStore.getTree();
  },

  render() {
    return (
      <Tree
        { ...this.state.treeProps }
        navButton={<TreeSwitcher onChange={this.handleTreeSwitch}/>} />
    );
  },

  handleTreeSwitch(checked) {
    this.setState({
      treeProps: checked ? treeProps[COLLECTION] : treeProps[POPULATION],
    });
  },

});
