import {
  LIBMR_TIMELINE_BOUNDS,
  LIBMR_TIMELINE_NODE_SIZE,
  LIBMR_TIMELINE_SPEED,
  LIBMR_TIMELINE_UNIT,
  LIBMR_TIMELINE_VIEWPORT,
} from './actions';

const initialState = {
  bounds: null,
  nodeSize: 14,
  speed: '1',
  unit: 'day',
  viewport: null,
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LIBMR_TIMELINE_BOUNDS:
      return {
        ...state,
        bounds: action.payload,
      };
    case LIBMR_TIMELINE_NODE_SIZE:
      return {
        ...state,
        nodeSize: action.payload,
      };
    case LIBMR_TIMELINE_SPEED:
      return {
        ...state,
        speed: action.payload,
      };
    case LIBMR_TIMELINE_UNIT:
      return {
        ...state,
        unit: action.payload,
        bounds: initialState.bounds,
      };
    case LIBMR_TIMELINE_VIEWPORT:
      return {
        ...state,
        viewport: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
