import { displayTree } from '../actions/tree';
import { activateFilter, resetFilter } from '../actions/filter';

import { formatColumnLabel } from '../constants/table';
import Species from '../species';
import { CGPS, COLOUR } from '^/defaults';


export const POPULATION = Symbol('population');

export const COLLECTION = Symbol('collection');

export const speciesTrees = new Set([ POPULATION, COLLECTION ]);

const titles = {
  [POPULATION]: 'Population',
  [COLLECTION]: 'Collection',
};

export function getTitle(tree, assembly) {
  return titles[tree] || assembly.metadata.assemblyName;
}

const styles = {
  defaultLeaf: {
    leafStyle: {
      fillStyle: CGPS.COLOURS.GREY,
      strokeStyle: COLOUR,
      lineWidth: 2,
    },
    labelStyle: {
      colour: COLOUR,
      format: 'bold',
    },
    shape: 'triangle',
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
    shape: 'circle',
  },
};

function getStandardTreeFunctions(state, dispatch) {
  const { entities, tables, filter, collection, reference } = state;
  const { metadata, resistanceProfile } = tables;

  const assemblyIdsInCollection = new Set(collection.assemblyIds);
  const assemblyIdsInReference = new Set(reference.assemblyIds);

  return {
    styleTree(tree) {
      tree.leaves.forEach((leaf) => {
        const assembly = entities.assemblies[leaf.id];

        if (assemblyIdsInCollection.has(leaf.id)) {
          leaf.labelStyle = styles.emphasizedLeaf.labelStyle;
          leaf.interactive = true;
        } else if (assemblyIdsInReference.has(leaf.id)) {
          leaf.nodeShape = 'triangle';
          leaf.labelStyle = {
            colour: COLOUR,
            format: 'bold',
          };
        } else {
          leaf.nodeShape = 'square';
        }

        leaf.setDisplay({
          leafStyle: {
            strokeStyle: COLOUR,
            fillStyle: resistanceProfile.activeColumn.valueGetter(
              assembly, assemblyIdsInCollection
            ),
            lineWidth: 2,
          },
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
  const { assemblies } = entities;

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

      for (const subtreeId of Object.keys(collection.subtrees)) {
        const leaf = tree.branches[subtreeId];
        const { assemblyIds } = collection.subtrees[subtreeId];

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
        const name = nodeIds[0];
        const tree = entities.trees[name];
        dispatch(displayTree( tree.name ? tree : { name }, collection.id));
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

export function defaultColourGetter(assembly, collectionAssemblyIds) {
  const { assemblyId } = assembly.metadata;
  if (!collectionAssemblyIds || collectionAssemblyIds.has(assemblyId)) {
    return CGPS.COLOURS.PURPLE_LIGHT;
  }

  return CGPS.COLOURS.GREY;
}

const TREE_LABELS_SUFFIX = 'tree_labels.txt';

export function getFilenames(title, collectionId, { columnKey }) {
  const formattedTitle = title.toLowerCase();
  const formattedColumnLabel = formatColumnLabel(columnKey).toLowerCase();
  const PREFIX = `wgsa_${Species.nickname}_${collectionId}_${formattedTitle}`;
  return {
    image: `${PREFIX}_tree.png`,
    leafLabels:
      title === titles[POPULATION] ?
        `${PREFIX}_${TREE_LABELS_SUFFIX}` :
        `${PREFIX}_${formattedColumnLabel}_${TREE_LABELS_SUFFIX}`,
    newick: `${PREFIX}.nwk`,
  };
}
