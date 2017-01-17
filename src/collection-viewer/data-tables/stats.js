import { SET_LABEL_COLUMN } from '../table/actions';

import { downloadColumnProps, nameColumnProps, tableKeys } from '../table/constants';
import { systemDataColumns } from './constants';
import { initialActiveColumn, onHeaderClick } from './utils';

const initialState = {
  name: tableKeys.stats,
  activeColumn: initialActiveColumn,
  columns: [
    downloadColumnProps,
    nameColumnProps,
    systemDataColumns.__core_matches,
    systemDataColumns['__%_core_families'],
    systemDataColumns['__%_non-core'],
    systemDataColumns.__assembly_length,
    systemDataColumns.__n50,
    systemDataColumns['__no._contigs'],
    systemDataColumns['__non-ATCG'],
    systemDataColumns.__GC_Content,
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
