import { UPLOAD_SETTING_CHANGED } from './actions';

const initialState = {
  compression: false,
  individual: false,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_SETTING_CHANGED: {
      return {
        ...state,
        [payload.setting]: payload.value,
      };
    }
    default:
      return state;
  }
}
