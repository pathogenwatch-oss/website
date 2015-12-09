import { displayTree } from '../actions/tree';
import { activateFilter, resetFilter } from '../actions/filter';

import { CGPS, COLOUR } from '^/defaults';

export const POPULATION = Symbol('population');

export const COLLECTION = Symbol('collection');

export const speciesTrees = new Set([ POPULATION, COLLECTION ]);

const titles = {
  [POPULATION]: 'Population',
  [COLLECTION]: 'Collection',
};

export function getTitle(tree, assemblies) {
  return titles[tree] || assemblies[tree].metadata.assemblyName;
}

const styles = {
  defaultLeaf: {
    leafStyle: {
      fillStyle: '#6B6B6B',
      lineWidth: 0,
    },
    labelStyle: {
      colour: 'rgba(0, 0, 0, 0.74)',
    },
  },
  emphasizedLeaf: {
    leafStyle: {
      fillStyle: CGPS.COLOURS.PURPLE_LIGHT,
      strokeStyle: COLOUR,
      lineWidth: 2,
    },
    labelStyle: {
      colour: CGPS.COLOURS.PURPLE,
      format: 'bold',
    },
  },
};

function getStandardTreeFunctions({ entities, tables, filter }, dispatch) {
  const { metadata, resistanceProfile } = tables;
  return {
    styleTree(tree) {
      tree.leaves.forEach((leaf) => {
        const assembly = entities.assemblies[leaf.id];
        leaf.setDisplay({
          leafStyle: {
            strokeStyle: COLOUR,
            fillStyle: resistanceProfile.activeColumn.valueGetter(assembly),
            lineWidth: 2,
          },
          labelStyle: styles.defaultLeaf.labelStyle,
        });

        leaf.label = metadata.activeColumn.valueGetter(assembly);
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
          leaf.label += `_ST${assembly.analysis.st}`;
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
