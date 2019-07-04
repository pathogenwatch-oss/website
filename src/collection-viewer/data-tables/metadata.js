import { FETCH_COLLECTION } from '../../collection-viewer/actions';
import { SET_LABEL_COLUMN } from '../table/actions';
// import { SET_TREE } from '../tree/actions';
import { onHeaderClick } from './thunks';

import { hasMetadata } from './utils';

import * as table from '../table/constants';
import { tableKeys, statuses } from '../constants';

const initialState = {
  name: tableKeys.metadata,
  activeColumn: table.nameColumnProps,
  onHeaderClick,
  active: true,
};

export default function (state = initialState, { type, payload }) {
  // if (!state.active) return state;
  switch (type) {
    case FETCH_COLLECTION.SUCCESS: {
      const { genomes, status } = payload.result;

      if (status !== statuses.READY) return state;

      return {
        ...state,
        active: hasMetadata(genomes),
      };
    }
    case SET_LABEL_COLUMN: {
      if (payload.table !== tableKeys.metadata) return state;
      return {
        ...state,
        activeColumn: payload.column,
      };
    }
    default:
      return state;
  }
}
