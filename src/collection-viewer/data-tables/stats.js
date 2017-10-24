import { SET_LABEL_COLUMN } from '../table/actions';

import { systemDataColumns } from './constants';
import * as constants from '../table/constants';
import { tableKeys } from '../constants';
import { onHeaderClick } from './thunks';

const initialState = {
  name: tableKeys.stats,
  activeColumn: constants.nameColumnProps,
  columns: [
    constants.leftSpacerColumn,
    constants.downloadColumnProps,
    constants.nameColumnProps,
    systemDataColumns.__core_matches,
    systemDataColumns['__%_core_families'],
    systemDataColumns['__%_non-core'],
    systemDataColumns.__genome_length,
    systemDataColumns.__n50,
    systemDataColumns['__no._contigs'],
    systemDataColumns['__non-ATCG'],
    systemDataColumns['__%_GC_Content'],
    constants.rightSpacerColumn,
  ],
  onHeaderClick,
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SET_LABEL_COLUMN: {
      if (payload.table !== tableKeys.stats) return state;
      return {
        ...state,
        activeColumn: payload.column,
      };
    }
    default:
      return state;
  }
}
