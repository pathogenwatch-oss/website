import { UPDATE_HEADER } from '../actions/header';

const initialState = {
  speciesName: null,
  classNames: null,
  content: null,
};

const actions = {
  [UPDATE_HEADER]: function (state, { update = {} }) {
    return Object.assign({}, state, update);
  },
};

export default { actions, initialState };
