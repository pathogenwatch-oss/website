import {
  SET_UNFILTERED_IDS,
  ACTIVATE_FILTER,
  APPEND_TO_FILTER,
  REMOVE_FROM_FILTER,
  RESET_FILTER,
} from './actions';


const initialState = {
  active: false,
  unfilteredIds: new Set(),
  ids: new Set(),
};

export default function (state = initialState, { type, payload = {} }) {
  const { ids } = payload;
  switch (type) {
    case SET_UNFILTERED_IDS: {
      const noReset =
        state.active && Array.from(ids).some(id => state.ids.has(id));
      return {
        ...state,
        unfilteredIds: ids,
        ids: noReset ? state.ids : new Set(),
        active: noReset,
      };
    }
    case ACTIVATE_FILTER:
      return {
        ...state,
        active: true,
        ids,
      };
    case APPEND_TO_FILTER:
      return {
        ...state,
        active: true,
        ids: new Set([ ...state.ids, ...ids ]),
      };
    case REMOVE_FROM_FILTER:
      return {
        ...state,
        active: true,
        ids: new Set(Array.from(state.ids).filter(id => !ids.has(id))),
      };
    case RESET_FILTER:
      return {
        ...state,
        active: false,
        ids: new Set(),
      };
    default:
      return state;
  }
}
