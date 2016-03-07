import { LISTEN } from '../actions/bodyClick';

export default function (state = null, action = {}) {
  if (action.type === LISTEN) return action.listener;

  return state;
}
