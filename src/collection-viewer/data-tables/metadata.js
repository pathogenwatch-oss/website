import { FETCH_ENTITIES } from '../../actions/fetch';
import { SET_LABEL_COLUMN } from '../table/actions';
import { SET_TREE } from '../tree/actions';

import { onHeaderClick } from './thunks';
import { getUserDefinedValue } from './utils';

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
};

function getUserDefinedColumnNames(assemblies) {
  const userDefinedColumnNames = new Set();
  Object.keys(assemblies).forEach(key => {
    const { userDefined } = assemblies[key].metadata;
    if (userDefined) {
      Object.keys(userDefined).
        filter(name => !/__colou?r$/.test(name)).
        forEach(name => userDefinedColumnNames.add(name));
    }
  });
  return userDefinedColumnNames;
}

function getUserDefinedColumnProps(columnNames) {
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
  switch (type) {
    case FETCH_ENTITIES.SUCCESS: {
      const [ { assemblies } ] = payload.result;
      const { publicMetadataColumnNames = [] } = Species.current;

      const columnNames = getUserDefinedColumnNames(assemblies);

      const userDefinedColumnProps = [
        ...systemColumnProps,
        ...getUserDefinedColumnProps(columnNames),
        table.rightSpacerColumn,
      ];

      return {
        ...state,
        userDefinedColumnProps,
        publicMetadataColumnProps:
          publicMetadataColumnNames.length ?
            [ ...systemColumnProps,
              ...getUserDefinedColumnProps(publicMetadataColumnNames),
              table.rightSpacerColumn,
            ] :
            userDefinedColumnProps,
        columns: userDefinedColumnProps,
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
