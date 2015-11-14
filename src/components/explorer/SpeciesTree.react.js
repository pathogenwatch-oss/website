import React from 'react';
import { connect } from 'react-redux';

import Tree from '../tree/Tree.react';
import Switch from '../Switch.react';

import SubtreeActionCreators from '^/actions/SubtreeActionCreators';
import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

import FilteredDataUtils from '^/utils/FilteredData';
import { CGPS } from '^/defaults';

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
  colour: '#6B6B6B',
};

const emphasizedLeafStyle = {
  colour: CGPS.COLOURS.PURPLE_LIGHT,
};

const getTreeProps = {
  [POPULATION]: function ({ dispatch, assemblies, visibleAssemblyIds, subtrees }) {
    return {
      title: 'Population',
      newick: '',
      styleTree(tree) {
        for (const leaf of tree.leaves) {
          leaf.setDisplay(defaultLeafStyle);

          const assembly = assemblies[leaf.id];
          if (!assembly) {
            leaf.label = leaf.id;
            continue;
          }

          leaf.label = assembly.metadata.assemblyName;
          if (assembly.analysis) {
            leaf.label += `_${assembly.analysis.st}`;
          }
        }

        tree.root.cascadeFlag('interactive', false);

        const subtreeIds = Object.keys(subtrees);

        for (const subtreeId of subtreeIds) {
          const leaf = tree.branches[subtreeId];
          if (leaf) {
            leaf.interactive = true;
            leaf.label = `${leaf.label} (${subtrees[leaf.id].assemblyIds.length})`;
            leaf.setDisplay(emphasizedLeafStyle);
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
      highlightFilteredNodes({ branches }) {
        for (const id of Object.keys(subtrees)) {
          const leaf = branches[id];
          if (!leaf) {
            return;
          }

          leaf.highlighted = false;
          const { assemblyIds } = subtrees[id];
          for (const assemblyId of assemblyIds) {
            if (visibleAssemblyIds.indexOf(assemblyId) !== -1) {
              leaf.highlighted = true;
              break;
            }
          }
        }
      },
    };
  },
  [COLLECTION]: function ({ dispatch, assemblies }) {
    return {
      title: 'Collection',
      styleTree(tree) {
        const style = { colour: null }; // caching object
        tree.leaves.forEach((leaf) => {
          const assembly = assemblies[leaf.id];
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
      onRedrawOriginalTree() {
        FilteredDataActionCreators.setBaseAssemblyIds(Object.keys(assemblies));
      },
      setNodeLabels({ leaves }) {
        for (const leaf of leaves) {
          const assembly = assemblies[leaf.id];
          leaf.label = assembly.metadata.assemblyName; //this.state.labelGetter(assembly);
        }
      },
    };
  },
};

const SpeciesTree = React.createClass({

  displayName: 'SpeciesTree',

  propTypes: {
    assemblies: React.PropTypes.object,
    visibleAssemblyIds: React.PropTypes.array,
    subtrees: React.PropTypes.object,
    trees: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    dimensions: React.PropTypes.object,
  },

  getInitialState() {
    return {
      tree: POPULATION,
    };
  },

  componentWillMount() {
    this.treeProps = getTreeProps[POPULATION](this.props);
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tree !== this.state.tree) {
      FilteredDataActionCreators.setBaseAssemblyIds(
        Object.keys(this.props.assemblies)
      );
    }
  },

  render() {
    const { tree } = this.state;
    const newick = this.props.trees[tree];
    return (
      <Tree
        { ...this.treeProps }
        { ...this.props.dimensions }
        newick={newick}
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
    // this.setState({
    //   tree: checked ? COLLECTION : POPULATION,
    // });
  },

});

function mapStateToProps({ entities }) {
  const { reference, uploaded } = entities.collections;
  return {
    assemblies: reference.assemblies,
    visibleAssemblyIds: uploaded.assemblyIds,
    subtrees: entities.subtrees,
    trees: {
      [POPULATION]: reference.tree,
      [COLLECTION]: uploaded.tree,
    },
  };
}

export default connect(mapStateToProps)(SpeciesTree);
