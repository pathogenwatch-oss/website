import treeReducer from '@cgps/libmicroreact/tree/reducer';
import { addHistory } from '@cgps/libmicroreact/history/reducer';

const reducer = addHistory(treeReducer);

export default function (state = {}, action) {
  if (action.stateKey) {
    const treeState = state[action.stateKey];
    return {
      ...state,
      [action.stateKey]: reducer(treeState, action),
    };
  }
  return state;
}
