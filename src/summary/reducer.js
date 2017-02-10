import { FETCH_SUMMARY } from './actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case FETCH_SUMMARY.SUCCESS:
      return {
        ...state,
        ...payload.result,
      };
    default:
      return state;
  }
}
