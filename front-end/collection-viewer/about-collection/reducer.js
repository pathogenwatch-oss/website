import { TOGGLE_ABOUT_COLLECTION } from './actions';

export default function (state = false, { type, payload }) {
  switch (type) {
    case TOGGLE_ABOUT_COLLECTION:
      return payload.isOpen;
    default:
      return state;
  }
}
