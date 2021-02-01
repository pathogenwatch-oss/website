import history from '@cgps/libmicroreact/history/reducer';

export default function (state = {}, action) {
  if (action.stateKey) {
    const stateForKey = state[action.stateKey];
    return {
      ...state,
      [action.stateKey]: history(stateForKey, action),
    };
  }
  return state;
}
