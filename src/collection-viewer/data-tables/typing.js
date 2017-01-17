import { FETCH_ENTITIES } from '../../actions/fetch';
import { SET_LABEL_COLUMN, setLabelColumn } from '../table/actions';

import { getMetadataTable } from '../table/selectors';
import { downloadColumnProps, nameColumnProps } from '../table/constants';
import { systemDataColumns } from './constants';

import Species from '../../species';

const initialActiveColumn = nameColumnProps;

const initialState = {
  activeColumn: initialActiveColumn,
  columns: [
    downloadColumnProps,
    nameColumnProps,
    systemDataColumns.__wgsa_reference,
    systemDataColumns.__mlst,
    systemDataColumns.__mlst_profile,
    systemDataColumns['__ng-mast'],
    systemDataColumns.__por,
    systemDataColumns.__tbpb,
    systemDataColumns.__genotyphi_type,
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

function showOrHideColumns(columns, uiOptions) {
  if (!uiOptions) return columns;

  for (const column of columns) {
    switch (column.columnKey) {
      case '__wgsa_reference':
        column.hidden = !!uiOptions.noPopulation;
        continue;
      case '__mlst':
      case '__mlst_profile':
        column.hidden = !!uiOptions.noMLST;
        continue;
      case '__ng-mast':
      case '__por':
      case '__tbpb':
        column.hidden = !uiOptions.ngMast;
        continue;
      case '__genotyphi_type':
        column.hidden = !uiOptions.genotyphi;
        continue;
      default:
        continue;
    }
  }

  return columns;
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_ENTITIES.SUCCESS:
      return {
        ...state,
        columns: showOrHideColumns(state.columns, Species.uiOptions),
      };
    case SET_LABEL_COLUMN:
      return {
        ...state,
        activeColumn: payload.column,
      };
    default:
      return state;
  }
}
