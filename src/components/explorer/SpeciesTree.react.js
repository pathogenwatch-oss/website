import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import Tree from '../tree/Tree.react';
import Switch from '../Switch.react';

import { switchTree } from '^/actions/tree';
import SubtreeActionCreators from '^/actions/SubtreeActionCreators';
import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

// import FilteredDataUtils from '^/utils/FilteredData';
import { CGPS } from '^/defaults';

import { POPULATION, COLLECTION } from '^/constants/tree';

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
          style.colour = CGPS.COLOURS.PURPLE_LIGHT; // FilteredDataUtils.getColour(assembly);
          leaf.setDisplay(style);
          leaf.labelStyle = collectionNodeLabelStyle;
          leaf.label = assembly.metadata.assemblyName; //this.state.labelGetter(assembly);
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
    };
  },
};

const SpeciesTree = React.createClass({

  displayName: 'SpeciesTree',

  propTypes: {
    assemblies: React.PropTypes.object,
    visibleAssemblyIds: React.PropTypes.array,
    subtrees: React.PropTypes.object,
    newicks: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    displayedTree: React.PropTypes.any,
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
    const { displayedTree, newicks, dispatch } = this.props;
    return (
      <Tree
        { ...getTreeProps[displayedTree](this.props) }
        newick={newicks[displayedTree]}
        navButton={
          <div className="wgsa-switch-background wgsa-switch-background--see-through">
            <Switch
              id="tree-switcher"
              left={{ title: 'Population Tree', icon: 'nature' }}
              right={{ title: 'Collection Tree', icon: 'nature_people' }}
              checked={displayedTree === COLLECTION}
              onChange={(checked) =>
                dispatch(switchTree(checked ? COLLECTION : POPULATION))} />
          </div>
        } />
    );
  },

});

function mapStateToProps({ entities, display }) {
  const { reference, uploaded } = entities.collections;
  return {
    assemblies: assign({}, reference.assemblies, uploaded.assemblies),
    visibleAssemblyIds: uploaded.assemblyIds,
    subtrees: entities.subtrees,
    newicks: {
      [POPULATION]: reference.tree,
      [COLLECTION]: uploaded.tree,
    },
    displayedTree: display.tree,
  };
}

export default connect(mapStateToProps)(SpeciesTree);
