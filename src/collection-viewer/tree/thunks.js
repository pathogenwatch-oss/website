import { showToast } from '../../toast';

import { getTrees } from './selectors';

import { getSubtree } from '../../utils/Api';
import Species from '../../species';

import * as actions from './actions';

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
