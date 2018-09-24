import {
  SET_HIGHLIGHT,
  REMOVE_FROM_HIGHLIGHT,
  CLEAR_HIGHLIGHT,
} from './actions';

const emptySet = new Set();

const initialState = {
  ids: emptySet,
};

export default function (state = initialState, { type, payload = {} }) {
  const { ids } = payload || {};
  switch (type) {
    case SET_HIGHLIGHT:
      return {
        ...state,
        ids: payload.append ?
          new Set([ ...state.ids, ...ids ]) :
          new Set(ids),
      };
    case REMOVE_FROM_HIGHLIGHT: {
      const newIds = Array.from(state.ids).filter(id => !ids.has(id));
      if (newIds.length) {
        return {
          ...state,
          ids: new Set(newIds),
        };
      }
      return {
        ...state,
        ids: emptySet,
      };
    }
    case CLEAR_HIGHLIGHT:
      return {
        ...state,
        ids: emptySet,
      };
    default:
      return state;
  }
}
