import { FETCH_ENTITIES } from '../actions/fetch';

export function ready(state = false, action) {
  if (action.type === FETCH_ENTITIES) {
    return action.ready;
  }
  return state;
}

export function error(state = false, action) {
  if (action.type === FETCH_ENTITIES) {
    return (action.ready && action.error) || state;
  }
  return state;
}
