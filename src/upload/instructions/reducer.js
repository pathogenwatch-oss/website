import { UPLOAD_SETTING_CHANGED } from './actions';

const initialState = {
  compression: false,
  individual: false,
  loading: false,
  assemblerUsage: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_SETTING_CHANGED: {
      return {
        ...state,
        [payload.setting]: payload.value,
      };
    }
    case 'FETCH_ASSEMBLER_USAGE::ATTEMPT':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_ASSEMBLER_USAGE::SUCCESS':
      return {
        ...state,
        loading: false,
        assemblerUsage: payload.result,
      };
    default:
      return state;
  }
}
