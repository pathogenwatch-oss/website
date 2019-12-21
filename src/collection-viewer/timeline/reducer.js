import reducer from '@cgps/libmicroreact/timeline/reducer';
import { CLEAR_FILTERS } from '../filter/actions';

export default function (state, action = {}) {
  switch (action.type) {
    case CLEAR_FILTERS:
      return {
        ...state,
        bounds: null,
      };
    default:
      return reducer(state, action);
  }
}
