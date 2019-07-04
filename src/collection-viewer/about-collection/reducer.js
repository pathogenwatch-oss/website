import { TOGGLE_ABOUT_COLLECTION } from './actions';
import { COLLECTION_ADD_PRIVATE_METADATA } from '../private-metadata/actions';

export default function (state = false, { type, payload }) {
  switch (type) {
    case TOGGLE_ABOUT_COLLECTION:
      return payload.isOpen;
    case COLLECTION_ADD_PRIVATE_METADATA:
      return false;
    default:
      return state;
  }
}
