import { displayTree } from '../actions/tree';
import {
  setUnfilteredIds,
  activateFilter,
  resetFilter,
} from '../actions/filter';

import { createColourGetter } from '../utils/resistanceProfile';

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
  collectionLeaf: {
    leafStyle: {
      fillStyle: CGPS.COLOURS.PURPLE_LIGHT,
      strokeStyle: COLOUR,
      lineWidth: 1.5,
    },
    labelStyle: {
      colour: CGPS.COLOURS.PURPLE,
      format: 'bold',
    },
    shape: 'circle',
  },
  publicLeaf: {
    leafStyle: {
      fillStyle: CGPS.COLOURS.GREY,
      strokeStyle: COLOUR,
      lineWidth: 1.5,
    },
    labelStyle: {
      colour: 'rgba(33, 33, 33, 1)',
    },
    shape: 'square',
  },
  referenceLeaf: {
    leafStyle: {
      fillStyle: CGPS.COLOURS.GREY,
      strokeStyle: COLOUR,
      lineWidth: 1.5,
    },
    labelStyle: {
      colour: 'rgba(33, 33, 33, 1)',
      format: 'bold',
    },
    shape: 'triangle',
  },
};

function getStandardTreeFunctions(state, dispatch) {
  const { entities, tables, filter, collection, reference } = state;
  const { metadata, resistanceProfile } = tables;

  const getColour = createColourGetter(resistanceProfile.activeColumns);

  return {
    styleTree(tree) {
      tree.leaves.forEach((leaf) => {
        const assembly = entities.assemblies[leaf.id];

        if (collection.assemblyIds.has(leaf.id)) {
          leaf.setDisplay(styles.collectionLeaf);
        } else if (reference.assemblyIds.has(leaf.id)) {
          leaf.setDisplay(styles.referenceLeaf);
        } else {
          leaf.setDisplay(styles.publicLeaf);
        }

        // add dynamic leaf style
        leaf.setDisplay({
          leafStyle: {
            strokeStyle: COLOUR,
            fillStyle: getColour(assembly),
            lineWidth: 1.5,
          },
        });

        leaf.label = metadata.activeColumn.valueGetter(assembly);
        leaf.highlighted = (filter.active && filter.ids.has(leaf.id));
      });
    },
    onLoaded({ leaves }) {
      dispatch(setUnfilteredIds(leaves.map(_ => _.id)));
    },
    onUpdated(event, tree) {
      if (event.property !== tree.clickFlag) {
        return;
      }
      const nodeIds = tree.getNodeIdsWithFlag(tree.clickFlag);

      if (nodeIds.length) {
        dispatch(activateFilter(nodeIds));
      } else {
        dispatch(resetFilter());
      }
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
        leaf.setDisplay(styles.referenceLeaf);

        const assembly = assemblies[leaf.id];
        leaf.label = assembly ? assembly.metadata.assemblyName : leaf.id;
      }

      tree.root.cascadeFlag('interactive', false);

      for (const subtreeId of Object.keys(collection.subtrees)) {
        const leaf = tree.branches[subtreeId];
        const { assemblyIds, publicCount = 0 } = collection.subtrees[subtreeId];

        if (leaf) {
          leaf.interactive = true;
          leaf.label = `${leaf.label} (${assemblyIds.length}) [${publicCount}]`;
          leaf.setDisplay(styles.collectionLeaf);
          leaf.nodeShape = styles.referenceLeaf.shape;
          leaf.highlighted = (filter.active && assemblyIds.some(filterHasId));
        }
      }
    },
    onLoaded() {
      dispatch(setUnfilteredIds(collection.assemblyIds));
    },
    onUpdated(event, tree) {
      if (event.property !== tree.clickFlag) {
        return;
      }
      const { nodeIds } = event;
      if (nodeIds.length === 1) {
        const name = nodeIds[0];
        const subtree = entities.trees[name];
        dispatch(displayTree(subtree.name ? subtree : { name }, collection.id));
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

export function defaultColourGetter(assembly) {
  if (assembly.__isCollection) {
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
