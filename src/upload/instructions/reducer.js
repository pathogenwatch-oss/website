import { UPLOAD_FETCH_ASSEMBLER_USAGE } from './actions';

const initialState = {
  compression: false,
  individual: false,
  loading: false,
  usage: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_FETCH_ASSEMBLER_USAGE.SUCCESS:
      return {
        ...state,
        usage: payload.result,
      };
    default:
      return state;
  }
}
