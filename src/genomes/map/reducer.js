import { FETCH_GENOME_MAP } from '../actions';
import { SHOW_MARKER_POPUP, CLOSE_MARKER_POPUP } from './actions';
import { MAP_LASSO_CHANGE } from '../../map/actions';

const initialState = {
  markers: [],
  filter: null,
  popup: { position: null, genomes: [] },
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_GENOME_MAP.ATTEMPT:
    case CLOSE_MARKER_POPUP:
      return {
        ...state,
        popup: initialState.popup,
      };
    case FETCH_GENOME_MAP.SUCCESS: {
      return {
        ...state,
        markers: payload.result,
        filter: payload.filter,
      };
    }
    case SHOW_MARKER_POPUP.ATTEMPT: {
      return {
        ...state,
        popup: {
          position: payload.position,
          genomes: [],
        },
      };
    }
    case SHOW_MARKER_POPUP.SUCCESS: {
      return {
        ...state,
        popup: {
          ...state.popup,
          genomes: payload.result,
        },
      };
    }
    case MAP_LASSO_CHANGE: {
      if (!payload.path) {
        return {
          ...state,
          popup: initialState.popup,
        };
      }
      return state;
    }
    default:
      return state;
  }
}
