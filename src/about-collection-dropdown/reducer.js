import { TOGGLE_ABOUT_COLLECTION } from './actions';
import { BODY_CLICK } from '../actions/bodyClick';

export default function (state = false, { type, payload }) {
  switch (type) {
    case TOGGLE_ABOUT_COLLECTION:
      return payload.isOpen;
    case BODY_CLICK:
      return false;
    default:
      return state;
  }
}
