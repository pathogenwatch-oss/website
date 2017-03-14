import { SHOW_METRIC } from './actions';

const initialState = 'totalNumberOfNucleotidesInDnaStrings';

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_METRIC:
      return payload.metric;
    default:
      return state;
  }
}
