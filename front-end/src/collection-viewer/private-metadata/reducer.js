import * as actions from './actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case actions.VIEWER_ADD_PRIVATE_METADATA: {
      const nextState = { ...state };
      for (const row of payload) {
        if (row.name in nextState) continue;
        nextState[row.name] = row;
      }
      return nextState;
    }
    case actions.VIEWER_CLEAR_PRIVATE_METADATA:
      return {};
    default:
      return state;
  }
}
