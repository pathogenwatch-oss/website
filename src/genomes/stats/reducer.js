import { SHOW_METRIC } from './actions';
import { FETCH_GENOME_STATS } from '../actions';

const initialState = {
  entities: [],
  metric: 'length',
  filter: null,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_GENOME_STATS.SUCCESS:
      return {
        ...state,
        entities: payload.result,
        filter: payload.filter,
      };
    case SHOW_METRIC:
      return {
        ...state,
        metric: payload.metric,
      };
    default:
      return state;
  }
}
