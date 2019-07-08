import * as actions from './actions';

const initialState = {
  entities: {},
  showing: false,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.VIEWER_ADD_PRIVATE_METADATA: {
      const entities = {};
      for (const row of payload) {
        entities[row.name] = row;
      }
      return {
        ...state,
        entities,
      };
    }
    case actions.VIEWER_TOGGLE_ADD_METADATA:
      return {
        ...state,
        showing: !state.showing,
      };
    default:
      return state;
  }
}
