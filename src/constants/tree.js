import { setSubtree } from '../actions/tree';
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

export function getTreeFunctions({ assemblies, filter }, dispatch) {
  return {
    styleTree(tree) {
      const style = { colour: null }; // caching object
      tree.leaves.forEach((leaf) => {
        const assembly = assemblies[leaf.id];
        style.colour = CGPS.COLOURS.PURPLE_LIGHT; // FilteredDataUtils.getColour(assembly);
        leaf.setDisplay(style);
        leaf.labelStyle = styles.collectionNodeLabel;
        leaf.label = assembly.metadata.assemblyName; // this.state.labelGetter(assembly);
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

export function getPopulationTreeFunctions(state, dispatch) {
  const { assemblies, subtrees, filter } = state;
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

      const subtreeIds = Object.keys(subtrees);

      for (const subtreeId of subtreeIds) {
        const leaf = tree.branches[subtreeId];
        const { assemblyIds } = subtrees[subtreeId];

        if (leaf) {
          leaf.interactive = true;
          leaf.label = `${leaf.label} (${subtrees[leaf.id].assemblyIds.length})`;
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
        dispatch(setSubtree(nodeIds[0]));
      }
    },
  };
}
