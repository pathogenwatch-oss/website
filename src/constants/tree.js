import { displayTree } from '../actions/tree';
import { activateFilter, resetFilter } from '../actions/filter';

import { CGPS } from '^/defaults';

export const POPULATION = Symbol('population');

export const COLLECTION = Symbol('collection');

const styles = {
  emphasizedNodeLabel: {
    colour: CGPS.COLOURS.PURPLE,
    format: 'bold',
  },
  collectionNodeLabel: {
    colour: 'rgba(0, 0, 0, 0.87)',
  },
  defaultLeaf: {
    colour: '#6B6B6B',
  },
  emphasizedLeaf: {
    colour: CGPS.COLOURS.PURPLE_LIGHT,
  },
};

function getStandardTreeFunctions({ entities, display, filter }, dispatch) {
  const { colourColumn, labelColumn } = display;
  return {
    styleTree(tree) {
      const style = { colour: null }; // caching object
      tree.leaves.forEach((leaf) => {
        const assembly = entities.assemblies[leaf.id];
        style.colour = colourColumn.valueGetter(assembly);
        leaf.setDisplay(style);
        leaf.labelStyle = styles.collectionNodeLabel;
        leaf.label = labelColumn.valueGetter(assembly);
        leaf.highlighted = (filter.active && filter.ids.has(leaf.id));
      });
    },
    onUpdated(event) {
      if (event.property !== 'selected') {
        return;
      }
      const { nodeIds } = event;
      if (nodeIds.length) {
        dispatch(activateFilter(new Set(nodeIds)));
      } else {
        dispatch(resetFilter());
      }
    },
    onRedrawOriginalTree() {
      dispatch(resetFilter());
    },
  };
}

function getPopulationTreeFunctions(state, dispatch) {
  const { entities, collection, filter } = state;
  const { trees, assemblies } = entities;

  const filterHasId = id => filter.ids.has(id);

  return {
    styleTree(tree) {
      for (const leaf of tree.leaves) {
        leaf.setDisplay(styles.defaultLeaf);

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

      for (const subtreeId of collection.subtreeIds) {
        const leaf = tree.branches[subtreeId];
        const { assemblyIds } = trees[subtreeId];

        if (leaf) {
          leaf.interactive = true;
          leaf.label = `${leaf.label} (${assemblyIds.length})`;
          leaf.setDisplay(styles.emphasizedLeaf);
          leaf.labelStyle = styles.emphasizedNodeLabel;
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
        dispatch(displayTree(nodeIds[0]));
      } else {
        dispatch(resetFilter());
      }
    },
  };
}

export function getTreeFunctions(tree, state, dispatch) {
  if (tree === POPULATION) {
    return getPopulationTreeFunctions(state, dispatch);
  }
  return getStandardTreeFunctions(state, dispatch);
}

export const defaultColourGetter = () => CGPS.COLOURS.PURPLE_LIGHT;
