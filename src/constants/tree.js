import { displayTree } from '../actions/tree';
import {
  setUnfilteredIds,
  activateFilter,
  resetFilter,
} from '../collection-viewer/filter/actions';

import { getFilter } from '../collection-viewer/selectors';

import { createColourGetter } from '../utils/resistanceProfile';

import { getColumnLabel } from '../table/utils';

import Species from '../species';
import { CGPS, DEFAULT } from '^/app/constants';


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
      strokeStyle: DEFAULT.COLOUR,
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
      strokeStyle: DEFAULT.COLOUR,
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
      strokeStyle: DEFAULT.COLOUR,
      lineWidth: 1.5,
    },
    labelStyle: {
      colour: 'rgba(33, 33, 33, 1)',
      format: 'bold',
    },
    shape: 'triangle',
  },
};

function collapseTreeBranches(node, leafPredicate) {
  if (node.leaf) {
    node.collapsed = false;
    return leafPredicate(node);
  }
  const childrenToCollapse = node.children.reduce((memo, child) => {
    const flag = collapseTreeBranches(child, leafPredicate);
    if (flag) memo.push(child);
    return memo;
  }, []);
  const someCollapsed = childrenToCollapse.length < node.children.length;
  if (someCollapsed) {
    for (const child of childrenToCollapse) {
      if (!child.leaf) child.collapsed = true;
    }
  }
  return !someCollapsed;
}

function getStandardTreeFunctions(state, dispatch) {
  const { entities, tables, collection, reference } = state;
  const { metadata, resistanceProfile } = tables;
  const filter = getFilter(state);
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
            strokeStyle: DEFAULT.COLOUR,
            fillStyle: getColour(assembly),
            lineWidth: 1.5,
          },
        });

        leaf.label = metadata.activeColumn.valueGetter(assembly);
        leaf.highlighted = (filter.active && filter.ids.has(leaf.id));
      });
    },
    onLoaded({ leaves, root }) {
      collapseTreeBranches(root, leaf => !collection.assemblyIds.has(leaf.id));
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
  const { entities, collection } = state;
  const { assemblies } = entities;
  const filter = getFilter(state);

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

const TREE_LABELS_SUFFIX = 'tree_labels.txt';

export function getFilenames(title, collectionId, column) {
  const formattedTitle = title.toLowerCase();
  const formattedColumnLabel = getColumnLabel(column).toLowerCase();
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
