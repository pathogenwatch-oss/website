import React from 'react';

import Tree from './tree/Tree.react';
import Switch from './Switch.react';

import ReferenceCollectionStore from '../stores/ReferenceCollectionStore';
import SubtreeStore from '../stores/SubtreeStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';

import SubtreeActionCreators from '../actions/SubtreeActionCreators';
import FilteredDataActionCreators from '../actions/FilteredDataActionCreators';

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

const defaultLeafStyle = {
  colour: 'rgba(0, 0, 0, 0.54)',
};

const emphasizedLeafStyle = {
  colour: CGPS.COLOURS.PURPLE_LIGHT,
};

function styleBranches(ids, options) {
  for (const id of ids) {
    const branch = this.branches[id];
    if (branch) {
      branch.setDisplay(options);
    }
  }
}

const treeProps = {
  [POPULATION]: {
    title: 'Population',
    newick: '',
    styleTree(tree) {
      for (const leaf of tree.leaves) {
        leaf.setDisplay(defaultLeafStyle);
      }
      tree.root.cascadeFlag('interactive', false);

      const subtrees = SubtreeStore.getSubtrees();
      const subtreeIds = Object.keys(subtrees);

      styleBranches.call(tree, subtreeIds, emphasizedLeafStyle);

      for (const subtreeId of subtreeIds) {
        const leaf = tree.branches[subtreeId];
        if (leaf) {
          leaf.interactive = true;
          leaf.label = `${leaf.label} (${subtrees[leaf.id].assemblyIds.length})`;
          leaf.labelStyle = emphasizedNodeLabelStyle;
        }
      }
    },
    onUpdated(event) {
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
      const style = { colour: null }; // caching object
      tree.leaves.forEach((leaf) => {
        const assembly = UploadedCollectionStore.getAssemblies()[leaf.id];
        style.colour = FilteredDataUtils.getColour(assembly);
        leaf.setDisplay(style);
        leaf.labelStyle = collectionNodeLabelStyle;
      });
    },
    onUpdated(event) {
      if (event.property !== 'selected') {
        return;
      }
      const { nodeIds } = event;
      if (nodeIds.length) {
        FilteredDataActionCreators.setAssemblyIds(nodeIds);
      } else {
        FilteredDataActionCreators.clearAssemblyFilter();
      }
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

  componentDidUpdate() {
    FilteredDataActionCreators.clearAssemblyFilter();
  },

  render() {
    return (
      <Tree
        { ...this.state.treeProps }
        navButton={
          <div className="wgsa-switch-background wgsa-switch-background--see-through">
            <Switch
              id="tree-switcher"
              left={{ title: 'Population Tree', icon: 'nature' }}
              right={{ title: 'Collection Tree', icon: 'nature_people' }}
              onChange={this.handleTreeSwitch} />
          </div>
        } />
    );
  },

  handleTreeSwitch(checked) {
    this.setState({
      treeProps: checked ? treeProps[COLLECTION] : treeProps[POPULATION],
    });
  },

});
