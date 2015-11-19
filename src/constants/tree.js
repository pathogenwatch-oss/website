import { setSubtree } from '../actions/tree';

// import FilteredDataUtils from '^/utils/FilteredData';


import { CGPS } from '^/defaults';


export const POPULATION = Symbol('population');

export const COLLECTION = Symbol('collection');


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

export const getTreeProps = {
  [POPULATION]: function ({ dispatch, assemblies, subtrees, filter }) {
    const filterHasId = id => filter.ids.has(id);

    return {
      title: 'Population',
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
          const { assemblyIds } = subtrees[subtreeId];

          if (leaf) {
            leaf.interactive = true;
            leaf.label = `${leaf.label} (${subtrees[leaf.id].assemblyIds.length})`;
            leaf.setDisplay(emphasizedLeafStyle);
            leaf.labelStyle = emphasizedNodeLabelStyle;
            leaf.highlighted = (filter.active && assemblyIds.some(filterHasId));
          }
        }
      },
      onUpdated(event) {
        if (event.property !== 'selected') {
          return;
        }
        const { nodeIds } = event;
        if (nodeIds.length === 1) {
          dispatch(setSubtree(nodeIds[0]));
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
