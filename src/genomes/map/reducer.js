import { FETCH_GENOME_MAP } from '../actions';
import { TOGGLE_MARKER_POPUP } from './actions';

const initialState = {
  markers: [],
  filter: null,
  popup: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_GENOME_MAP.ATTEMPT: {
      return {
        ...state,
        popup: null,
      };
    }
    case FETCH_GENOME_MAP.SUCCESS: {
      return {
        markers: payload.result,
        filter: payload.filter,
      };
    }
    case TOGGLE_MARKER_POPUP: {
      if (!payload) {
        return {
          ...state,
          popup: null,
        };
      }
      return {
        ...state,
        popup: state.popup === payload ? null : payload,
      };
    }
    default:
      return state;
  }
}
