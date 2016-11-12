import { getTrees, getLeafIds } from './selectors';

import { showToast } from '../../toast';
import * as actions from './actions';

import { POPULATION, COLLECTION } from '../../app/stateKeys/tree';
import { getSubtree } from '../../utils/Api';
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

export function treeLoaded(stateKey, phylocanvas) {
  return (dispatch, getState) => {
    const leafIds = getLeafIds(getState(), {
      stateKey: stateKey === POPULATION ? COLLECTION : stateKey,
    });

    dispatch(actions.treeLoaded(stateKey, {
      step: phylocanvas.prerenderer.getStep(phylocanvas),
      leafIds: leafIds || phylocanvas.leaves.map(_ => _.id),
    }));
  };
}
