import { getTrees, getVisibleTree, getLeafIds } from './selectors';

import { showToast } from '../../toast';
import * as actions from './actions';
import { activateFilter, resetFilter } from '../filter/actions';

import { collapseTreeBranches } from './utils';
import { getSubtree } from '../../utils/Api';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';
import Species from '../../species';

function fetchTree(name) {
  return (dispatch, getState) => {
    const { collection } = getState();
    return dispatch(
      actions.fetchTree(name, getSubtree(Species.id, collection.id, name))
    );
  };
}

const errorToast = {
  message: 'Subtree currently unavailable, please try again later.',
};

export function displayTree(name) {
  return (dispatch, getState) => {
    const state = getState();
    const tree = getTrees(state)[name];

    if (tree && tree.newick) {
      dispatch(actions.setTree(name));
      return;
    }

    dispatch(fetchTree(name)).
      then(() => dispatch(actions.setTree(name))).
      catch(() => dispatch(showToast(errorToast)));
  };
}

export function treeLoaded(phylocanvas) {
  return (dispatch, getState) => {
    const state = getState();
    const stateKey = getVisibleTree(state).name;

    if (stateKey === POPULATION) {
      phylocanvas.root.cascadeFlag('interactive', false);
    } else if (stateKey !== COLLECTION) {
      const { collection } = state;
      collapseTreeBranches(
        phylocanvas.root,
        leaf => !collection.assemblyIds.has(leaf.id)
      );
    }

    const leafIds = getLeafIds(state, {
      stateKey: stateKey === POPULATION ? COLLECTION : stateKey,
    });

    dispatch(actions.treeLoaded(stateKey, {
      root: phylocanvas.root.id,
      step: phylocanvas.prerenderer.getStep(phylocanvas),
      leafIds: leafIds || phylocanvas.leaves.map(_ => _.id),
    }));
  };
}

export function subtreeLoaded(phylocanvas) {
  return (dispatch, getState) => {
    const state = getState();
    const stateKey = getVisibleTree(state).name;

    dispatch(actions.treeLoaded(stateKey, {
      root: phylocanvas.root.id,
      step: phylocanvas.prerenderer.getStep(phylocanvas),
      leafIds: phylocanvas.leaves.map(_ => _.id),
    }));
  };
}

export function treeClicked(event, phylocanvas) {
  return (dispatch, getState) => {
    if (event.property !== phylocanvas.clickFlag) {
      return;
    }

    const stateKey = getVisibleTree(getState()).name;

    if (stateKey === POPULATION) {
      const { nodeIds } = event;

      if (nodeIds.length === 1) {
        const name = nodeIds[0];
        dispatch(displayTree(name));
      } else {
        dispatch(resetFilter());
      }
    } else {
      const nodeIds = phylocanvas.getNodeIdsWithFlag(phylocanvas.clickFlag);

      if (nodeIds.length) {
        dispatch(activateFilter(nodeIds));
      } else {
        dispatch(resetFilter());
      }
    }
  };
}
