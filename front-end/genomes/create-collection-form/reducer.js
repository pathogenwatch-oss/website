import { CHANGE_COLLECTION_METADATA } from './actions';

const initialMetadata = { title: '', description: '', pmid: '' };

export default function (state = initialMetadata, { type, payload }) {
  switch (type) {
    case CHANGE_COLLECTION_METADATA:
      return { ...state, ...payload };
    default:
      return state;
  }
}
