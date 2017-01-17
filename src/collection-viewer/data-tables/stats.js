import { SET_LABEL_COLUMN, setLabelColumn } from '../table/actions';

import { getMetadataTable } from '../table/selectors';
import { downloadColumnProps, nameColumnProps, tableKeys } from '../table/constants';
import { systemDataColumns } from './constants';

const initialActiveColumn = nameColumnProps;

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
  onHeaderClick(event, column) {
    return (dispatch, getState) => {
      const state = getState();
      const { activeColumn } = getMetadataTable(state);

      dispatch(setLabelColumn(
        activeColumn === column ? initialActiveColumn : column
      ));
    };
  },
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SET_LABEL_COLUMN: {
      if (payload.name !== state.name) return state;
      return {
        ...state,
        activeColumn: payload.column,
      };
    }
    default:
      return state;
  }
}
