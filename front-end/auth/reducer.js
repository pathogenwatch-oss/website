import { GET_AUTH_TOKEN } from './actions';

const initialState = {
  token: null,
  pending: false,
};

export default function (state = initialState, { payload, type }) {
  switch (type) {
    case GET_AUTH_TOKEN.ATTEMPT:
      return {
        ...state,
        pending: true,
      };
    case GET_AUTH_TOKEN.SUCCESS:
      return {
        ...state,
        token: payload.result.token,
        pending: false,
      };
    case GET_AUTH_TOKEN.FAILURE:
      return {
        pending: false,
      };
    default:
      return state;
  }
}
