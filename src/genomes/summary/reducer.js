import { FETCH_GENOME_SUMMARY } from '../actions';

const initialState = { speciesId: {}, country: {}, reference: {}, owner: {} };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_GENOME_SUMMARY.ATTEMPT:
      return { ...state, loading: true };
    case FETCH_GENOME_SUMMARY.SUCCESS:
      return { ...state, loading: false, ...payload.result };
    default:
      return state;
  }
}
