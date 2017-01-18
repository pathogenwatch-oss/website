import { FETCH_ENTITIES } from '../../actions/fetch';
import { SET_LABEL_COLUMN } from '../table/actions';
import { SET_TREE } from '../tree/actions';

import { onHeaderClick } from './thunks';
import { hasMetadata, getUserDefinedValue } from './utils';

import { speciesTrees } from '../tree/constants';
import * as table from '../table/constants';
import { systemDataColumns } from './constants';

import Species from '../../species';

const { tableKeys } = table;

const initialState = {
  name: tableKeys.metadata,
  activeColumn: table.nameColumnProps,
  columns: [],
  onHeaderClick,
  active: true,
};

function getUserDefinedColumnNames(assemblies) {
  const columnNames = new Set();
  Object.keys(assemblies).forEach(key => {
    const { userDefined } = assemblies[key].metadata;
    if (userDefined) {
      Object.keys(userDefined).
        filter(name => !/__colou?r$/.test(name)).
        forEach(name => columnNames.add(name));
    }
  });
  return columnNames;
}

function getUserDefinedColumnProps(columnNames) {
  columnNames.delete('__date');
  return Array.from(columnNames).map(column => ({
    columnKey: column,
    valueGetter(data) {
      return getUserDefinedValue(column, data);
    },
  }));
}

function getActiveColumn(currentActiveColumn, newColumns) {
  if (newColumns.indexOf(currentActiveColumn) !== -1) {
    return currentActiveColumn;
  }
  return table.nameColumnProps;
}

const systemColumnProps = [
  table.leftSpacerColumn,
  table.downloadColumnProps,
  table.nameColumnProps,
  systemDataColumns.__date,
];

export default function (state = initialState, { type, payload }) {
  if (!state.active) return state;
  switch (type) {
    case FETCH_ENTITIES.SUCCESS: {
      const [ { assemblies } ] = payload.result;
      const { publicMetadataColumnNames = [] } = Species.current;

      if (!hasMetadata(assemblies)) {
        return {
          ...state,
          active: false,
        };
      }

      const columnNames = getUserDefinedColumnNames(assemblies);
      const columnProps = [
        ...systemColumnProps,
        ...getUserDefinedColumnProps(columnNames),
        table.rightSpacerColumn,
      ];

      return {
        ...state,
        columnProps,
        publicMetadataColumnProps:
          publicMetadataColumnNames.length ?
            [ ...systemColumnProps,
              ...getUserDefinedColumnProps(publicMetadataColumnNames),
              table.rightSpacerColumn,
            ] :
            columnProps,
        columns: columnProps,
      };
    }
    case SET_TREE: {
      const columnProps =
        speciesTrees.has(payload.name) ?
          state.userDefinedColumnProps :
          state.publicMetadataColumnProps;

      return {
        ...state,
        columns: columnProps,
        activeColumn: getActiveColumn(state.activeColumn, columnProps),
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
