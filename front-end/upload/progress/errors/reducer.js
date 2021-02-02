import {
  UPLOAD_TOGGLE_ERRORS,
} from './actions';

const initialState = {
  showing: false,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case UPLOAD_TOGGLE_ERRORS:
      return {
        ...state,
        showing: !state.showing,
      };

    default:
      return state;
  }
}
