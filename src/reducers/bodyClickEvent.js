import { BODY_CLICK } from '../actions/bodyClick';

export default function (state = null, action = {}) {
  if (action.type === BODY_CLICK) return action.event;

  return state;
}
