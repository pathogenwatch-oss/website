import { getCollection } from '../selectors';
import { getTrees } from './selectors/entities';

import { showToast } from '../../toast';
import * as actions from './actions';
import { updateProgress } from '../actions';

import { getTree } from './api';

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

    if (!tree || tree.status !== 'READY') return;

    if (tree.newick) {
      dispatch(actions.setTree(name));
      return;
    }

    dispatch(fetchTree(name))
      .then(() => dispatch(actions.setTree(name)))
      .catch(() => dispatch(showToast(errorToast)));
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
