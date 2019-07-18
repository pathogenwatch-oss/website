import { SET_LABEL_COLUMN } from '../table/actions';

import { onHeaderClick } from './thunks';

import * as table from '../table/constants';
import { tableKeys } from '../constants';

const initialState = {
  name: tableKeys.metadata,
  activeColumn: table.nameColumnProps,
  onHeaderClick,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
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
