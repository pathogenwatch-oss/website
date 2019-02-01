import { GET_AUTH_TOKEN } from './actions';

const initialState = {
  token: '123',
};

export default function (state = initialState, { payload, type }) {
  switch (type) {
    case GET_AUTH_TOKEN.SUCCESS:
      return {
        ...state,
        token: payload.result.token,
      };
    default:
      return state;
  }
}
