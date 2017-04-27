import { FETCH_GENOME_SUMMARY, RESET_GENOMES } from '../actions';

const initialState = {
  total: 0,
  organismId: {},
  country: {},
  reference: {},
  owner: {},
  uploadedAt: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_GENOME_SUMMARY.ATTEMPT:
      return { ...initialState, loading: true };
    case FETCH_GENOME_SUMMARY.SUCCESS:
      return { ...state, loading: false, ...payload.result };
    case RESET_GENOMES:
      return initialState;
    default:
      return state;
  }
}
