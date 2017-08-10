import { SHOW_GENOME_DETAILS, CLOSE_DRAWER } from './actions';

const initialState = { genome: null, loading: false, error: false };

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_GENOME_DETAILS.ATTEMPT:
      return {
        genome: null,
        loading: true,
      };
    case SHOW_GENOME_DETAILS.SUCCESS:
      return {
        genome: payload.result,
        loading: false,
      };
    case SHOW_GENOME_DETAILS.FAILURE:
      return {
        genome: null,
        loading: false,
        error: true,
      };
    case CLOSE_DRAWER:
      return initialState;
    default:
      return state;
  }
}
