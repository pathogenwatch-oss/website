import { PREFILTER } from './actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case PREFILTER:
      return {
        ...state,
        [payload.stateKey]: payload.name,
      };
    default:
      return state;
  }
}
