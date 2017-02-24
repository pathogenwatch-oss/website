import { FETCH_SPECIES_SUMMARY } from './actions';

const initialState = { wgsaSpecies: [], otherSpecies: [] };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_SPECIES_SUMMARY.ATTEMPT:
      return { ...state, loading: true };
    case FETCH_SPECIES_SUMMARY.SUCCESS:
      return { loading: false, ...payload.result };
    default:
      return state;
  }
}
