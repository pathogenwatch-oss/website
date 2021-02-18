import {
  LIBMR_HISTORY_SNAPSHOT,
  LIBMR_HISTORY_TRAVEL,
  LIBMR_HISTORY_REVERT,
} from './actions';

export function addHistory(reducer, initialState = reducer(undefined, {})) {
  return function (state = { snapshots: [], current: initialState }, action = {}) {
    switch (action.type) {
      case LIBMR_HISTORY_SNAPSHOT:
        return {
          ...state,
          snapshots: [
            state.current,
            ...state.snapshots,
          ],
        };
      case LIBMR_HISTORY_TRAVEL:
        return {
          ...state,
          current: state.snapshots[action.payload.index],
        };
      case LIBMR_HISTORY_REVERT:
        return {
          ...state,
          current: state.snapshots[state.snapshots.length - 1],
        };
      default:
        return {
          ...state,
          current: reducer(state.current, action),
        };
    }
  };
}

const initialState = {
  entries: [],
  current: null,
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case LIBMR_HISTORY_SNAPSHOT:
      return {
        ...state,
        entries: [
          action.payload.image,
          ...state.entries,
        ],
        current: 0,
      };
    case LIBMR_HISTORY_TRAVEL:
      return {
        ...state,
        current: action.payload.index,
      };
    case LIBMR_HISTORY_REVERT:
      return {
        ...state,
        current: state.entries.length - 1,
      };
    default:
      return state;
  }
}
