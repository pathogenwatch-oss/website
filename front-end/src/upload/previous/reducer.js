import { FETCH_UPLOADS } from './actions';

const initialState = {
  loading: false,
  error: false,
  uploads: [],
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_UPLOADS.ATTEMPT: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_UPLOADS.FAILURE: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case FETCH_UPLOADS.SUCCESS: {
      return {
        ...state,
        loading: false,
        uploads: payload.result,
      };
    }
    default:
      return state;
  }
}
