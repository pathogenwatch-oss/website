import { getCollection, getHighlightedIds } from '../../collection-viewer/selectors';
import { getTrees, getVisibleTree, getLeafIds } from './selectors';
import { getFilterState } from '../selectors';

import { showToast } from '../../toast';
import * as actions from './actions';
import {
  activateFilter,
  appendToFilter,
  resetFilter,
} from '../filter/actions';
import { setHighlight, clearHighlight } from '../highlight/actions';
import { updateProgress } from '../actions';

import { getTree } from './api';

import { POPULATION } from '../../app/stateKeys/tree';
import { filterKeys } from '../filter/constants';

function fetchTree(name) {
  return (dispatch, getState) => {
    const collection = getCollection(getState());
    return dispatch(
      actions.fetchTree(name, getTree(collection.uuid, name))
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
    const tree = getVisibleTree(state);
    if (!tree) return;
    const stateKey = tree.name;

    if (stateKey === POPULATION) {
      phylocanvas.root.cascadeFlag('interactive', false);
    }

    const leafIds = getLeafIds(state, { stateKey });
    dispatch(actions.treeLoaded(stateKey, phylocanvas, leafIds));
  };
}

export function subtreeLoaded(phylocanvas) {
  return (dispatch, getState) => {
    const state = getState();
    const stateKey = getVisibleTree(state).name;

    const leafIds = phylocanvas.leaves.map(_ => _.id);
    dispatch(actions.treeLoaded(stateKey, phylocanvas, leafIds));
    dispatch(actions.addHistorySnapshot(stateKey, phylocanvas));
  };
}

export function treeClicked(event, phylocanvas) {
  return (dispatch, getState) => {
    if (event.property !== phylocanvas.clickFlag) {
      return;
    }

    const state = getState();
    const stateKey = getVisibleTree(getState()).name;

    if (stateKey === POPULATION) {
      const { nodeIds } = event;

      if (nodeIds.length === 1) {
        const name = nodeIds[0];
        dispatch(displayTree(name));
      }
    } else {
      const nodeIds = phylocanvas.getNodeIdsWithFlag(phylocanvas.clickFlag);

      if (nodeIds.length === 1) {
        const [ id ] = nodeIds;
        dispatch(setHighlight([ id ], event.append));
      } else if (nodeIds.length === 0) {
        const highlightedIds = getHighlightedIds(state);
        if (highlightedIds.size > 1) {
          dispatch(clearHighlight());
        } else {
          dispatch(resetFilter(filterKeys.TREE));
        }
      } else {
        dispatch(
          event.append ?
            setHighlight(nodeIds, true) :
            activateFilter(nodeIds, filterKeys.TREE)
        );
      }
    }
  };
}

export function typeChanged(phylocanvas) {
  return (dispatch, getState) => {
    const state = getState();
    const stateKey = getVisibleTree(state).name;
    dispatch(actions.typeChanged(stateKey, phylocanvas));
    dispatch(actions.addHistorySnapshot(stateKey, phylocanvas));
  };
}

export function internalNodeSelected(node) {
  return (dispatch, getState) => {
    const state = getState();
    const stateKey = getVisibleTree(state).name;
    dispatch(actions.internalNodeSelected(stateKey, node ? node.id : null));
  };
}

export function handleTreeProgress(payload = {}) {
  return (dispatch) => {
    if (payload.task === 'tree' && payload.status === 'READY') {
      return dispatch(fetchTree(payload.name));
    }
    return dispatch(updateProgress(payload));
  };
}

export function resetTreeRoot() {
  return (dispatch, getState) => {
    const state = getState();
    const stateKey = getVisibleTree(state).name;
    dispatch(actions.resetTreeRoot(stateKey));
  };
}
