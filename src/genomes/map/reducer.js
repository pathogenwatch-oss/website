import { FETCH_GENOME_MAP } from '../actions';

const initialState = {
  markers: [],
  filter: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_GENOME_MAP.SUCCESS: {
      return {
        markers: payload.result,
        filter: payload.filter,
      };
    }
    default:
      return state;
  }
}
