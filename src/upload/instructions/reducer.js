import {
  UPLOAD_SETTING_CHANGED,
  UPLOAD_FETCH_ASSEMBLER_USAGE,
  UPLOAD_VALIDATION_ERROR,
} from './actions';

const initialState = {
  compression: false,
  individual: false,
  loading: false,
  usage: null,
  message: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_SETTING_CHANGED: {
      return {
        ...state,
        [payload.setting]: payload.value,
      };
    }
    case UPLOAD_FETCH_ASSEMBLER_USAGE.SUCCESS:
      return {
        ...state,
        usage: payload.result,
      };
    case UPLOAD_VALIDATION_ERROR:
      return {
        ...state,
        message: payload,
      };
    default:
      return state;
  }
}
