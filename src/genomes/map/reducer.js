import { FETCH_GENOME_MAP } from '../actions';
import { TOGGLE_MARKER_POPUP } from './actions';

const initialState = {
  markers: [],
  filter: null,
  popup: { position: null, genomes: [] },
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_GENOME_MAP.ATTEMPT: {
      return {
        ...state,
        popup: initialState.popup,
      };
    }
    case FETCH_GENOME_MAP.SUCCESS: {
      return {
        ...state,
        markers: payload.result,
        filter: payload.filter,
      };
    }
    case TOGGLE_MARKER_POPUP.ATTEMPT: {
      return {
        ...state,
        popup: {
          position: payload.position,
          genomes: [],
        },
      };
    }
    case TOGGLE_MARKER_POPUP.SUCCESS: {
      return {
        ...state,
        popup: {
          ...state.popup,
          genomes: payload.result,
        },
      };
    }
    default:
      return state;
  }
}
