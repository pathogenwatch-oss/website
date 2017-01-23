import { FETCH_ENTITIES } from '../../actions/fetch';
import { SET_LABEL_COLUMN } from '../table/actions';
import { onHeaderClick } from './thunks';

import { getTypingColumns } from './utils';

import * as constants from '../table/constants';
import { systemDataColumns } from './constants';

import Species from '../../species';

const { tableKeys } = constants;

const initialState = {
  name: tableKeys.typing,
  activeColumn: constants.nameColumnProps,
  columns: [],
  onHeaderClick,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ENTITIES.SUCCESS: {
      const columns =
        getTypingColumns(Species.uiOptions).
          map(columnKey => systemDataColumns[columnKey]);

      return {
        ...state,
        columns: [
          constants.leftSpacerColumn,
          constants.downloadColumnProps,
          constants.nameColumnProps,
          ...columns,
          constants.rightSpacerColumn,
        ],
        active: columns.length > 0,
      };
    }
    case SET_LABEL_COLUMN:
      if (payload.table !== tableKeys.typing) return state;
      return {
        ...state,
        activeColumn: payload.column,
      };
    default:
      return state;
  }
}
